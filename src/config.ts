export interface RedisConfig {
    user: string
    port: number
    host: string
    password: string
    db: number
}

interface AppConfig {
    PORT: number
    HOST: string
    redis: RedisConfig
}

const redisConf: RedisConfig = {
    port: parseInt(process.env.REDIS_PORT || '', 10) || 6379,
    host: process.env.REDIS_HOST || '127.0.0.1',
    user: process.env.REDS_USER || 'default',
    password: process.env.REDIS_PASS || '',
    db: 0,
}

export const config: AppConfig = {
    PORT: 2001,
    HOST: '127.0.0.1',
    redis: redisConf,
}
