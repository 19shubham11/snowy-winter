import { FastifyInstance } from 'fastify'

import * as handlers from './handlers'
import * as controllers from './controllers'
import { Redis } from '../store/redis'

export function initRoutes(redis: Redis, redirectURL: string) {
    const ctrl = controllers.initController(redis, redirectURL)
    const handler = handlers.initHandler(ctrl)

    return async function router(app: FastifyInstance, _: object) {
        app.get('/internal/health', handler.checkHealth)
        app.post('/shorten', handler.shortenURL)
        app.get('/:id', handler.getOriginalURL)
        app.get('/:id/stats', handler.getURLStats)
    }
}
