import express from 'express'
import {checkHealth} from './handlers'

const router = express.Router()

router.get("/health", checkHealth)

export { router }
