/* global describe it expect */

'use strict'

const wrapper = require('../index')

describe('Hapi handler decorator (handler with 2 args)', function () {
  describe('when there are 2 args in the handler', function () {
    it('returns the same handler instead of a wrapped one', function () {
      const fn = function (req, reply) {}

      expect(wrapper(fn)).to.equal(fn)
    })
  })
})
