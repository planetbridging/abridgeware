const io = require('socket.io-client')

const { encrypt, decrypt } = require('./helpers/crypto')

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
      //console.log(this.sessionId)
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

module.exports = {
  objClientListener
}
