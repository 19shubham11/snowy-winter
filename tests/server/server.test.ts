import fastify from 'fastify'
import assert from 'assert'

import { api } from '../../src/store/redis'
import { redisInstance } from '../redis.setup'
import { getRoutes } from '../../src/server/routes'

import { ShortenURLRequest, ShortenURLResponse, URLStatsResponse } from '../../src/models'

describe('API Integration Tests', () => {
    const redirectURL = '/redirectHere'

    const redis = api(redisInstance)
    const router = getRoutes(redis, redirectURL)

    const server = fastify()
    server.register(router)

    afterAll((done) => {
        redisInstance.flushdb()
        redisInstance.quit()
        done()
    })

    afterEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    describe('GET /internal/health', () => {
        it('Should return 200', async () => {
            const res = await server.inject().get('/internal/health')
            const { statusCode, body } = res

            assert.deepStrictEqual(statusCode, 200)
            assert.deepStrictEqual(body, 'OK')
        })
    })

    describe('POST /shorten', () => {
        it('Should return 200 for a valid url', async () => {
            const reqData: ShortenURLRequest = {
                url: 'http://www.google.com',
            }

            const res = await server.inject().post('/shorten').body(reqData)

            const { statusCode, body } = res
            const resp = JSON.parse(body) as ShortenURLResponse

            assert.deepStrictEqual(statusCode, 200)
            assert(resp.shortenedURL)
            assert.match(resp.shortenedURL, /redirectHere/)
        })

        it('Should return 400 if the request body does not contain url key', async () => {
            const reqData = {
                url1: 'http://www.google.com',
            }

            const res = await server.inject().post('/shorten').body(reqData)
            assert.deepStrictEqual(res.statusCode, 400)
        })

        it('Should return 400 if the url is invalid', async () => {
            const reqData: ShortenURLRequest = {
                url: 'abcdsdfjsdfjdlf',
            }

            const res = await server.inject().post('/shorten').body(reqData)
            assert.deepStrictEqual(res.statusCode, 400)
        })

        it('Should return 500 if db returns an error', async () => {
            jest.spyOn(redis, 'mset').mockImplementation(() => {
                return Promise.reject('nope')
            })

            const reqData: ShortenURLRequest = {
                url: 'http://www.google.com',
            }

            const res = await server.inject().post('/shorten').body(reqData)
            assert.deepStrictEqual(res.statusCode, 500)
        })
    })

    describe('GET /{id}', () => {
        it('Should return 302 and redirect to the input page if the given key exists', async () => {
            const key = 'a4a6e725'
            const website = 'http://www.reddit.com'

            redis.set(key, website)

            const res = await server.inject().get(`/${key}`)

            const { statusCode } = res
            assert.deepStrictEqual(statusCode, 302)
        })

        it('Should return 404 if the id does not exist in the database', async () => {
            const key = 'LetsUseThisKey'
            const res = await server.inject().get(`/${key}`)

            const { statusCode, body } = res

            assert.deepStrictEqual(statusCode, 404)
            assert.match(body, /Not Found/)
        })

        it('Should return 500 if db returns an error', async () => {
            jest.spyOn(redis, 'get').mockImplementation(() => {
                return Promise.reject('nope')
            })

            const res = await server.inject().get(`/something`)
            assert.deepStrictEqual(res.statusCode, 500)
        })
    })

    describe('GET /{id}/stats', () => {
        it('Should return 200 for a newly created id with no stats', async () => {
            // create a new shortenedURL
            const reqData: ShortenURLRequest = {
                url: 'http://www.google.com',
            }

            const res1 = await server.inject().post('/shorten').body(reqData)
            const resp = JSON.parse(res1.body) as ShortenURLResponse

            // shortenedURL
            const url = resp.shortenedURL
            const createdHash = url.split('/').pop()

            const res = await server.inject().get(`/${createdHash}/stats`)
            const { body, statusCode } = res
            const stats = JSON.parse(body) as URLStatsResponse

            assert.deepStrictEqual(statusCode, 200)
            assert.deepStrictEqual(stats, {
                url: reqData.url,
                hits: 0,
            })
        })

        it('Should return 200 for an existing id with stats', async () => {
            // create a new shortenedURL
            const reqData: ShortenURLRequest = {
                url: 'http://www.google.com',
            }

            const res1 = await server.inject().post('/shorten').body(reqData)
            const resp = JSON.parse(res1.body) as ShortenURLResponse

            // shortenedURL
            const url = resp.shortenedURL
            const createdHash = url.split('/').pop()

            const noOfRequests = 50
            // call GET /id 50 times
            const promises = []
            for (let i = 0; i < noOfRequests; i++) {
                promises.push(server.inject().get(`/${createdHash}`))
            }
            await Promise.all(promises)

            const res = await server.inject().get(`/${createdHash}/stats`)
            const { body, statusCode } = res
            const stats = JSON.parse(body) as URLStatsResponse

            assert.deepStrictEqual(statusCode, 200)
            assert.deepStrictEqual(stats, {
                url: reqData.url,
                hits: noOfRequests,
            })
        })

        it('Should return 404 if the id does not exist in the database', async () => {
            const key = 'DoesNotExists'
            const res = await server.inject().get(`/${key}/stats`)

            const { statusCode, body } = res

            assert.deepStrictEqual(statusCode, 404)
            assert.match(body, /Not Found/)
        })

        it('Should return 500 if db returns an error', async () => {
            jest.spyOn(redis, 'mget').mockImplementation(() => {
                return Promise.reject('nope')
            })

            const res = await server.inject().get(`/something/stats`)

            assert.deepStrictEqual(res.statusCode, 500)
        })
    })
})
