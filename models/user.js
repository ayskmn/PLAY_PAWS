const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({

	name : {
		type: String,
		required: [true, 'Name can not be blank.'],
		maxLength: [25, 'Your name can not be longer than 30 characters.']
	},
	email: {
		type: String,
		required: [true, 'Email can not be blank.'],
		unique: true,
		validate: [validator.isEmail, 'Enter a valid email address.']

	},
	password: {
		type: String,
		required: [true, 'Password can not be blank.'],
		minLength: [7, 'Password must be longer than 7 characters.'],
	},
	avatar: {
		public_id: {
			type: String,
			required: true
		},
		url: {
			type: String,
			required: true
		}
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date
})


//Hash the password user has entered before save
userSchema.pre('save', async function (next) {
	//If the password is not modified move on to the next function
	if (!this.isModified('password')) {
	    next()
	}
	//If the password is modified bcrypt the new password with salt and save
	const salt = await bcrypt.genSalt(12);
	this.password = await bcrypt.hash(this.password, salt);
})

//Return JWT token
userSchema.methods.getJWTtoken = function () {
	const user = {_id: this._id}
	console.log('____________________')
	console.log(user)

	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn : process.env.JWT_EXPIRES_IN
	})
}

//Match the password entered by the user with the password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};
      

//Generate new password and reset token
userSchema.methods.getResetPasswordToken = function() {

	//generate new token
	const resetToken = crypto.randomBytes(20).toString('hex');
	
	//hash the new token and set it to resetPasswordToken in the user model, 
	//to be saved in db
	this.resetPasswordToken = crypto
					.createHash('sha256')
					.update(resetToken)
					.digest('hex')

	//set expiration time (30 mins from current date)
	let date = new Date()
	date.setMinutes(date.getMinutes() + 30)
	this.resetPasswordExpires = date;


	return resetToken;
}

module.exports = mongoose.model('User', userSchema)