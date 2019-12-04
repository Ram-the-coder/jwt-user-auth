const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const routes = require('./routes')
const db = require('./db')


const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', routes)

app.listen(3000, () => console.log("Server listening on port 3000"))
db.init('jwtauth')