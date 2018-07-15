const getResolvrAbTestCookies = cookies => Object.keys(cookies).filter(key => key.includes('resolvr-ab-'))

module.exports = (fastify, opts, next) => {
  fastify.get('/ab/set/:abTestName', function ({ cookies, params: { abTestName } }, reply) {
    const resolvrAbTestCookies = getResolvrAbTestCookies(cookies)
    for (const cookie of resolvrAbTestCookies) {
      reply.setCookie(cookie, '', { path: '/', expires: -1 })
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
