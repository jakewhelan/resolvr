module.exports = (fastify, opts, next) => {
  fastify.get('/ab/set/:cookie', function (request, reply) {
    const cookie = `resolvr-ab-${request.params.cookie}`
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
