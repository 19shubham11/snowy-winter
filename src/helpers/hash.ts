import crypto from 'crypto'
import {Hash} from '../models'

/**
 * createUniqueHash returns a unique string of length 8
 */
function createUniqueHash(): Hash {
    return crypto.randomBytes(4).toString('hex')
}

export { createUniqueHash }
