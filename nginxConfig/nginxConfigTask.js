const path = require('path')
const pm2 = require('pm2')
const argv = require('minimist')(process.argv.slice(2))
const { NginxConfFile } = require('nginx-conf')
const execa = require('execa')
let latestConfigBody

const getNginxAbConfig = (rootApp, appList) => {
  const abBlock = appList.reduce((acc, { name, port }) => {
    return `${acc}
    if ($cookie_resolvr-ab-${name}) {
      proxy_pass http://127.0.0.1:${port};
      break;
    }`
  }, '')

  latestConfigBody = abBlock
  return {
    abConfig: `
      listen 41414;
      location / {
        proxy_set_header Host $host; ${abBlock}
        proxy_pass http://127.0.0.1:${rootApp.port};
      }
    `
  }
}

const openNginxConfig = nginxConfigFile => {
  return new Promise((resolve, reject) => {
    NginxConfFile.create(path.resolve(nginxConfigFile), (err, nginxConfig) => {
      if (err) {
        console.log(err)
        return
      }
      resolve(nginxConfig)
    })
  })
}

const getPm2AppList = () => {
  const { rootApp: rootAppJson } = argv
  const rootApp = JSON.parse(rootAppJson)
  return new Promise((resolve, reject) => {
    pm2.list((err, data) => {
      if (err) {
        console.error(err)
        reject(err)
        return
      }
      const list = data.map(({ name, pm2_env: { env: { PORT: port = null } } }) => ({ name, port }))
      const appList = list.filter(listItem => listItem.name !== rootApp.name)
      resolve({ appList })
    })
  })
}

const amendNginxConfig = (nginxConfig, abConfig) => {
  return new Promise((resolve, reject) => {
    nginxConfig.nginx.http._remove('server')
    nginxConfig.nginx.http._addVerbatimBlock('server', abConfig)
    resolve()
  })
}

const updateNginxConfig = async nginxConfig => {
  const { appList } = await getPm2AppList()

  const { rootApp: rootAppJson } = argv
  const rootApp = JSON.parse(rootAppJson)
  const { abConfig } = getNginxAbConfig(rootApp, appList)

  await amendNginxConfig(nginxConfig, abConfig)

  const { bin: cwd } = argv
  const { stdout } = execa('nginx', ['-s', 'reload'], { cwd })
  console.log(stdout)

  const { frequency } = argv
  const pollingFrequency = frequency * 1000
  setTimeout(() => {
    updateNginxConfig(nginxConfig)
  }, pollingFrequency)
}

const init = async () => {
  const { config: nginxConfigFile } = argv
  const nginxConfig = await openNginxConfig(nginxConfigFile)
  nginxConfig.on('flushed', () => {
    const timestamp = new Date().toLocaleTimeString('en-GB', { timeZone: 'UTC', timeZoneName: 'short' })
    console.log(`[${timestamp}] Configuration updated:`)
    console.log(latestConfigBody)
  })

  updateNginxConfig(nginxConfig)
}

init()
