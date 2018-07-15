const pm2 = require('pm2')

const init = async () => {
  const list = await new Promise((resolve, reject) => {
    pm2.list((err, data) => {
      if (err) {
        console.log(err)
        reject(err)
        return
      }
      resolve(data)
    })
  })
  const apps = list.map(({ name, pm2_env: { env: { PORT: port = 3001 } } }) => ({ name, port }))
  const nginxAbConfig = apps.reduce((acc, { name, port }) => {
    const abBlock = `
    if ($cookie_resolvr-ab-${name}) {
      proxy_pass http://127.0.0.1:${port};
      break;
    }`
    return acc + abBlock
  }, '')
  const { NginxConfFile } = require('nginx-conf')
  NginxConfFile.create('./nginx.conf', (err, conf) => {
    if (err) {
      console.log(err)
      return
    }
    conf.nginx.http._remove('server')
    conf.nginx.http._addVerbatimBlock('server', `
      listen 100;
      location / {
        proxy_set_header Host $host; ${nginxAbConfig}
        proxy_pass http://127.0.0.1:3000;
      }
    `)
  })
}

// server {
//   listen 81;
//   location / {
//       proxy_set_header Host $host;
//       if ($cookie_resolvr-ab-b) {
//           proxy_pass http://127.0.0.1:3001;
//           break;
//       }
//       proxy_pass http://127.0.0.1:3002;
//   }
// }

init()
