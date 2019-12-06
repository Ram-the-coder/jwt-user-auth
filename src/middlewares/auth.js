const jwt = require('jsonwebtoken')
const db = require('../db/' + process.env.DB_DRIVER)

/* Authenticate user */
async function auth(req, res, next) {
	try {
		const token = req.header('Authorization').replace('Bearer ', '')
		const decoded = jwt.verify(token, 'authboilerplate')

		const user = await db.getUserByIdAndToken(decoded._id, token)
		if(!user)
			throw 'Invalid token'
		
		req.user = user
		next()

	} catch(error) {
		console.log('Error in auth: ' + error)
		res.status(401).json({error})
	}
}

module.exports = auth