const io = require('socket.io-client')

const { encrypt, decrypt } = require('./helpers/crypto')
const { sleep } = require('./helpers/mixed')
require('dotenv').config()

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
    try {
      var jSend = encrypt(this.sessionId, JSON.stringify(jdata))
      this.chatSocket.emit(channel, jSend)
    } catch {
      console.log('sending failed')
    }
  }
}

class objCpelookup {
  constructor () {
    console.log(process.env.CPELOOKUP)
    this.objCpelookup = new objClientListener(
      'http://' + process.env.CPELOOKUP,
      //'http://localhost:8123',
      'cpelookup'
    )

    this.objCpelookup.recReq('cpeSearch', this.processCpeSearch)
    this.objCpelookup.recReq('lstCpeCollections', this.processCpeLevels)
    this.objCpelookup.sendReq('lstCpeCollections', { cpe: '' })
  }

  async searchCpe (cpe) {
    this.objCpelookup.sendReq('cpeSearch', { cpe: cpe })
  }

  async dynSend () {
    //this.objCpelookup
  }

  async processCpeSearch (j) {
    console.log(j)
    console.log('cpelookup test results')
  }

  async processCpeLevels (j) {
    console.log(j)
    console.log('cpelookup lvls results')
  }
}

module.exports = {
  objClientListener,
  objCpelookup
}
