import { FastifyRequest, FastifyReply } from 'fastify'
import { ShortenURLRequest } from './models'
import { Controller } from './controllers'
import { Hash } from '../helpers/hash'
import { isValidURL } from '../helpers/utils'
import * as httpHelpers from '../helpers/http'

type GetURLRequest = FastifyRequest<{ Params: { id: string } }>

export interface Handler {
    checkHealth(_: FastifyRequest, res: FastifyReply): void
    shortenURL(req: FastifyRequest, res: FastifyReply): Promise<void>
    getOriginalURL(req: GetURLRequest, res: FastifyReply): Promise<void>
    getURLStats(req: GetURLRequest, res: FastifyReply): Promise<void>
}

export function initHandler(ctrl: Controller): Handler {
    function checkHealth(_: FastifyRequest, res: FastifyReply) {
        res.send('OK')
    }

    async function shortenURL(req: FastifyRequest, res: FastifyReply) {
        const inp = req.body as ShortenURLRequest
        if (!inp.url) {
            return httpHelpers.httpErrorBadRequest(res, 'Missing required field "url"')
        }

        if (!isValidURL(inp.url)) {
            return httpHelpers.httpErrorBadRequest(res, 'Invalid URL')
        }

        try {
            const shortenedURLResp = await ctrl.shortenURL(inp.url)
            return res.send(shortenedURLResp)
        } catch (err) {
            console.error(err)
            return httpHelpers.httpInternalServerError(res)
        }
    }

    async function getOriginalURL(req: GetURLRequest, res: FastifyReply) {
        const hash = req?.params?.id as Hash

        try {
            const redirectUrl = await ctrl.getOriginalURL(hash)
            if (redirectUrl === null) {
                return httpHelpers.httpErrorNotFound(res)
            }

            res.redirect(redirectUrl)
        } catch (err) {
            console.error(err)
            return httpHelpers.httpInternalServerError(res)
        }
    }

    async function getURLStats(req: GetURLRequest, res: FastifyReply) {
        const hash = req?.params?.id as Hash

        try {
            const stats = await ctrl.getStats(hash)
            if (stats === null) {
                return httpHelpers.httpErrorNotFound(res)
            }

            return res.send(stats)
        } catch (err) {
            console.error(err)
            return httpHelpers.httpInternalServerError(res)
        }
    }

    return {
        checkHealth,
        shortenURL,
        getOriginalURL,
        getURLStats,
    }
}
