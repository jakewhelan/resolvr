const path = require('path')
const { createNginxConfigWorker } = require('./nginxConfig/nginxConfigWorkerFactory')
const fastifyAutoLoad = require('fastify-autoload')
const fastifyCookie = require('fastify-cookie')
const cosmiconfig = require('cosmiconfig')
const explorer = cosmiconfig('resolvr')
const fs = require('fs')

const getConfig = async () => {
  const { config } = await explorer.search()
  return config
}

const mainPlugin = async (fastify, opts, next) => {
  fastify.register(fastifyAutoLoad, {
    dir: path.join(__dirname, 'services')
  })

  fastify.register(fastifyCookie, (err) => {
    if (err) throw err
  })

  const config = await getConfig()
  const nginxConfigWorker = await createNginxConfigWorker(config)
  nginxConfigWorker.listen(stdout => {
    console.log(stdout)
  })

  next()
}

const start = async () => {
  const {
    'key-path': keyPath,
    'cert-path': certPath
  } = await getConfig()

  const options = keyPath
    ? { https: { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) } }
    : {}
  const fastify = require('fastify')(options)

  fastify.register(mainPlugin)
}

start()
