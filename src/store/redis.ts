import { RedisClient } from 'redis'
import { Hash } from '../models'

interface Redis {
    set(key: Hash, value: string): Promise<'OK'>
    get(key: Hash): Promise<string | null>
    incr(key: string): Promise<number>
}

export function redis(client: RedisClient): Redis {
    function set(key: Hash, value: string): Promise<'OK'> {
        return new Promise((resolve, reject) => {
            client.set(key, value, (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        })
    }

    function get(key: Hash): Promise<string | null> {
        return new Promise((resolve, reject) => {
            client.get(key, (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        })
    }

    function incr(key: string): Promise<number> {
        return new Promise((resolve, reject) => {
            client.incr(key, (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        })
    }

    return { get, set, incr }
}
