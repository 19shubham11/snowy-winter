import { redis } from '../redis.setup'
import supertest from 'supertest'
import express from 'express'
import assert from 'assert'
import bodyParser from 'body-parser'
import { router }  from '../../src/server/routes'
import { ShortenURLRequest, ShortenURLResponse } from '../../src/models'

afterAll(async (done) => {
    redis.flushdb()
    redis.quit()
    done()
})

const app = express()
app.use(bodyParser.json())
app.use('/', router)
app.set("PORT", 8080)

const request = supertest(app)


describe('API Integration Tests', () => {
    describe('GET /internal/health', () => {
        it('Should return 200', async () => {
            const res = await request.get('/internal/health')
            const { status, text} = res

            assert.deepStrictEqual(status, 200)
            assert.deepStrictEqual(text, 'OK')
        })
    })

    describe('POST /shorten', () => {
        it('Should return 200 for a valid url', async () => {
            const reqData: ShortenURLRequest = {
                url: "http://www.google.com"
            }

            const res = 
            await request.post('/shorten')
                .set('Content-type', 'application/json')
                .send(reqData)

            const { status, body } = res
            const resp = body as ShortenURLResponse

            assert.deepStrictEqual(status, 200)
            assert(resp.shortenedUrl)
            assert.match(resp.shortenedUrl, /localhost:8080/)
        })

        it('Should return 400 if the request does not contain url key', async () => {
            const reqData = {
                url1: "http://www.google.com"
            }
            await request.post('/shorten')
                .set('Content-type', 'application/json')
                .send(reqData)
                .expect(400)
        })

        it('Should return 400 if the url is invalid', async () => {
            const reqData: ShortenURLRequest = {
                url: "abcdsdfjsdfjdlf"
            }
            await request.post('/shorten')
                .set('Content-type', 'application/json')
                .send(reqData)
                .expect(400)
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

        it('Should return 404 if the input key does not exist in the database', async () => {
            const key = 'LetsUseThisKey'
            const res = await request.get(`/${key}`)

            const { status, text } = res

            assert.deepStrictEqual(status, 404)
            assert.match(text, /Not Found/)
        })
    })
})
