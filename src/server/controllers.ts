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

export function controller(redis: Redis, redirectURL: string): Controller {
    async function shortenURLController(inputURL: string): Promise<ShortenURLResponse> {
        try {
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
        } catch (err) {
            throw err
        }
    }

    async function getOriginalURLController(inpHash: Hash): Promise<string | null> {
        try {
            const url = await redis.get(inpHash)
            if (url !== null) {
                // increment stats
                const statKey = getStatKey(inpHash)
                await redis.incr(statKey)
            }

            return url
        } catch (err) {
            throw err
        }
    }

    async function getStatsController(inpHash: Hash): Promise<URLStatsResponse | null> {
        try {
            const statKey = getStatKey(inpHash)
            const [url, hits] = await redis.mget([inpHash, statKey])

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
