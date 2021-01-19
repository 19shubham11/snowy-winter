import express from 'express'
import bodyParser from 'body-parser'
import { router }  from './routes'
import config from '../config.json'

const app = express()
app.use(bodyParser.json())

app.use('/', router)
const PORT = config.PORT


app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`)
})
