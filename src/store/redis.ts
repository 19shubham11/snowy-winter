import { Hash } from '../models'
import { getRedisInstance } from './setup'

const redis = getRedisInstance()

export function set(key: Hash, value: string): Promise<'OK'> {
    return new Promise((resolve, reject) => {
        redis.set(key, value, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

export function get(key: Hash): Promise<string | null> {
    return new Promise((resolve, reject) => {
        redis.get(key, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

export function incr(key: string): Promise<number> {
    return new Promise((resolve, reject) => {
        redis.incr(key, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}
