interface RedisConfig {
    user: string
    port: number
    host: string
    password: string
    db: number
}

export interface Config {
    PORT: number
    HOST: string
    redis: RedisConfig
}

const redisConf: RedisConfig = {
    port: parseInt(readEnv('REDIS_PORT', '6379'), 10),
    host: readEnv('REDIS_HOST', '127.0.0.1'),
    user: readEnv('REDIS_USER', 'default'),
    password: readEnv('REDIS_PASS', ''),
    db: 0,
}

export const config: Config = {
    PORT: 2001,
    HOST: '127.0.0.1',
    redis: redisConf,
}

function readEnv(key: string, fallback?: string): string | never {
    const env = process.env[key]
    if (!env) {
        if (!fallback) {
            throw new Error(`env ${key} not found, and no default set`)
        }

        return fallback
    }

    return env
}
