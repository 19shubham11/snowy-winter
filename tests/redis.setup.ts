import { Config } from '../src/config'
import { setupRedisInstance } from '../src/store/setup'

const redisConf = {
    user: 'default',
    port: 6379,
    host: 'localhost',
    password: process.env.REDIS_PASS || '',
    db: 2,
}

const config: Config = {
    PORT: 9090,
    HOST: 'localhost',
    redis: redisConf,
}

export const redisInstance = setupRedisInstance(config)
