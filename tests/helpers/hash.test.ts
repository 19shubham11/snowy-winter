import * as hash from '../../src/helpers/hash'
import assert from 'assert'

describe('createUniqueHash', () => {
    it('Should return string output of length 8', () => {
        const out = hash.createUniqueHash()
        assert.strictEqual(out.length, 8)
    })

    it('Should return 10k unique hashes for 10k inputs', () => {
        const outSet = new Set<string>()
        const tenThousand = 10000
        for (let i = 0; i < tenThousand; i++) {
            outSet.add(hash.createUniqueHash())
        }
        // since a set always contains unique elements, the length should be tenThousand
        assert.strictEqual(outSet.size, tenThousand)
    })
})
