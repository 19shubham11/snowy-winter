import express from 'express'
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
import bodyParser from 'body-parser'
import { router }  from './routes'

const app = express()
app.use(bodyParser.json())

app.use('/', router)
const PORT = config.PORT
app.set('PORT', PORT)

app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`)
})
