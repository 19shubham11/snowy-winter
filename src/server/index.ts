import express from 'express'
import bodyParser from 'body-parser'
import { router }  from './routes'
import { config } from '../config'

import { setupRedisInstance, getRedisInstance } from '../store/setup'

const app = express()
app.use(bodyParser.json())

app.use('/', router)
const PORT = config.PORT
app.set('PORT', PORT)

app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`)
})


setupRedisInstance(config.redis)
const redisClient = getRedisInstance()

redisClient.on('error', (err) => {
    console.error('Redis Error!', err)
})
