/**
 * Routes just pass on the requests to the appropriate handlers
 */

import express from 'express'
import { checkHealth, shortenURL, getOriginalURL, getURLStats } from './handlers'

const router = express.Router()

router.get('/internal/health', checkHealth)

router.post('/shorten', shortenURL)
router.get('/:id', getOriginalURL)
router.get('/:id/stats', getURLStats)

export { router }
