import { RedisConfig } from '../src/config'
import {getRedisInstance, setupRedisInstance} from '../src/store/setup'

const conf: RedisConfig = {
    user: 'default',
    port:  6379,
    host: '127.0.0.1',
    password: process.env.REDIS_PASS || '',
    db: 2
}

setupRedisInstance(conf)
const redis = getRedisInstance()

export { redis } 
