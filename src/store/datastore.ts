/**
 * Wrapper on the redis operation, this acts as the API for any db operation in the app,
 * will remain the same even if db implementation changes
 */
 import * as db from "./redis"

function saveKeyAndValue(key: string, value: string): Promise <"OK"> {
    return db.set(key, value)
}

function getValue(key: string): Promise<string | null> {
    return db.get(key)
}

function incrementValue(key: string): Promise<number> {
    return db.incr(key)
}

export { saveKeyAndValue, getValue, incrementValue }
