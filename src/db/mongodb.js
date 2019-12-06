/* Access Layer */
const MongoClient = require('mongodb').MongoClient
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const USER_COLLECTION = process.env.USER_COLLECTION
const ObjectID = require('mongodb').ObjectID

let client, db

/* Initialize connection to database */
function init(dbname) {
	return new Promise((resolve, reject) => {
		const url = process.env.DB_URL
		MongoClient.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}, (err, clientO) => {
			if(err)
				return reject(err)
			client = clientO 
			db = clientO.db(dbname)
			return resolve();
		})		
	})
	
}

/* Create user with the given email and the hashed password */
function createUser(email, hash) {
	return new Promise((resolve, reject) => {

		db.collection(USER_COLLECTION).insertOne({email, passwd: hash}, async (err, res) => {
			if(err)
				return reject(err)

			const user = res.ops[0]
			const token = await generateAuthToken(user._id)
			user.tokens = [{token}]	

			db.collection('users').findOneAndUpdate(
				{'_id': user._id},
				{ $push: {tokens: {token}}}
			)	
			return resolve([user, token])
		})		
	})
}

/* Authenticate (i.e. Login) user with the given email and password */
async function authUser(email, passwd) {
	const user = await db.collection(USER_COLLECTION).findOne({email})
	if(!user)
		throw 'Wrong email'

	const isMatch = await bcrypt.compare(passwd, user.passwd)

	if(!isMatch)
		throw 'Wrong password'

	const token = await generateAuthToken(user._id)
	if(!user.tokens)
		user.tokens = []
	user.tokens = user.tokens.concat({token})

	await db.collection(USER_COLLECTION).findOneAndUpdate(
		{'_id': user._id},
		{ $push: {tokens: {token}}}
	)	

	return [user, token]
}

/* De-authenticate (i.e. logout) user with the given user id and authentication token used */
/* Find user with the given user id and token combination and remove that token from the database */
async function deAuthUser(_id, token) {
	const user = await db.collection(USER_COLLECTION).findOneAndUpdate(
					{_id},
					{ $pull: {'tokens': {token}}}
				)
	return user
}

/* Given a user id and token, return the user document */
async function getUserByIdAndToken(userid, token) {
	try {
		console.log(token)
		const _id = ObjectID(userid)
		console.log(_id)
		const user = await db.collection(USER_COLLECTION).findOne({_id, 'tokens.token': token})
		return user
	} catch(error) {
		console.log(error)
		throw error
	}
}

/* Generates an authentication token */
async function generateAuthToken(userid) {
	const token = jwt.sign({ _id: userid.toString()}, 'authboilerplate')
	return token
}

/* Close database connection */
async function close(dbname) {
	client.close()
	console.log(dbname + ' database connection closed')
}

module.exports = {init, createUser, authUser, deAuthUser, getUserByIdAndToken, close}	