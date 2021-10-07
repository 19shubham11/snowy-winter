/**
 * Wrapper on the redis operation, this acts as the API for any db operation in the app,
 * will remain the same even if db implementation changes
 */

import { Redis } from './redis'

export interface Store {
    saveKeyAndValue(key: string, value: string): Promise<string>
    getValue(key: string): Promise<string | null>
    incrementValue(key: string): Promise<number>
}

export function store(db: Redis): Store {
    function saveKeyAndValue(key: string, value: string): Promise<string> {
        return db.set(key, value)
    }

    function getValue(key: string): Promise<string | null> {
        return db.get(key)
    }

    function incrementValue(key: string): Promise<number> {
        return db.incr(key)
    }

    return { saveKeyAndValue, getValue, incrementValue }
}
