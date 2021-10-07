import * as redis from 'redis'

import { RedisConfig } from '../config'

export function setupRedisInstance(redisConf: RedisConfig): redis.RedisClient {
    const redisUrl = `redis://${redisConf.user}:${redisConf.password}@${redisConf.host}/${redisConf.db}`

    return redis.createClient({ url: redisUrl })
}
