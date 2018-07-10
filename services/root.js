const getActiveResolvrABTest = cookies => {
  const resolvrABTests = Object.entries(cookies)
    .sort(([, a], [, b]) => b - a)
    .reduce((acc, [key]) => {
      if (key.includes('resolvr-ab-')) acc.push(key.replace('resolvr-ab-', ''))
      return acc
    }, [])
  const [activeResolvrABTest] = resolvrABTests
  return { activeResolvrABTest }
}

module.exports = (fastify, opts, next) => {
  // fastify.get('/*', async ({ cookies }, reply) => {
  //   const { activeResolvrABTest } = getActiveResolvrABTest(cookies)
  //   // if (activeResolvrABTest === 'b') {
  //   //   reply.send(proxiedResponse)
  //   // }
  //   //   //reply.redirect('http://localhost:3002')
  // })
  next()
}
