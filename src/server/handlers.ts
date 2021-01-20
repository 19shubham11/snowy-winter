/**
 * Handlers are responsible for inp/out validation, there is no "business logic" here
 */

import { Request, Response } from 'express'
import { ShortenURLRequest, Hash} from '../models'
import { shortenUrlController, getOriginalUrlController } from './controllers'
import { isValidURL } from '../utils'

function checkHealth(_: Request, res: Response) {
    res.send("OK")
}

async function shortenUrl(req: Request, res: Response) {
    const inp = req.body as ShortenURLRequest
    if (!inp.url) {
        return res.status(400).send("Missing required field 'url' ")
    }
    if (!isValidURL(inp.url)) {
        return res.status(400).send('Invalid URL')
    }
    try {
        const appPort = req.app.get('PORT') as number
        const shortenedUrlResp = await shortenUrlController(inp.url, appPort)
        return res.json(shortenedUrlResp)
    } catch (err) {
        console.log('Error', err)
        return res.status(500).send('Internal Server Error')
    }
}

async function getOriginalUrl(req: Request, res: Response) {
    const hash = req.params.id as Hash

    try {
        const redirectUrl = await getOriginalUrlController(hash)
        if (redirectUrl === null) {
            return res.status(404).send('Not Found')
        }
        res.redirect(redirectUrl)
    } catch(err) {
        console.log('Error', err)
        return res.status(500).send('Internal Server Error')
    }
}

export { checkHealth, shortenUrl, getOriginalUrl }