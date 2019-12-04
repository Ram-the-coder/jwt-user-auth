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
		const user = await db.insert('users', {email, passwd: hash})
		if(user)
			res.status(200).send({"success": "User registered"})
		else
			res.status(400).send({"error": "unknown error in creating user"})
	}
	else 
		res.send({"error": "Password and retyped password don't match"})
})

/* Endpoint for user authentication and login */
routes.post('/authlogin', async (req, res) => {
	const email = req.body.email
	const passwd = req.body.passwd
	const user = await db.getUser('users', email)
	if(user) {
		console.log(user)
		const isMatch = await bcrypt.compare(passwd, user.passwd)
		if(isMatch)
			res.status(200).send({'success': 'successfully authenticated'})
		else
			res.status(400).send({'error': 'wrong password'})
	} else
		res.status(400).send({'error': 'username doesn\'t exist'})
	
	
})

module.exports = routes