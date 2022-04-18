require('dotenv').config()

const httpServer = require('http').createServer()
const io = require('socket.io')(httpServer, {
  // ...
})

function startServer (mongoServer) {
  io.on('connection', socket => {
    // ...
  })

  httpServer.listen(8123)
}

module.exports = {
  startServer
}
