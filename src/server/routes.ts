/**
 * Routes just pass on the requests to the appropriate handlers
 */

import express from 'express'
import { checkHealth, shortenUrl, getOriginalUrl, getURLStats } from './handlers'


const router = express.Router()

router.get("/internal/health", checkHealth)

router.post("/shorten", shortenUrl)
router.get("/:id", getOriginalUrl)
router.get("/:id/stats", getURLStats)

export { router }
