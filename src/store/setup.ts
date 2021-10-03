import * as redis from 'redis'

import { RedisConfig } from '../config'

let _redis: redis.RedisClient

export function setupRedisInstance(redisConf: RedisConfig) {
    const redisUrl = `redis://${redisConf.user}:${redisConf.password}@${redisConf.host}/${redisConf.db}`

    const client = redis.createClient({ url: redisUrl })
    _redis = client
}

export function getRedisInstance(): redis.RedisClient {
    if (!_redis) {
        console.error('Redis not initialised! Please call getRedisInstance() first')
        process.exit(1)
    }
    return _redis
}
