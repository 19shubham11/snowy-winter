import { FastifyInstance } from 'fastify'

import { checkHealth, shortenURL, getOriginalURL, getURLStats } from './handlers'

/**
 * Routes just pass on the requests to the appropriate handlers
 */
export async function router(app: FastifyInstance, _: object) {
    app.get('/internal/health', checkHealth)
    app.post('/shorten', shortenURL)
    app.get('/:id', getOriginalURL)
    app.get('/:id/stats', getURLStats)
}
