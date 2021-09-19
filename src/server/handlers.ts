/**
 * Handlers are responsible for inp/out validation, there is no "business logic" here
 */

import { FastifyRequest, FastifyReply } from 'fastify'
import { ShortenURLRequest, Hash } from '../models'
import { shortenURLController, getOriginalURLController, getStatsController } from './controllers'
import { isValidURL } from '../helpers/utils'
import { httpErrorBadRequest, httpErrorNotFound, httpInternalServerError } from '../helpers/expressHelpers'
import { config } from '../config'

type GetURLRequest = FastifyRequest<{
    Params: { id: string }
}>

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
        const appURL = `${config.HOST}:${config.PORT}`
        const shortenedURLResp = await shortenURLController(inp.url, appURL)
        return res.send(shortenedURLResp)
    } catch (err) {
        console.error(err)
        return httpInternalServerError(res)
    }
}

async function getOriginalURL(req: GetURLRequest, res: FastifyReply) {
    const hash = req.params.id as Hash

    try {
        const redirectUrl = await getOriginalURLController(hash)
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
    const hash = req.params.id as Hash

    try {
        const stats = await getStatsController(hash)
        if (stats === null) {
            return httpErrorNotFound(res)
        }
        return res.send(stats)
    } catch (err) {
        console.error(err)
        return httpInternalServerError(res)
    }
}

export { checkHealth, shortenURL, getOriginalURL, getURLStats }
