import { FastifyRequest, FastifyReply } from 'fastify'
import { ShortenURLRequest, Hash } from '../models'
import { Controller } from './controllers'
import { isValidURL } from '../helpers/utils'
import { httpErrorBadRequest, httpErrorNotFound, httpInternalServerError } from '../helpers/expressHelpers'

type GetURLRequest = FastifyRequest<{ Params: { id: string } }>

export interface Handler {
    checkHealth(_: FastifyRequest, res: FastifyReply): void
    shortenURL(req: FastifyRequest, res: FastifyReply): Promise<void>
    getOriginalURL(req: GetURLRequest, res: FastifyReply): Promise<void>
    getURLStats(req: GetURLRequest, res: FastifyReply): Promise<void>
}

export function handler(ctrl: Controller): Handler {
    function checkHealth(_: FastifyRequest, res: FastifyReply) {
        res.send('OK')
    }

    async function shortenURL(req: FastifyRequest, res: FastifyReply) {
        const inp = req.body as ShortenURLRequest
        if (!inp.url) {
            return httpErrorBadRequest(res, "Missing required field 'url'")
        }

        if (!isValidURL(inp.url)) {
            return httpErrorBadRequest(res, 'Invalid URL')
        }

        try {
            const shortenedURLResp = await ctrl.shortenURLController(inp.url)
            return res.send(shortenedURLResp)
        } catch (err) {
            console.error(err)
            return httpInternalServerError(res)
        }
    }

    async function getOriginalURL(req: GetURLRequest, res: FastifyReply) {
        const hash = req?.params?.id as Hash

        try {
            const redirectUrl = await ctrl.getOriginalURLController(hash)
            if (redirectUrl === null) {
                return httpErrorNotFound(res)
            }

            res.redirect(redirectUrl)
        } catch (err) {
            console.error(err)
            return httpInternalServerError(res)
        }
    }

    async function getURLStats(req: GetURLRequest, res: FastifyReply) {
        const hash = req?.params?.id as Hash

        try {
            const stats = await ctrl.getStatsController(hash)
            if (stats === null) {
                return httpErrorNotFound(res)
            }

            return res.send(stats)
        } catch (err) {
            console.error(err)
            return httpInternalServerError(res)
        }
    }

    return {
        checkHealth,
        shortenURL,
        getOriginalURL,
        getURLStats,
    }
}
