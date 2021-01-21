import { redis } from '../redis.setup'
import assert from 'assert'

afterAll(async (done) => {
    redis.flushdb()
    redis.quit()
    done()
})

import * as db from '../../src/store/redis'

describe('Redis Integration tests', () => {
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
    
        it('Should return null when getting a value that does not exist', async () => {
            const res = await db.get('DoesNotExists')
            assert.strictEqual(res, null)
        })
    })

    describe('INCR', () => {
        it('Should return the incremented value of a given key', async() => {
            const key = 'key1'
            const value = "2"

            await db.set(key, value)
            const res = await db.incr(key)

            assert.strictEqual(res, 3)
        })

        it('Should reject if trying to increment the value of a key that cannot be cast as int', async () =>{
            const key = 'key1'
            const value = "Hello"

            await db.set(key, value)
            await assert.rejects(db.incr(key))
        })
    })
})
