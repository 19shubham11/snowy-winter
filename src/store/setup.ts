import * as redis from 'redis'

import { Config } from '../config'

export function setupRedisInstance(conf: Config): redis.RedisClient {
    const { redis: redisConf } = conf
    const redisUrl = `redis://${redisConf.user}:${redisConf.password}@${redisConf.host}/${redisConf.db}`

    return redis.createClient({ url: redisUrl })
}
