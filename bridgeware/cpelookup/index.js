const http = require('http')
const https = require('https')
const fs = require('fs')

var cpeFeedsStart = 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-'
var cpeFeedsEnd = '.json.zip'
var lstDownloads = []

;(async () => {
  console.log('welcome to the cpelookup')
  console.log('starting setup')
  await setup()
  await unZipAndUpload()
  console.log('finished setup')
})()

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

async function unZipAndUpload () {
  fs.readdir('downloads', (err, files) => {
    files.forEach(file => {
      console.log(file)
    })
  })
}
