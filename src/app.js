	/* Business Layer */
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const routes = require('./routes')
const db = require('./db/' + process.env.DB_DRIVER)



const app = express()

/* Body parser */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* Set public directory */
app.use(express.static(path.join(__dirname, '../public')));

/* Set routes */
app.use('/', routes)

/* Listen on port */
const server = app.listen(process.env.PORT, () => console.log("Server listening on port " + process.env.PORT))

/* Initialize database connection */
db.init(process.env.DB_NAME).then(() => console.log("Connected to " + process.env.DB_NAME + " MongoDB database")).catch(err => {
	console.log("Unable to connect to MongoDB database " + process.env.DB_NAME)
	console.log(err)
})

/* Handle process terminating signals */
/* If a process terminating signal is received, terminate the databse connection and then stop the server */
const sigs = ['SIGINT', 'SIGTERM', 'SIGQUIT']
sigs.forEach(sig => {
	process.on(sig, () => {
		db.close(process.env.DB_NAME)
		console.log('Closing node.js server...')
		server.close()
	})
})