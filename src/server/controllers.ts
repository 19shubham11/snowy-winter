import { Redis } from '../store/redis'
import * as hash from '../helpers/hash'
import { ShortenURLResponse, Hash, URLStatsResponse } from '../models'

const STAT_PREFIX = 'STATS'
const INIT_STATS = 0

export interface Controller {
    shortenURLController(inputURL: string): Promise<ShortenURLResponse>
    getOriginalURLController(inpHash: Hash): Promise<string | null>
    getStatsController(inpHash: Hash): Promise<URLStatsResponse | null>
}

export function initController(redis: Redis, redirectURL: string): Controller {
    async function shortenURLController(inputURL: string): Promise<ShortenURLResponse> {
        // set hash and statsKey
        const urlHash = hash.createUniqueHash()
        const statKey = getStatKey(urlHash)

        const redisSet = [
            { key: urlHash, value: inputURL },
            { key: statKey, value: `${INIT_STATS}` },
        ]

        await redis.mset(redisSet)

        const shortenedURL = `${redirectURL}/${urlHash}`
        const shortenURLResponse: ShortenURLResponse = {
            shortenedURL,
        }

        return shortenURLResponse
    }

    async function getOriginalURLController(inpHash: Hash): Promise<string | null> {
        const url = await redis.get(inpHash)
        if (url !== null) {
            // increment stats
            const statKey = getStatKey(inpHash)
            await redis.incr(statKey)
        }

        return url
    }

    async function getStatsController(inpHash: Hash): Promise<URLStatsResponse | null> {
        const statKey = getStatKey(inpHash)
        const [url, hits] = await redis.mget([inpHash, statKey])

        if (!url || !hits) {
            return null
        }

        const hitsParsed = parseInt(hits, 10)
        const stats: URLStatsResponse = { url, hits: hitsParsed }

        return stats
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
