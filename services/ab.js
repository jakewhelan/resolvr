const getResolvrAbTestCookies = cookies => Object.keys(cookies).filter(key => key.includes('resolvr-ab-'))

module.exports = (fastify, opts, next) => {
  fastify.get('/', (request, reply) => {
    reply.send({ works: true })
  })

  fastify.get('/ab/set/:abTestName', ({ cookies, params: { abTestName } }, reply) => {
    if (cookies) {
      const resolvrAbTestCookies = getResolvrAbTestCookies(cookies)
      for (const cookie of resolvrAbTestCookies) {
        reply.setCookie(cookie, '', { path: '/', expires: -1 })
      }
    }
    const cookie = `resolvr-ab-${abTestName}`
    const value = Date.now()

    reply
      .setCookie(cookie, value, { path: '/' })
      .send({
        cookie,
        value
      })
  })
  next()
}

module.exports.autoPrefix = '/resolvr'
