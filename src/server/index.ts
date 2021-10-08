import fastify from 'fastify'

import { config } from '../config'
import { setupRedisInstance } from '../store/setup'
import { getRoutes } from './routes'
import * as redis from '../store/redis'

// redis setup
const redisClient = setupRedisInstance(config)

redisClient.on('error', (err) => {
    console.error('Redis Error!', err)
})
redisClient.on('end', () => {
    console.error('Redis connection died!')
    process.exit(1)
})
redisClient.on('connect', () => {
    console.info('Connected to Redis!')
})

const appURL = `${config.HOST}:${config.PORT}`

const redisAPI = redis.api(redisClient)
const router = getRoutes(redisAPI, appURL)

const server = fastify({
    logger: {
        level: 'error',
    },
})

server.register(router)

server.listen(config.PORT, () => {
    console.info(`Server started on port ${config.PORT}`)
})
