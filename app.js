const path = require('path')
const fastifyAutoLoad = require('fastify-autoload')
const fastifyCookie = require('fastify-cookie')
const fastifyHttpProxy = require('fastify-http-proxy')

module.exports = (fastify, opts, next) => {
  // Place here your custom code!

  // Do not touch the following lines

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

  fastify.register(fastifyHttpProxy, {
    upstream: 'http://localhost:3001'
  })

  // Make sure to call next when done
  next()
}
