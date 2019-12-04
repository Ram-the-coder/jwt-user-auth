/* Access Layer */
const MongoClient = require('mongodb').MongoClient

let db

/* Initialize connection to database */
async function init(dbname) {
	const url = 'mongodb://localhost/'
	MongoClient.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}, (err, client) => {
		if(err) {
			throw err
		} else {
			console.log("Connected to " + dbname)
			db = client.db(dbname)
			return;
		}
		throw "Unknown error"
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
async function getUser(collection, email) {
	return db.collection(collection).findOne({"email": email})
		.then(user => user)
		.catch(err => {throw (err)})
}



module.exports = {init, insert, getUser}