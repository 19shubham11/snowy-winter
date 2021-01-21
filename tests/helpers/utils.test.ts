import * as utils from '../../src/helpers/utils'
import assert from 'assert'

describe('isValidURL', () => {
    it('Should return true for a valid url', () => {
        const inp = 'http://www.example.com/sub/1'
        const isValid = utils.isValidURL(inp)

        assert.strictEqual(isValid, true)
    })

    it('Should return false for an invalid url', () => {
        const inp = 'http//thisIsNotaURL.com'
        const isValid = utils.isValidURL(inp)

        assert.strictEqual(isValid, false)
    })
})
