import { config } from '../config'
import { setupRedisInstance, getRedisInstance } from '../store/setup'

// redis setup
setupRedisInstance(config.redis)
const redisClient = getRedisInstance()

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

// server setup
import fastify from 'fastify'
import { router } from './routes'

const server = fastify({
    logger: {
        level: 'error',
    },
})

server.register(router)

server.listen(config.PORT, () => {
    console.info(`Server started on port ${config.PORT}`)
})
