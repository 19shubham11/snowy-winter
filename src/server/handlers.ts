/**
 * Handlers are responsible for inp/out validation, there is no "business logic" here
 */

import { Request, Response } from 'express'
import { ShortenURLRequest, Hash} from '../models'
import { shortenURLController, getOriginalURLController, getStatsController } from './controllers'
import { isValidURL } from '../helpers/utils'

function checkHealth(_: Request, res: Response) {
    res.send("OK")
}

async function shortenURL(req: Request, res: Response) {
    const inp = req.body as ShortenURLRequest
    if (!inp.url) {
        return res.status(400).send("Missing required field 'url'")
    }
    if (!isValidURL(inp.url)) {
        return res.status(400).send('Invalid URL')
    }
    try {
        const appURL = req.app.get('APP_URL') as string
        const shortenedUrlResp = await shortenURLController(inp.url, appURL)
        return res.json(shortenedUrlResp)
    } catch (err) {
        console.log('Error', err)
        return res.status(500).send('Internal Server Error')
    }
}

async function getOriginalURL(req: Request, res: Response) {
    const hash = req.params.id as Hash

    try {
        const redirectUrl = await getOriginalURLController(hash)
        if (redirectUrl === null) {
            return res.status(404).send('Not Found')
        }
        res.redirect(redirectUrl)
    } catch(err) {
        console.log('Error', err)
        return res.status(500).send('Internal Server Error')
    }
}

async function getURLStats(req: Request, res: Response) {
    const hash = req.params.id as Hash

    try {
        const stats = await getStatsController(hash)
        if (stats === null) {
            return res.status(404).send('Not Found')
        }
        return res.json(stats)
    } catch(err) {
        console.log('Error', err)
        return res.status(500).send('Internal Server Error')
    }
}

export { checkHealth, shortenURL, getOriginalURL, getURLStats }

