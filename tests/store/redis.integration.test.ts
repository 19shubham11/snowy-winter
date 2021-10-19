import assert from 'assert'

import { redisInstance } from '../redis.setup'
import * as redis from '../../src/store/redis'

afterAll((done) => {
    redisInstance.flushdb()
    redisInstance.quit()
    done()
})

describe('Redis Integration tests', () => {
    const db = redis.initAPI(redisInstance)

    describe('SET', () => {
        it('Should return "OK" when setting a key', async () => {
            const val = await db.set('key1', 'http://www.google.com')
            assert.strictEqual(val, 'OK')
        })
    })

    describe('GET', () => {
        it('Should return the expected value when getting the value for a key', async () => {
            const key = 'a51ac3ef'
            const value = 'http://www.google.com'

            await db.set(key, value)
            const res = await db.get(key)

            assert.strictEqual(res, value)
        })

        it('Should return null when getting a value for a key that does not exist', async () => {
            const res = await db.get('DoesNotExists')
            assert.strictEqual(res, null)
        })
    })

    describe('INCR', () => {
        it('Should return the incremented value of a given key', async () => {
            const key = 'key1'
            const value = '2'

            await db.set(key, value)
            const res = await db.incr(key)

            assert.strictEqual(res, 3)
        })

        it('Should reject if trying to increment the value of a key that cannot be cast as int', async () => {
            const key = 'key1'
            const value = 'Hello'

            await db.set(key, value)
            await assert.rejects(db.incr(key), (err: Error) => {
                assert.match(err.message, /not an integer/)
                return true
            })
        })
    })

    describe('MSET', () => {
        it('Should set multiple keys', async () => {
            const set = [
                { key: 'k1', value: 'v1' },
                { key: 'k2', value: 'v2' },
                { key: 'k3', value: 'v3' },
                { key: 'k4', value: 'v4' },
            ]

            const res = await db.mset(set)
            assert.strictEqual(res, 'OK')
        })
    })

    describe('MGET', () => {
        it('Should get multiple keys', async () => {
            const set = [
                { key: 'k1', value: 'v1' },
                { key: 'k2', value: 'v2' },
                { key: 'k3', value: 'v3' },
                { key: 'k4', value: 'v4' },
            ]
            await db.mset(set)

            const keys = set.map((p) => p.key)
            const values = set.map((p) => p.value)

            const res = await db.mget(keys)

            assert.deepStrictEqual(res, values)
        })
    })
})
