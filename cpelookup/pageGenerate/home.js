//generates all the cpe links and so on in the database
const obj = require('../objs')

async function generateHomePage (mongoServer) {
  var data = await mongoServer.getAllHistory('cpeSearch', 'uniCpe')
  var lstBase = []
  for (var b in data) {
    lstBase.push(data[b]['cpe'])
  }

  var lstCpe = []
  for (var c in lstBase) {
  }
}

module.exports = {
  generateHomePage
}
