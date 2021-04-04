import { redis } from '../redis.setup'
import supertest from 'supertest'
import express from 'express'
import assert from 'assert'
import bodyParser from 'body-parser'
import { router } from '../../src/server/routes'
import { ShortenURLRequest, ShortenURLResponse, URLStatsResponse } from '../../src/models'
import * as store from '../../src/store/datastore'

const app = express()
app.use(bodyParser.json())
app.use('/', router)
const appURL = 'unnamedURLShortener'
app.set('APP_URL', appURL)

const request = supertest(app)

describe('API Integration Tests', () => {
    afterAll((done) => {
        redis.flushdb()
        redis.quit()
        done()
    })

    afterEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })

    describe('GET /internal/health', () => {
        it('Should return 200', async () => {
            const res = await request.get('/internal/health')
            const { status, text } = res

            assert.deepStrictEqual(status, 200)
            assert.deepStrictEqual(text, 'OK')
        })
    })

    describe('POST /shorten', () => {
        it('Should return 200 for a valid url', async () => {
            const reqData: ShortenURLRequest = {
                url: 'http://www.google.com',
            }

            const res = await request.post('/shorten').set('Content-type', 'application/json').send(reqData)

            const { status, body } = res
            const resp = body as ShortenURLResponse

            assert.deepStrictEqual(status, 200)
            assert(resp.shortenedURL)
            // the resulting url will of of the form `unnamedURLShortener/35fc0271`
            assert.match(resp.shortenedURL, /unnamedURLShortener/)
        })

        it('Should return 400 if the request body does not contain url key', async () => {
            const reqData = {
                url1: 'http://www.google.com',
            }
            await request.post('/shorten').set('Content-type', 'application/json').send(reqData).expect(400)
        })

        it('Should return 400 if the url is invalid', async () => {
            const reqData: ShortenURLRequest = {
                url: 'abcdsdfjsdfjdlf',
            }
            await request.post('/shorten').set('Content-type', 'application/json').send(reqData).expect(400)
        })

        it('Should return 500 if db returns an error', async () => {
            jest.spyOn(store, 'saveKeyAndValue').mockImplementation(() => {
                return Promise.reject('nope')
            })
            const reqData: ShortenURLRequest = {
                url: 'http://www.google.com',
            }

            const res = await request.post('/shorten').set('Content-type', 'application/json').send(reqData)

            const { status } = res
            assert.deepStrictEqual(status, 500)
        })
    })

    describe('GET /{id}', () => {
        it('Should return 302 and redirect to the input page if the given key exists', async () => {
            const key = 'a4a6e725'
            const website = 'http://www.reddit.com'

            redis.set(key, website)

            const res = await request.get(`/${key}`)
            const { status, text } = res

            assert.deepStrictEqual(status, 302)
            assert(text.includes(`Redirecting to ${website}`))
        })

        it('Should return 404 if the id does not exist in the database', async () => {
            const key = 'LetsUseThisKey'
            const res = await request.get(`/${key}`)

            const { status, text } = res

            assert.deepStrictEqual(status, 404)
            assert.match(text, /Not Found/)
        })

        it('Should return 500 if db returns an error', async () => {
            jest.spyOn(store, 'getValue').mockImplementation(() => {
                return Promise.reject('nope')
            })
            const res = await request.get(`/something`)

            const { status } = res
            assert.deepStrictEqual(status, 500)
        })
    })

    describe('GET /{id}/stats', () => {
        it('Should return 200 for a newly created id with no stats', async () => {
            // create a new shortenedURL
            const reqData: ShortenURLRequest = {
                url: 'http://www.google.com',
            }

            const res1 = await request.post('/shorten').set('Content-type', 'application/json').send(reqData)

            const resp = res1.body as ShortenURLResponse

            // shortenedURL
            const url = resp.shortenedURL
            const createdHash = url.split('/').pop()

            const res = await request.get(`/${createdHash}/stats`)
            const { body, status } = res
            const stats = body as URLStatsResponse

            assert.deepStrictEqual(status, 200)
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

            const res1 = await request.post('/shorten').set('Content-type', 'application/json').send(reqData)

            const resp = res1.body as ShortenURLResponse

            // shortenedURL
            const url = resp.shortenedURL
            const createdHash = url.split('/').pop()

            const noOfRequests = 50
            // call GET /id 50 times
            const promises = []
            for (let i = 0; i < noOfRequests; i++) {
                promises.push(request.get(`/${createdHash}`))
            }
            await Promise.all(promises)

            const res = await request.get(`/${createdHash}/stats`)
            const { body, status } = res
            const stats = body as URLStatsResponse

            assert.deepStrictEqual(status, 200)
            assert.deepStrictEqual(stats, {
                url: reqData.url,
                hits: noOfRequests,
            })
        })

        it('Should return 404 if the id does not exist in the database', async () => {
            const key = 'DoesNotExists'
            const res = await request.get(`/${key}/stats`)

            const { status, text } = res

            assert.deepStrictEqual(status, 404)
            assert.match(text, /Not Found/)
        })

        it('Should return 500 if db returns an error', async () => {
            jest.spyOn(store, 'getValue').mockImplementation(() => {
                return Promise.reject('nope')
            })
            const res = await request.get(`/something/stats`)

            const { status } = res
            assert.deepStrictEqual(status, 500)
        })
    })
})
