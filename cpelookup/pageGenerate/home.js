//generates all the cpe links and so on in the database
var lstCpeLevels = []
var maxLevels = 0
async function generateHomePage (mongoServer) {
  var data = await mongoServer.getAllHistory('cpeSearch', 'uniCpe')
  var lstBase = []
  for (var b in data) {
    lstBase.push(data[b]['cpe'])
  }
  //objCpe
  //name, cveCount, exploitCount, subitems, level

  for (var c in lstBase) {
    //console.log(lstBase[c], c)
    if (lstBase[c] != null) {
      if (lstBase[c].includes(':')) {
        var cpeLvls = lstBase[c].split(':')
        if (cpeLvls.length > maxLevels) {
          maxLevels = cpeLvls.length
        }
      }
    }
  }

  console.log('max levels: ' + maxLevels)
  generateBedrock(lstBase)
}

function generateBedrock (lstBase) {
  for (var l = 0; l <= maxLevels; l++) {
    var lstLevel = []
    var uniLevelItems = new Map()

    for (var c in lstBase) {
      //console.log(lstBase[c], c)
      if (lstBase[c] != null) {
        if (lstBase[c].includes(':')) {
          var cpeLvls = lstBase[c].split(':')
          if (cpeLvls.length > l) {
            if (!uniLevelItems.has(cpeLvls[l])) {
              var objCpe = {
                name: cpeLvls[l],
                cveCount: 0,
                exploitCount: 0,
                nextLevelItems: [],
                level: l
              }
              lstLevel.push(objCpe)
              uniLevelItems.set(cpeLvls[l])
            }
          }
        }
      }
    }

    lstCpeLevels.push(lstLevel)
  }

  console.log(lstCpeLevels)
}

module.exports = {
  generateHomePage
}
