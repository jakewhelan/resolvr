const fastify = require('fastify')({
  logger: true
})
const app = require('./app')

fastify.register(app)

fastify.listen(process.env.PORT || 3001, function (err) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
