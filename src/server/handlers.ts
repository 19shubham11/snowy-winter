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
        res.status(400)
        res.send("Missing required field 'url' ")
        return
    }
    if (!isValidURL(inp.url)) {
        res.status(400)
        res.send("Invalid URL")
        return
    }
    try {
        const appPort = req.app.get('PORT') as number
        const shortenedUrlResp = await shortenUrlController(inp.url, appPort)
        return res.json(shortenedUrlResp)
    } catch (err) {
        console.error('Error!')
        res.status(500)
    }
}

async function getOriginalUrl(req: Request, res: Response) {
    const hash = req.params.id as Hash

    try {
        const redirectUrl = await getOriginalUrlController(hash)
        return res.redirect(redirectUrl)
    } catch(err) {
        console.error('Error!')
        res.status(500)
    }
}

export { checkHealth, shortenUrl, getOriginalUrl }
