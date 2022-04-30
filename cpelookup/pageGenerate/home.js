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
  generateNextLevel(lstBase)
  await saveCpeLevels(mongoServer)
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
    if (lstLevel.length > 0) {
      lstCpeLevels.push(lstLevel)
    }

    //console.log(lstLevel.length)
  }

  //console.log(lstCpeLevels)
}

function generateNextLevel (lstBase) {
  for (var c in lstCpeLevels) {
    console.log('lvl' + c)
    for (var i in lstCpeLevels[c]) {
      for (var b in lstBase) {
        if (lstBase[b] != null) {
          if (lstBase[b].includes(':')) {
            var cpeLvls = lstBase[b].split(':')
            var nextLvlnum = Number(i) + Number(1)

            if (nextLvlnum <= cpeLvls.length) {
              if (
                !lstCpeLevels[c][i].nextLevelItems.includes(cpeLvls[nextLvlnum])
              ) {
                lstCpeLevels[c][i].nextLevelItems.push(cpeLvls[nextLvlnum])
              }
            }
          }
        }
      }
    }
  }

  console.log('generateNextLevel finished')
}

async function saveCpeLevels (mongoServer) {
  for (var c in lstCpeLevels) {
    console.log('saving lvl' + c)
    await mongoServer.deleteAll('cpeSearch', 'cpeStatsLvl' + c)
    await mongoServer.saveManyToCollection(
      lstCpeLevels[c],
      'cpeSearch',
      'cpeStatsLvl' + c
    )
  }
}

module.exports = {
  generateHomePage
}
