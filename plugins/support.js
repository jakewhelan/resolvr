const fp = require('fastify-plugin')

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp((fastify, opts, next) => {
  fastify.decorate('someSupport', () => {
    return 'hugs'
  })
  next()
})

// It you prefer async/await, use the following
//
// module.exports = fp(async function (fastify, opts) {
//   fastify.decorate('someSupport', function () {
//     return 'hugs'
//   })
// })