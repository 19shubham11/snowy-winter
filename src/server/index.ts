import { config } from '../config'
import { setupRedisInstance } from '../store/setup'

// server setup
import fastify from 'fastify'
import { getRoutes } from './routes'
import { api } from '../store/redis'

// redis setup

const redisClient = setupRedisInstance(config.redis)

redisClient.on('error', (err) => {
    console.error('Redis Error!', err)
})

redisClient.on('end', () => {
    console.error('Redis connection died!')
    process.exit(1)
})

redisClient.on('connect', () => {
    console.error('Connected to Redis!')
})

const redisAPI = api(redisClient)

const server = fastify({
    logger: {
        level: 'error',
    },
})

const router = getRoutes(redisAPI)

server.register(router)

server.listen(config.PORT, () => {
    console.info(`Server started on port ${config.PORT}`)
})
