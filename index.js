'use strict'

function isResponseDescriptor (r) {
  return r.object
}

function wrapHandler (handler) {
  if (handler.length === 2) {
    // We assume the response was already sent using the reply interface
    // or that it must not be set yet

    return handler
  }

  return function hhandler (req, reply) {
    let promise

    try {
      const returned = handler(req)
      promise = Promise.resolve(returned)
    } catch (e) {
      promise = Promise.reject(e)
    }

    promise.then(r => {
      if (typeof r !== 'object') {
        return reply(null, r)
      }

      if (isResponseDescriptor(r)) {
        const response = reply(null, r.object).code(r.code || 200)
        response.headers = Object.assign(response.headers, r.headers || {})
        return
      }

      return reply(null, r)
    })
    .then(null, e => reply(e))
  }
}

function wrapRouteHandler (route) {
  if (!route || !route.config || !route.config.handler) {
    return route
  }

  route.config.handler = wrapHandler(route.config.handler)
  return route
}

wrapHandler.wrapRouteHandler = wrapRouteHandler
module.exports = wrapHandler
