/* Business Layer */
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const routes = require('./routes')
const db = require('./db')


const app = express()

/* Body parser */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* Set public directory */
app.use(express.static(path.join(__dirname, '../public')));

/* Set routes */
app.use('/', routes)

/* Listen on port */
app.listen(3000, () => console.log("Server listening on port 3000"))

/* Initialize database connection */
db.init('jwtauth').then(() => console.log("Connected to jwtauth MongoDB database")).catch(err => {
	console.log("Unable to connect to MongoDB database jwtauth")
	console.log(err)
})

