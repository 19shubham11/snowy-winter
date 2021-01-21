/**
 * Wrapper on the redis operation, this acts as the API for any db operation in the app,
 * will remain the same even if db implementation changes
 */

import { Hash } from "../models";
import * as db from "./redis"

async function saveKeyAndValue(key: string, value: string): Promise <"OK"> {
    try {
        return await db.set(key, value)
    } catch(err) {
        throw new Error(err)
    }
}

async function getValueFromKey(key: string): Promise<string | null> {
    try {
        return await db.get(key)
    } catch(err) {
        throw new Error(err)
    }
}

async function incrementKey(key: string): Promise<number> {
    try {
        return await db.incr(key)
    } catch(err) {
        throw new Error(err)
    }
}

export { saveKeyAndValue, getValueFromKey, incrementKey }
