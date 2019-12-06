const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if(!validator.isEmail(value)) {
				throw new Error('Email is invalid')
			}
		}
	},
	passwd: {
		type: String,
		required: true,
		trim: true,
		minlength: 8,
		validate(value) {
			if(value.toLowerCase() == 'password') {
				throw new Error('Password cannot be the word "password"')
			}
		}
	},
	tokens: [{
		token: {
			type: String,
			required: true,
		}
	}]

})

const User = mongoose.model('User', userSchema)

module.exports = User