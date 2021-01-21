/**
 * Controllers contain the main logic for the application
 */

import * as hash from '../helpers/hash'
import { ShortenURLResponse, Hash, URLStatsResponse} from '../models'
import * as store from '../store/datastore'

const STAT_PREFIX = 'STATS'
const INIT_STATS = "0"

async function shortenUrlController(inputURL: string, appUrl: string): Promise<ShortenURLResponse> {
   try {
    // set hash
    const urlHash = hash.createUniqueHash()
    await store.saveKeyAndValue(urlHash, inputURL)

    // set initial stats
    const statKey = getStatKey(urlHash)
    await store.saveKeyAndValue(statKey, INIT_STATS)

    const shortenedUrl =  `${appUrl}/${urlHash}`
    const shortenURLResponse : ShortenURLResponse = {
        shortenedUrl
    }
    return shortenURLResponse
   } catch (err) {
       throw new Error(err)
   }
}

async function getOriginalUrlController(inpHash: Hash): Promise <string | null> {
    try {
        // increment stats
        const statKey = getStatKey(inpHash)
        await store.incrementKey(statKey)

        const url = await store.getValueFromKey(inpHash)
        return url
    } catch (err) {
        return err
    }
}

async function getStatsController(inpHash: Hash): Promise<URLStatsResponse | null> {
    try {
        const statKey = getStatKey(inpHash)
        const url = await store.getValueFromKey(inpHash)
        const hits = await store.getValueFromKey(statKey)

        if (url === null || hits === null) {
            return null
        }

        const stats: URLStatsResponse = { url, hits }
        return stats
    } catch (err) {
        return err
    }
}

function getStatKey(urlHash: Hash): string {
    return `${STAT_PREFIX}_${urlHash}`
}

export { shortenUrlController, getOriginalUrlController, getStatsController }
