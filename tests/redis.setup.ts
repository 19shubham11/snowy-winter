import { RedisConfig } from '../src/config'
import { setupRedisInstance } from '../src/store/setup'

const conf: RedisConfig = {
    user: 'default',
    port: 6379,
    host: 'localhost',
    password: process.env.REDIS_PASS || '',
    db: 2,
}

export const redisInstance = setupRedisInstance(conf)
