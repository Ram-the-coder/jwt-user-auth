const jwt = require('jsonwebtoken')
const db = require('../db')
const ObjectId = require('mongodb').ObjectId

/* Authenticate user */
async function auth(req, res, next) {
	try {
		const token = req.header('Authorization').replace('Bearer ', '')
		const decoded = jwt.verify(token, 'authboilerplate')
		console.log(token, decoded)
		const user = await db.getUserByIdAndToken('users', ObjectId(decoded._id), token)
		if(!user)
			throw new Error()
		
		req.user = user
		next()
	} catch(e) {
		res.status(401).json({'error': 'Please authenticate'})
	}
}

module.exports = auth