/**
 * Controllers contain the main logic for the application
 */

import * as hash from '../helpers/hash'
import { ShortenURLResponse, Hash } from '../models'
import * as store from '../store/datastore'

async function shortenUrlController(inputURL: string, appUrl: string): Promise<ShortenURLResponse> {
   try {
    const urlHash = hash.createUniqueHash()
    await store.saveURLAndKey(urlHash, inputURL)

    const shortenedUrl =  `${appUrl}/${urlHash}`
    const shortenURLResponse : ShortenURLResponse = {
        shortenedUrl
    }
    return shortenURLResponse
   } catch (err) {
       throw new Error(err)
   }
}

async function getOriginalUrlController(inpHash: Hash): Promise < string | null > {
    try {
        const url = await store.getURLFromKey(inpHash)
        return url
    } catch (err) {
        return err
    }
}

export { shortenUrlController, getOriginalUrlController }
