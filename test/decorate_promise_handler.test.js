/* global describe it expect beforeEach Promise */

'use strict'

const wrapper = require('../index')

describe('Hapi handler wrapper (handler when 1 arg)', function () {
  describe('when wrapped function returns a primitive value', function () {
    whenWrappedFunctionReturnsAResponseDescriptor({
      value: '123',
      expectedValue: '123'
    })
  })

  describe('when wrapped function returns a promise for a primitive', function () {
    whenWrappedFunctionReturnsAResponseDescriptor({
      value: Promise.resolve('123'),
      expectedValue: '123'
    })
  })

  describe('when wrapped function returns a promise for a value', function () {
    whenWrappedFunctionReturnsAResponseDescriptor({
      value: Promise.resolve({ test: '123' }),
      expectedValue: { test: '123' }
    })
  })

  describe('when wrapped function returns a promise for a response descriptor', function () {
    whenWrappedFunctionReturnsAResponseDescriptor({
      value: Promise.resolve({ object: { test: '123' } }),
      expectedValue: { test: '123' }
    })
  })

  describe('when wrapped function returns a response descriptor', function () {
    whenWrappedFunctionReturnsAResponseDescriptor({
      value: { object: { test: '123' } },
      expectedValue: { test: '123' }
    })
  })

  describe('when promise is rejected', function () {
    let fn
    let wrapped
    let error

    beforeEach(function () {
      error = new Error('error')

      fn = function (req) {
        return Promise.reject(error)
      }

      wrapped = wrapper(fn)
    })

    it('calls reply with error argument', function (done) {
      const req = {}
      const reply = function (err, value) {
        expect(err).to.be.an.instanceOf(Error)
        done()
      }

      wrapped(req, reply)
    })
  })
})

function whenWrappedFunctionReturnsAResponseDescriptor (options) {
  let fn
  let wrapped
  let value

  beforeEach(function () {
    value = options.value

    fn = function (req) {
      return value
    }

    wrapped = wrapper(fn)
  })

  it('returns a wrapped function that calls reply with the value', function (done) {
    const req = {}
    const reply = function (err, value) {
      if (err) done(err)

      expect(value).to.eql(options.expectedValue)
      done()
      return {
        code: function () { return this },
        headers: {}
      }
    }

    expect(wrapped).not.to.equal(fn)
    wrapped(req, reply)
  })
}
