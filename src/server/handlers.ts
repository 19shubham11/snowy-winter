/**
 * Handlers are responsible for inp/out validation, there is no "business logic" here
 */

import { Request, Response } from 'express'
import { ShortenURLRequest, Hash} from '../models'
import { shortenURLController, getOriginalURLController, getStatsController } from './controllers'
import { isValidURL } from '../helpers/utils'
import { httpErrorBadRequest, httpErrorNotFound, httpInternalServerError } from '../helpers/expressHelpers'

function checkHealth(_: Request, res: Response) {
    res.send("OK")
}

async function shortenURL(req: Request, res: Response) {
    const inp = req.body as ShortenURLRequest
    if (!inp.url) {
        return httpErrorBadRequest(res, "Missing required field 'url'")
    }
    if (!isValidURL(inp.url)) {
        return httpErrorBadRequest(res, 'Invalid URL')
    }
    try {
        const appURL = req.app.get('APP_URL') as string
        const shortenedURLResp = await shortenURLController(inp.url, appURL)
        return res.json(shortenedURLResp)
    } catch (err) {
        console.error('Error', err)
        return httpInternalServerError(res)
    }
}

async function getOriginalURL(req: Request, res: Response) {
    const hash = req.params.id as Hash

    try {
        const redirectUrl = await getOriginalURLController(hash)
        if (redirectUrl === null) {
            return httpErrorNotFound(res)
        }
        res.redirect(redirectUrl)
    } catch(err) {
        console.error('Error', err)
        return httpInternalServerError(res)
    }
}

async function getURLStats(req: Request, res: Response) {
    const hash = req.params.id as Hash

    try {
        const stats = await getStatsController(hash)
        if (stats === null) {
            return httpErrorNotFound(res)
        }
        return res.json(stats)
    } catch(err) {
        console.error('Error', err)
        return httpInternalServerError(res)
    }
}

export { checkHealth, shortenURL, getOriginalURL, getURLStats }
