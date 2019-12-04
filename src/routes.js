/* All routes */

const routes = require('express').Router()
const db = require('./db')
const bcrypt = require('bcryptjs')

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
			res.status(201).json({'success': 'User registered'})
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
		const user = await db.getUser('users', email)	
		if(!user)
			throw "Username doesn't exist"
		const isMatch = await bcrypt.compare(passwd, user.passwd)
		if(isMatch) 
			res.status(200).json({'success': 'successfully authenticated'})
		else
			res.status(400).json({'error': 'wrong password'})
	} catch(err) {
		console.log('Error: ' + err)
		res.status(400).json({'error': 'username doesn\'t exist'})
	}
})

module.exports = routes