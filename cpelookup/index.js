const http = require('http')
const https = require('https')
const fs = require('fs')
const unzipper = require('unzipper')
require('dotenv').config()
const webSock = require('./websock')

const objMongo = require('./objMongo')
var mongoServer = new objMongo.objServer()

var cpeFeedsStart = 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-'
var cpeFeedsEnd = '.json.zip'
var lstDownloads = []
var uniCpe = new Map()

;(async () => {
  console.log('welcome to the cpelookup')
  console.log('starting setup')
  await setup()
  await unZip()
  await getUniCpe()
  console.log('finished setup')
  //setTimeout(connectToDb, 2000)
  await sleep(2000)
  await connectToDb()
})()

function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

async function connectToDb () {
  console.log('trying to connect to db')
  var connected = false
  await sleep(2000)
  var tried = 0
  while (!connected) {
    try {
      connected = await mongoServer.connectToServer()
    } catch {}

    if (tried >= 10) {
      console.log('exit program')
      process.exit(1)
    } else {
      tried += 1
    }
    await sleep(2000)
    console.log('trying to connect to cpe db ' + tried)
  }

  if (connected) {
    console.log('connection successful')
  }

  await saveUniCpeToDb()
  await webSock.startServer(mongoServer)
}

function downloadFile (httporhttps, fileName, link) {
  return new Promise(resolve => {
    console.log('downloading ' + link)
    const file = fs.createWriteStream(fileName)
    const request = httporhttps.get(link, function (response) {
      response.pipe(file)

      // after download completed close filestream
      file.on('finish', () => {
        file.close()
        console.log('Download Completed: ' + link)
        resolve()
      })
    })
  })
}

async function setup () {
  if (!fs.existsSync('downloads')) {
    fs.mkdirSync('downloads')
  }

  //adding feeds to download list
  for (var y = 2002; y <= 2022; y++) {
    var buildLink = cpeFeedsStart + y + cpeFeedsEnd
    var buildFileName = 'nvdcve-1.1-' + y + cpeFeedsEnd
    lstDownloads.push([buildLink, buildFileName])
  }

  for (var i in lstDownloads) {
    console.log(i + '/' + (lstDownloads.length - 1))
    var path = __dirname + '/downloads/' + lstDownloads[i][1]
    if (!fs.existsSync(path)) {
      await downloadFile(https, path, lstDownloads[i][0])
    }
  }
}

async function unZip () {
  fs.readdir('downloads', (err, files) => {
    files.forEach(file => {
      if (file.endsWith('.zip')) {
        var unzipFile = 'downloads/' + file.replace('.zip', '')

        if (!fs.existsSync(unzipFile)) {
          console.log('unzipping ' + file, 'to ' + unzipFile)
          fs.createReadStream('downloads/' + file).pipe(
            unzipper.Extract({ path: unzipFile })
          )
        }
      }
    })
  })
}

async function getUniCpe () {
  for (var y = 2002; y <= 2022; y++) {
    var buildLink = 'nvdcve-1.1-' + y + '.json'
    var link = 'downloads/' + buildLink + '/' + buildLink
    if (fs.existsSync(link)) {
      console.log('reading ' + y)
      const data = fs.readFileSync(link, 'utf8')
      var j = JSON.parse(data)
      var lst = j['CVE_Items']
      for (var l in lst) {
        var lstNodes = lst[l]['configurations']['nodes']
        for (var n in lstNodes) {
          var lstCpeMatch = lstNodes[n]['cpe_match']
          for (var c in lstCpeMatch) {
            var cpe = lstCpeMatch[c]['cpe23Uri']
            cpe = cpe.replace('cpe:2.3:', '')
            cpe = cpe.split(':*')[0]
            //console.log(cpe)
            uniCpe.set(cpe)
          }
        }
      }
      break
    }
  }
}

async function saveUniCpeToDb () {
  // saveManyToCollection (lst, db, collection)
  var lstUni = []
  for (let [key, value] of uniCpe) {
    //console.log(key, value)
    lstUni.push({ cpe: key })
  }

  await mongoServer.deleteAll('cpeSearch', 'uniCpe')
  await mongoServer.saveManyToCollection(lstUni, 'cpeSearch', 'uniCpe')

  //(nth, collection, db, count)
  var sample = await mongoServer.getNthItem(1, 'uniCpe', 'cpeSearch', 5)
  console.log(sample)
}
