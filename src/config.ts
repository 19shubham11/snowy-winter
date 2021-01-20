interface RedisConfig {
    user: string,
    port: number,
    host: string,
    password: string,
    db: number
}

interface AppConfig {
    PORT: number,
    redis: RedisConfig
}

const redisConf: RedisConfig = {
    port: parseInt(process.env.REDIS_PORT || '', 0) || 6379,
    host: process.env.REDIS_HOST || '127.0.0.1',
    user: process.env.REDS_USED || 'default',
    password: process.env.REDIS_PASS || '',
    db: 0
}

const config: AppConfig = {
    PORT: 2001,
    redis: redisConf
}

export { config, RedisConfig }
