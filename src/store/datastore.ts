/**
 * Wrapper on the redis operation, this acts as the API for any db operation in the app,
 * will remain the same even if db implementation changes
 */
import * as db from './redis'

export function saveKeyAndValue(key: string, value: string): Promise<'OK'> {
    return db.set(key, value)
}

export function getValue(key: string): Promise<string | null> {
    return db.get(key)
}

export function incrementValue(key: string): Promise<number> {
    return db.incr(key)
}
