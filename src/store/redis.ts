import { RedisClient } from 'redis'
import { Hash } from '../models'

type RedisKeyValPair = {
    key: string
    value: string
}

export interface Redis {
    set(key: Hash, value: string): Promise<string>
    get(key: Hash): Promise<string | null>
    incr(key: string): Promise<number>
    mset(keys: RedisKeyValPair[]): Promise<boolean>
    mget(keys: string[]): Promise<string[]>
}

export function initAPI(client: RedisClient): Redis {
    function set(key: Hash, value: string): Promise<string> {
        return new Promise((resolve, reject) => {
            client.set(key, value, (err, res) => {
                if (err) {
                    reject(err)
                }

                resolve(res)
            })
        })
    }

    function get(key: Hash): Promise<string | null> {
        return new Promise((resolve, reject) => {
            client.get(key, (err, res) => {
                if (err) {
                    reject(err)
                }

                resolve(res)
            })
        })
    }

    function incr(key: string): Promise<number> {
        return new Promise((resolve, reject) => {
            client.incr(key, (err, res) => {
                if (err) {
                    reject(err)
                }

                resolve(res)
            })
        })
    }

    function mset(keys: RedisKeyValPair[]): Promise<boolean> {
        const set = keys.flatMap((p) => [p.key, p.value])

        return new Promise((resolve, reject) => {
            client.mset(set, (err, res) => {
                if (err) {
                    reject(err)
                }

                resolve(res)
            })
        })
    }

    function mget(keys: string[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            client.mget(keys, (err, res) => {
                if (err) {
                    reject(err)
                }

                resolve(res)
            })
        })
    }

    return { get, set, incr, mset, mget }
}
