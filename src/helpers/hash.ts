import crypto from 'crypto'

export type Hash = string

/**
 * createUniqueHash returns a unique string of length 8
 */
export function createUniqueHash(): Hash {
    return crypto.randomBytes(4).toString('hex')
}
