const http = require('http')
const https = require('https')
var express = require('express')
var cors = require('cors')
var uuid = require('uuid'),
  app = express(),
  server = require('http').createServer(app)
const axios = require('axios').default
const io = require('socket.io-client')

const { encrypt, decrypt } = require('./helpers/crypto')

const obj = require('./objs')
const { sleep } = require('./helpers/mixed')

var port = 80

;(async () => {
  console.log('welcome to the bridgeware')
  var cpelookup = new obj.objCpelookup()
  await sleep(1000)
  await cpelookup.searchCpe('a:apache:http_server:2')
  /*var tk = uuid.v4()

  var secretKey = tk

  var txt_test = encrypt(secretKey, 'Hello from socket shannon')
  console.log(txt_test)*/

  console.log('setup complete')
})()

app.use('/', express.static(__dirname + '/build/'))

server.listen(port, function () {
  console.log('listening on *:' + port)
})
