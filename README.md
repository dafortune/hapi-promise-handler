# Hapi promise wrapper
Wraps Hapi handlers so they are able to handle returned promises

## Installation
```
npm i hapi-promise-wrapper
```

## Usage

### Basic usage
Wrap a single handler for a Hapi server route

```javascript
  const hpw = require('hapi-promise-wrapper')

  server.route({
    path: '/test',
    method: 'POST',
    handler: hpw(function (req) {
      return Promise.resolve({
        object: {
          value: '1234'
        },
        code: 201,
        headers: {
          'x-something': 'headers'
        }
      })
    })
  })
```

### Avoid wrapping
If you have two or more arguments on your handler wrapping will not be applied,
instead you should use reply interface to send the response

```javascript
  const hpw = require('hapi-promise-wrapper')

  server.route({
    path: '/test',
    method: 'POST',
    handler: hpw(function (req, reply) {
      return reply({ value: '1234' }).code(201)
    })
  })
```

Response
```
Payload: { value: '1234' }
Status Code: 201
```

### Handling error
If promise is rejected, error will be sent to reply interface

```javascript
  const hpw = require('hapi-promise-wrapper')

  server.route({
    path: '/test',
    method: 'POST',
    handler: hpw(function (req) {
      return Promise.resolve(new Error('test'))
    })
  })
```
Response
```
Hapi error response
```

### Wrapping a route
As a convenience, you can wrap a route instead of a handler, wrapping a route,
will replace given route handler by the wrapped version of the same handler.

```javascript
  const hpw = require('hapi-promise-wrapper')

  server.route(hpw.wrapRouteHandler({
    path: '/test',
    method: 'POST',
    handler: function (req) {
      return Promise.resolve(new Error('test'))
    }
  })
```

### Valid return values

#### Object descriptor promise
```javascript
  hpw(function (req) {
    return Promise.resolve({
      object: {
        value: '1234'
      },
      code: 201,
      headers: {
        'x-something': 'headers'
      }
    })
  })
```

Response
```
Payload: { value: '1234' }
Status Code: 201
Headers: { 'x-something': 'headers' }
```

#### Object descriptor
```javascript
  hpw(function (req) {
    return {
      object: {
        value: '1234'
      },
      code: 201,
      headers: {
        'x-something': 'headers'
      }
    }
  })
```

Response
```
Payload: { value: '123' }
Status Code: 201
Headers: { 'x-something': 'headers' }
```

#### Object value
```javascript
  hpw(function (req) {
    return {
      test: '123'
    }
  })
```

Response
```
Payload: { test: '123' }
Status Code: 200
```

#### Primitive value
```javascript
  hpw(function (req) {
    return '123'
  })
```

Response
```
Payload: '123'
Status Code: 200
```

## Running tests
```
npm test
```
