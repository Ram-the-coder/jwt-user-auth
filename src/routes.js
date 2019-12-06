/* All routes */

const routes = require('express').Router()
const db = require('./db/' + process.env.DB_DRIVER)
const bcrypt = require('bcryptjs')
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
			const [user, token] = await db.createUser(email, hash)	
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
		const [user, token] = await db.authUser(email, passwd)
		res.status(200).json({
			user,
			token,
			'success': 'successfully authenticated'
		})
	} catch(error) {
		console.log('Error: ' + error + '\n')
		res.status(400).json({ error })
	}
	
})

/* Logout user */
routes.post('/authlogout', auth, async (req, res) => {
	const user = req.user
	const token = req.header('Authorization').replace('Bearer ', '')
	db.deAuthUser(user._id, token)
		.then(() => res.status(200).json({'success': 'User successfully logged out'}))
		.catch((error) => res.status(400).json({error}))
	
})

/* Sample protected route */
routes.get('/protected', auth, async (req, res) => {
	res.send("Protected Route")
})



module.exports = routes	