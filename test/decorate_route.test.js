/* global describe it expect */

'use strict'

const wrapper = require('../index')

describe('Hapi route handler wrapper', function () {
  it('returns a route with a wrapped handler', function () {
    const handler = function (req) {}

    const route = {
      path: '/test',
      method: 'get',
      config: {
        handler: handler
      }
    }

    const newRoute = wrapper.wrapRouteHandler(route)

    expect(newRoute.config.handler).not.to.equal(handler)
    expect(newRoute.path).to.equal('/test')
    expect(newRoute.method).to.equal('get')
  })
})
