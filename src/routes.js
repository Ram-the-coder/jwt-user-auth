const routes = require('express').Router()
const db = require('./db')
const bcrypt = require('bcryptjs')


routes.get('/', (req,res) => {
	res.sendFile('index.html')
})

routes.post('/authregister', (req, res) => {
	const email = req.body.email
	const passwd = req.body.passwd
	const repasswd = req.body.repasswd
	if(passwd == repasswd) {
		const hash = bcrypt.hashSync(passwd, 8)
		db.insert('users', {email, passwd: hash})
		res.send({"success": "User registered"})
	}
	else 
		res.send({"error": "Password and retyped password don't match"})
})

routes.post('/authlogin', (req, res) => {
	const email = req.body.email
	const passwd = req.body.passwd
	const user = db.getUser('users', email, (user) => {
		if(user) {
			console.log(user)
			const isMatch = bcrypt.compareSync(passwd, user.passwd)
			if(isMatch)
				res.send({'success': 'successfully authenticated'})
			else
				res.send({'error': 'wrong password'})
		} else
			res.send({'error': 'username doesn\'t exist'})
	});
	
})

module.exports = routes