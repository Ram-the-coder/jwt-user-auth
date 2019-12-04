/* All routes */

const routes = require('express').Router()
const db = require('./db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('./middlewares/auth')

/* Homepage */
routes.get('/', (req,res) => {
	res.sendFile('index.html')
})

/* Endpoint for user registration */
routes.post('/authregister', async (req, res) => {
	const email = req.body.email
	const passwd = req.body.passwd
	const repasswd = req.body.repasswd
	if(passwd == repasswd) {
		const hash = await bcrypt.hash(passwd, 8)
		try {
			const user = await db.insert('users', {email, passwd: hash})	
			const token = await generateAuthToken(user)
			if(!user.tokens)
				user.tokens = []
			user.tokens = user.tokens.concat({token})
			res.status(201).json({
				user,
				token,
				'success': 'User registered'
			})
		} catch(err) {
			console.log(err)
			res.status(400).json({'error': 'Unable to create user'})
		}	
	}
	else 
		res.json({'error': 'Password and retyped password don\'t match'})
})

/* Endpoint for user authentication and login */
routes.post('/authlogin', async (req, res) => {
	const email = req.body.email
	const passwd = req.body.passwd
	try {
		let user = await db.getUserByEmail('users', email)	
		if(!user)
			throw "Username doesn't exist"
		const isMatch = await bcrypt.compare(passwd, user.passwd)
		if(isMatch) {
			const token = await generateAuthToken(user)
			if(!user.tokens)
				user.tokens = []
			user.tokens = user.tokens.concat({token})
			res.status(200).json({
				user,
				token,
				'success': 'successfully authenticated'
			})
		}
		else
			res.status(400).json({'error': 'wrong password'})
	} catch(err) {
		console.log('Error: ' + err)
		res.status(400).json({'error': 'Error authenticating user'})
	}
})

/* Logout user */
routes.post('/authlogout', auth, async (req, res) => {
	const user = req.user
	const token = req.header('Authorization').replace('Bearer ', '')
	await db.removeToken('users', user._id, token)
	res.status(200).json({'success': 'User successfully logged out'})
})

/* Sample protected route */
routes.get('/protected', auth, async (req, res) => {
	res.send("Protected Route")
})

/* Generates an authentication token */
async function generateAuthToken(user) {
	const token = jwt.sign({ _id: user._id.toString()}, 'authboilerplate')
	await db.addToken('users', user._id, token)	
	return token
}

module.exports = routes