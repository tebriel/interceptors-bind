const http = require('http')
const https = require('https')

const keepAlive = true
const maxSockets = 1

function createAgentClass (BaseAgent) {
  class CustomAgent extends BaseAgent {
    constructor () {
      super({ keepAlive, maxSockets })
    }

    createConnection (...args) {
      return this._noop(() => super.createConnection(...args))
    }

    _noop (callback) {
      return
    }
  }

  return CustomAgent
}

const HttpAgent = createAgentClass(http.Agent)
const HttpsAgent = createAgentClass(https.Agent)

module.exports = {
  HttpAgent: new HttpAgent(),
  HttpsAgent: new HttpsAgent(),
}
