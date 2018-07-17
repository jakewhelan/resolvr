const pm2 = require('pm2')
const { NginxConfigWorker } = require('./NginxConfigWorker')

const createNginxConfigWorker = async ({
  'nginx-bin-path': bin = null,
  'nginx-config-file': config = null,
  'root-app-name': rootAppName = null,
  'polling-frequency': frequency = 5
}) => {
  if (!bin) {
    console.error(`Error -> Resolvr: 'nginx-bin-path' config property must be defined`)
    process.exit(1)
  }
  if (!config) {
    console.error(`Error -> Resolvr: 'nginx-config-file' config property must be defined`)
    process.exit(1)
  }
  if (!rootAppName) {
    console.error(`Error -> Resolvr: 'root-app-name' config property must be defined`)
    process.exit(1)
  }

  const rootApp = await new Promise((resolve, reject) => {
    pm2.list((err, data) => {
      if (err) {
        console.error(err)
        reject(err)
        return
      }
      const list = data.map(({ name, pm2_env: { env: { PORT: port = null } } }) => ({ name, port }))
      const rootApp = list.filter(listItem => listItem.name === rootAppName)[0]
      resolve(rootApp)
    })
  })
  if (!rootApp) {
    console.error('Error -> Resolvr: provided root-app-name is not an existing PM2 process')
    process.exit(1)
  }
  if (!rootApp.port) {
    console.error(`Error -> Resolvr: environmental variable PORT is not set for provided root-app ${rootApp.name}`)
    process.exit(1)
  }

  console.info(`
    Resolvr - all systems go!
      - Using nginx at '${bin}'
      - Doing awesome things to '${config}'
      - Sending clean connections to root app '${rootApp.name}' on port ${rootApp.port}
      - Polling frequency set to ${frequency} seconds
  `)

  return new NginxConfigWorker({
    bin,
    config,
    rootApp,
    frequency
  })
}

module.exports = {
  createNginxConfigWorker
}
