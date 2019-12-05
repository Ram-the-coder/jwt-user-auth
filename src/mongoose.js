const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://localhost/jwtuserauth', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})

const User = mongoose.model('User', {
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

const usr = new User({
	email: 'sheldon1@caltech.com',
	passwd: 'genius'
})

usr.save().then(() => console.log(usr)).catch(err => console.log(err))