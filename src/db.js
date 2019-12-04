const MongoClient = require('mongodb').MongoClient

let db

function init(dbname) {
	const url = 'mongodb://localhost/'
	MongoClient.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}, (err, client) => {
		if(err)
			throw err
		console.log("Connected to " + dbname)
		db = client.db(dbname)
	})
}

function insert(collection, document) {
	db.collection(collection).insertOne(document, (err, res) => {
		if(err)
			throw err
		console.log("1 document inserted")
		console.log(res)
	})
}

function getUser(collection, email, cb) {
	db.collection(collection).findOne({"email": email}).then(result => {
		cb(result)
	})
}

module.exports = {init, insert, getUser}