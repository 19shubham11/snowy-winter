/**
 * Controllers contain the main logic for the application
 */

import { Redis } from '../store/redis'
import * as hash from '../helpers/hash'
import { ShortenURLResponse, Hash, URLStatsResponse } from '../models'
import * as ds from '../store/datastore'

const STAT_PREFIX = 'STATS'
const INIT_STATS = 0

export interface Controller {
    shortenURLController(inputURL: string, appUrl: string): Promise<ShortenURLResponse>
    getOriginalURLController(inpHash: Hash): Promise<string | null>
    getStatsController(inpHash: Hash): Promise<URLStatsResponse | null>
}

export function controller(redis: Redis): Controller {
    const store = ds.store(redis)

    async function shortenURLController(inputURL: string, appUrl: string): Promise<ShortenURLResponse> {
        try {
            // set hash
            const urlHash = hash.createUniqueHash()
            await store.saveKeyAndValue(urlHash, inputURL)

            // set initial stats
            const statKey = getStatKey(urlHash)
            await store.saveKeyAndValue(statKey, `${INIT_STATS}`)

            const shortenedURL = `${appUrl}/${urlHash}`
            const shortenURLResponse: ShortenURLResponse = {
                shortenedURL,
            }

            return shortenURLResponse
        } catch (err) {
            throw err
        }
    }

    async function getOriginalURLController(inpHash: Hash): Promise<string | null> {
        try {
            const url = await store.getValue(inpHash)
            if (url !== null) {
                // increment stats
                const statKey = getStatKey(inpHash)
                await store.incrementValue(statKey)
            }

            return url
        } catch (err) {
            throw err
        }
    }

    async function getStatsController(inpHash: Hash): Promise<URLStatsResponse | null> {
        try {
            const statKey = getStatKey(inpHash)
            const url = await store.getValue(inpHash)
            const hits = await store.getValue(statKey)

            if (url === null || hits === null) {
                return null
            }

            const hitsParsed = parseInt(hits, 10)
            const stats: URLStatsResponse = { url, hits: hitsParsed }

            return stats
        } catch (err) {
            throw err
        }
    }

    return {
        shortenURLController,
        getOriginalURLController,
        getStatsController,
    }
}

function getStatKey(urlHash: Hash): string {
    return `${STAT_PREFIX}_${urlHash}`
}
