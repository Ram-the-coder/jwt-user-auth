/* Access Layer */
const MongoClient = require('mongodb').MongoClient

let db

/* Initialize connection to database */
function init(dbname) {
	return new Promise((resolve, reject) => {
		const url = 'mongodb://localhost/'
		MongoClient.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}, (err, client) => {
			if(err) {
				reject(err)
			} else {
				console.log("Connected to " + dbname)
				db = client.db(dbname)
				resolve()	
			}
			reject(new Error("Unknown error"))
		})	
	})
	
}

/* Insert document into collection */
function insert(collection, document) {
	return new Promise((resolve, reject) => {
		db.collection(collection).insertOne(document, (err, res) => {
			if(err)
				reject(err)
			else
				resolve(res)
		})	
	})
	
}

/* Return the user document corresponding to the given email id */
function getUser(collection, email) {
	return new Promise((resolve, reject) => {
		db.collection(collection).findOne({"email": email}).then(result => resolve(result)).catch(err => reject(err))
	})
	
}

module.exports = {init, insert, getUser}