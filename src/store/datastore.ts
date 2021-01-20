/**
 * Wrapper on the redis operation, this acts as the API for any db operation in the app,
 * will remain the same even if db implementation changes
 */

import { Hash } from "../models";
import * as db from "./redis"

async function saveURLAndKey(urlHash: Hash, url: string): Promise <"OK" > {
    try {
        return await db.set(urlHash, url)
    } catch(err) {
        throw new Error(err)
    }
}

async function getURLFromKey(urlHash: Hash) {
    try {
        return await db.get(urlHash)
    } catch(err) {
        throw new Error(err)
    }
}

export { saveURLAndKey, getURLFromKey}
