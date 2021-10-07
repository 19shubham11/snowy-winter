import { FastifyInstance } from 'fastify'

import * as handlers from './handlers'
import * as controller from './controllers'
import { Redis } from '../store/redis'

/**
 * Routes just pass on the requests to the appropriate handlers
 */

export function getRoutes(redis: Redis) {
    const ctrl = controller.controller(redis)
    const handler = handlers.handler(ctrl)

    return async function router(app: FastifyInstance, _: object) {
        app.get('/internal/health', handler.checkHealth)
        app.post('/shorten', handler.shortenURL)
        app.get('/:id', handler.getOriginalURL)
        app.get('/:id/stats', handler.getURLStats)
    }
}
