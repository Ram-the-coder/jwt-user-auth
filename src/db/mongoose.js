const mongoose = require('mongoose')
const User = require('../models/user')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const USER_COLLECTION = process.env.USER_COLLECTION

/* Initialize connection to database */
async function init(dbname) {
	const url = process.env.DB_URL + dbname
	await mongoose.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	}).catch(err => {throw err})
}

/* Create user with the given email and the hashed password */
async function createUser(email, hash) {
	try {
			const user = new User(({email, passwd: hash}))
			const token = await generateAuthToken(user._id)
			user.tokens = [{token}]
			await user.save()
			return [user, token]
		} catch(err) {
			throw err
			
		}
}

/* Authenticate (i.e. Login) user with the given email and password */
async function authUser(email, passwd) {
	
	let user = await User.findOne({email})

	if(!user)
		throw "Wrong email"

	const isMatch = await bcrypt.compare(passwd, user.passwd)
	if(isMatch) {
		const token = await generateAuthToken(user._id)
		if(!user.tokens)
			user.tokens = []
		user.tokens = user.tokens.concat({token})
		await user.save()
		return [user, token]
	} else
		throw 'Wrong password'
}

/* De-authenticate (i.e. logout) user with the given user id and authentication token used */
/* Find user with the given user id and token combination and remove that token from the database */
async function deAuthUser(_id, token) {
	const user = await User.findByIdAndUpdate({_id}, { $pull: {'tokens': {token}}})
	return user
}

/* Generates an authentication token */
async function getUserByIdAndToken(_id, token) {
	try {
		const user = await User.findOne({_id, 'tokens.token': token}, (err, usr) => {
			if(err) {
				console.log(err)
				throw err
			}
			return usr
		})
		return user
	} catch(e) {
		console.log(e)
		throw e
	}
}

/* Generates an authentication token */
async function generateAuthToken(userid) {
	const token = jwt.sign({ _id: userid.toString()}, 'authboilerplate')
	return token
}

/* Close database connection */
async function close() {
	mongoose.connection.close()
	console.log('mongoose connection closed')
}

module.exports = {init, createUser, authUser, deAuthUser, getUserByIdAndToken, close}