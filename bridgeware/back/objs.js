const io = require('socket.io-client')

const { encrypt, decrypt } = require('./helpers/crypto')
const { sleep } = require('./helpers/mixed')

class objClientListener {
  constructor (ioLink, name) {
    this.name = name
    this.ioLink = ioLink
    this.sessionId = ''
    this.setup()
  }

  async setup () {
    this.chatSocket = io.connect(this.ioLink)
    this.chatSocket.on('setup', data => {
      this.sessionId = data
      console.log('session setup for ' + this.name)
    })
    this.chatSocket.on('connected', data => {
      var de = decrypt(this.sessionId, data)
      console.log('successfully connected to ' + this.name)
    })
    //console.log(this.chatSocket)
  }

  recReq (channel, jProcess) {
    this.chatSocket.on(channel, async data => {
      var de = decrypt(this.sessionId, data)
      var j = JSON.parse(de)
      jProcess(j)
    })
  }

  sendReq (channel, jdata) {
    console.log(this.sessionId)
    var jSend = encrypt(this.sessionId, JSON.stringify(jdata))
    this.chatSocket.emit(channel, jSend)
  }
}

class objCpelookup {
  constructor () {
    //console.log(process.env.CPELOOKUP)
    this.objCpelookup = new objClientListener(
      //process.env.CPELOOKUP,
      'http://localhost:8123',
      'cpelookup'
    )
    this.objCpelookup.recReq('cpeSearch', this.processCpeSearch)
  }

  async searchCpe (cpe) {
    this.objCpelookup.sendReq('cpeSearch', { cpe: cpe })
  }

  async processCpeSearch (j) {
    console.log(j)
    console.log('cpelookup test results')
  }
}

module.exports = {
  objClientListener,
  objCpelookup
}
