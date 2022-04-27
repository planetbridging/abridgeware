const { MongoClient } = require('mongodb')

class objServer {
  constructor () {
    var username = process.env.MONGOUSERNAME
    var password = process.env.MONGOPASSWORD

    this.uri =
      'mongodb://' +
      username +
      ':' +
      password +
      '@localhost:28123/?authSource=admin'
    this.client = null
  }

  async connectToServer () {
    console.log(this.uri)
    try {
      this.client = new MongoClient(this.uri)
      await this.client.connect()

      var lstdb = await this.listDatabases()
      console.log('db', lstdb)
      console.log('successfully connected')
    } catch (ex) {
      //console.log(ex)
      console.log('failed to connect to database')
      return false
    }
    return true
  }

  async listDatabases () {
    var databasesList = await this.client
      .db()
      .admin()
      .listDatabases()
    var lstdb = []
    databasesList.databases.forEach(db => lstdb.push(db.name))
    return lstdb
  }

  async getStats (dbName, collectionName) {
    var dbo = this.client.db(dbName)
    var stats = await dbo.collection(collectionName).stats()
    var lst = [stats['size'], stats['count'], stats['storageSize']]
    return lst
  }

  async listCollections (dbName) {
    var databasesList = await this.client
      .db()
      .admin()
      .listDatabases()
    var lstdb = []
    var lstCollection = []
    var lstInfo = []
    databasesList.databases.forEach(db => lstdb.push(db.name))
    if (dbName.includes(dbName)) {
      var dbo = this.client.db(dbName)
      await dbo.listCollections().forEach(async function (collection) {
        //var stats = await dbo.collection(collection['name']).stats();
        //var colCount = await dbo.collection(collection['name']).totalIndexSize();
        lstCollection.push(collection['name'])
      })

      for (var c in lstCollection) {
        var stats = await dbo.collection(lstCollection[c]).stats()
        lstInfo.push([lstCollection[c], stats['size'], stats['count']])
      }
    }
    return lstInfo
  }

  async saveHistory (obj, dbName, collectionName) {
    try {
      var dbo = this.client.db(dbName)
      dbo.collection(collectionName).insertOne(obj, function (err, res) {
        if (err) throw err
        console.log('1 document inserted')
        //db.close();
      })
    } catch (e) {
      console.log('unable to save history')
      console.log(e)
    }
  }

  async getAllHistory (dbName, collectionName) {
    var allItems = await this.client
      .db(dbName)
      .collection(collectionName)
      .find({})
      .toArray()
    return allItems
  }

  getExistUser (db, collection, id) {
    var found = false
    var client = this.client
    return new Promise(function (resolve, reject) {
      client
        .db(db)
        .collection(collection)
        .findOne({ id: id }, function (err, doc) {
          if (doc == null) {
            found = false
          } else {
            found = true
          }
          resolve(found)
        })
    })
  }

  async cpeSearch (search) {
    var client = await this.client
      .db('cpeSearch')
      .collection('uniCpe')
      //.find({ cpe: search })
      .find({ cpe: { $regex: search, $options: 'i' } })
      .limit(10)
      .toArray()
    return client
  }

  async getNthItem (nth, collection, db, count) {
    var allItems = await this.client
      .db(db)
      .collection(collection)
      .find({}, { sort: { $natural: 1 } })
      .limit(count)
      .skip(nth)
      .toArray()
    return allItems
  }

  async saveManyToCollection (lst, db, collection) {
    try {
      var dbo = this.client.db(db)
      dbo.collection(collection).insertMany(lst, function (err, res) {
        if (err) throw err
        console.log('1 document inserted')
        //db.close();
      })
    } catch (e) {
      console.log('unable to save')
      console.log(e)
    }
  }

  async deleteOnePermission (dbName, collection, id) {
    //dbo.inventory.deleteMany({});
    const query = { id: id }
    var allItems = await this.client
      .db(dbName)
      .collection(collection)
      .deleteOne(query)
  }

  async deleteAll (dbName, collection) {
    var allItems = await this.client
      .db(dbName)
      .collection(collection)
      .remove({})
  }

  //db.bios.remove( { } )

  async insertOnePermission (collection, id, dbName) {
    try {
      var dbo = this.client.db(dbName)
      dbo.collection(collection).insertOne({ id: id }, function (err, res) {
        if (err) throw err
        console.log('1 document inserted')
        //db.close();
      })
    } catch (e) {
      console.log('unable to save ' + collection + ' on db ' + dbName)
      console.log(e)
    }
  }
}

module.exports = {
  objServer
}
