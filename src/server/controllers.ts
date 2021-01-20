import * as hash from '../helpers/hash'
import { ShortenURLResponse, Hash } from '../models'

async function shortenUrlController(inputURL: string, port: number): Promise<ShortenURLResponse> {
    const urlHash = hash.createUniqueHash()
    /// saveKeyValuePairHere, if successful return else throw error

    const shortenedUrl =  `http://localhost:${port}/${urlHash}`
    const shortenURLResponse : ShortenURLResponse = {
        shortenedUrl
    }
    return shortenURLResponse
}

async function getOriginalUrlController(inpHash: Hash): Promise<string> {
    //// get url from hash const url = /
    return "http://www.google.com"
}

export { shortenUrlController, getOriginalUrlController }
