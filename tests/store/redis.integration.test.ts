import { config, RedisConfig } from '../../src/config'
import {getRedisInstance, setupRedisInstance} from '../../src/store/setup'
import assert from 'assert'

const conf: RedisConfig = {
    user: 'default',
    port:  6379,
    host: '127.0.0.1',
    password: process.env.REDIS_PASS || '',
    db: 2
}

setupRedisInstance(conf)
const redis = getRedisInstance()

afterAll(async (done) => {
    redis.flushdb()
    redis.quit()
    done()
})

import {get, set} from '../../src/store/redis'

describe('Redis Integration tests', () => {
    it('Should return OK when setting a key', async () => {
        const val = await set('key1', 'http://www.google.com')
        assert.strictEqual(val, 'OK')
    })

    it('Should return the expected value when getting the value for a key', async () => {
        const key = 'a51ac3ef'
        const value = 'http://www.google.com'

        await set(key, value)
        const res = await get(key)

        assert.strictEqual(res, value)
    })

    it('Should return null when getting a value that does not exist', async () => {
        const res = await get('DoesNotExists')
        assert.strictEqual(res, null)
    })
})
