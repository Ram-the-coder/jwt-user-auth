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
				resolve(res.ops[0])
		})	
	})
}

/* Return the user document corresponding to the given email id */
async function getUserByEmail(collection, email) {
	return db.collection(collection).findOne({"email": email})
		.then(user => user)
		.catch(err => {throw (err)})
}

/* Return the user document having the given id and token */
async function getUserByIdAndToken(collection, id, token) {
	console.log("id: " + id + '\ntoken: ' + token + '\n')
	return db.collection(collection).findOne({"_id": id, 'tokens.token': token})
		.then(user => user)
		.catch(err => {throw (err)})
}

/* Add token to the user document specified by the id */
async function addToken(collection, userid, token) {
	db.collection(collection).findOneAndUpdate(
		{'_id': userid},
		{ $push: {tokens: {token}}}
	)
}

/* Remove the token from the user document specified by the id */
async function removeToken(collection, userid, token) {
	db.collection(collection).findOneAndUpdate(
		{'_id': userid},
		{ $pull: {tokens: {token}}}
	)
}

module.exports = {init, insert, getUserByEmail, getUserByIdAndToken, addToken, removeToken}