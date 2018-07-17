const { chunksToLinesAsync, chomp } = require('@rauschma/stringio')
const { spawn } = require('child_process')

class NginxConfigWorker {
  constructor ({
    bin,
    config,
    rootApp,
    frequency
  }) {
    this.child = spawn('node', [
      'nginxConfig/nginxConfigTask.js',
      '--bin', bin,
      '--config', config,
      '--rootApp', JSON.stringify(rootApp),
      '--frequency', frequency
    ])
  }
  async listen (callback) {
    await this.echoReadable(this.child.stdout, callback)
  }
  async echoReadable (readable, callback) {
    for await (const line of chunksToLinesAsync(readable)) {
      callback(chomp(line))
    }
  }
}

module.exports = {
  NginxConfigWorker
}
