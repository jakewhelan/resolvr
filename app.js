const path = require('path')
const fastifyAutoLoad = require('fastify-autoload')
const fastifyCookie = require('fastify-cookie')

module.exports = (fastify, opts, next) => {
  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(fastifyAutoLoad, {
    dir: path.join(__dirname, 'plugins')
  })

  // This loads all plugins defined in services
  // define your routes in one of these
  fastify.register(fastifyAutoLoad, {
    dir: path.join(__dirname, 'services')
  })

  fastify.register(fastifyCookie, (err) => {
    if (err) throw err
  })

  // Make sure to call next when done
  next()
}
