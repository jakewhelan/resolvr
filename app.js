const path = require('path')
const { createNginxConfigWorker } = require('./nginxConfig/nginxConfigWorkerFactory')
const fastifyAutoLoad = require('fastify-autoload')
const fastifyCookie = require('fastify-cookie')
const cosmiconfig = require('cosmiconfig')
const explorer = cosmiconfig('resolvr')

module.exports = (fastify, opts, next) => {
  fastify.register(fastifyAutoLoad, {
    dir: path.join(__dirname, 'services')
  })

  fastify.register(fastifyCookie, (err) => {
    if (err) throw err
  })

  explorer.search().then(async ({ config }) => {
    const nginxConfigWorker = await createNginxConfigWorker(config)
    nginxConfigWorker.listen(stdout => {
      console.log(stdout)
    })
  })

  next()
}
