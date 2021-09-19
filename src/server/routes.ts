/**
 * Routes just pass on the requests to the appropriate handlers
 */

import { checkHealth, shortenURL, getOriginalURL, getURLStats } from './handlers'
import { FastifyInstance } from 'fastify'

export async function router(app: FastifyInstance, _: object) {
    app.get('/internal/health', checkHealth)
    app.post('/shorten', shortenURL)
    app.get('/:id', getOriginalURL)
    app.get('/:id/stats', getURLStats)
}
