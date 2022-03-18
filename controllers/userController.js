const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const MyError = require('../helpers/MyError');
const sendToken = require('../middleware/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');


// Register a new user
exports.registerUser =  asyncHandler( async( req, res, next ) => {

	 const result = await cloudinary.v2.uploader.upload(req.body.avatar,
  		{ folder: 'play-paws', width: 70, crop: 'scale' },
  		function(error, result) {console.log(result, error); });

	const {name, email, password} = req.body;
	
	const newUser = await User.create(
		{name, 
		email, 
		password, 
		avatar: {public_id: result.public_id, 
			url: result.secure_url}
	});


	sendToken(newUser, 200, res)
	
})

//Login user
exports.loginUser = asyncHandler(async (req, res, next) => {
	const {email, password} = req.body;
	const user = await User.findOne({ email});

	if(!email || !password) {
		return next(new MyError('Email/Password can not be blank', 400))
	}
	
	if(!user) {
		return next(new MyError('Invalid email/ password', 401))
	}

	const isPasswordMatched = await user.matchPassword(password);

	if(!isPasswordMatched) {
		return next(new MyError('Invalid password', 401))
	}

	if(user && isPasswordMatched) {
		sendToken(user, 200, res)
	}
	      
})

//Show User Profile 
exports.getUserProfile = asyncHandler(async(req, res, next) => {
	
	const user = await User.findById(req.user.id)
	if(!user) {
		return next(new MyError('Invalid email/ password', 401))
	}
	res.status(200).json({user});
})

//Logout user
exports.logoutUser = asyncHandler(async(req, res, next) => {
	const expDate = new Date(Date.now());
	res.cookie('token', null, {expires: expDate, httpOnly: true })

	res.status(200).json({message: 'Logged out'})
})


//Forgot Password 
exports.forgotPassword = asyncHandler(async(req, res, next)=> {

	const user = await User.findOne({ 
		email: req.body.email,
	});

	if(!user) {
		return next(new MyError(`The email address ${req.body.email} is not associated with any account.`, 404))
	}

	const resetToken = user.getResetPasswordToken();

	// save data to current user in db without validation,
	await user.save({
		validateBeforeSave: false,
      	});

	const resetLink = `${req.protocol}://${req.get('host')}/api/v1/user/password/reset/${resetToken}`
	const message = `Hi ${user.name}, \n 
	You are receiving this email because you have requested to reset your password.
	Please click on the following link \n\n ${resetLink}  \n\n to reset your password.
	\n If you did not request this, please ignore this email and your password will remain unchanged.\n`

	try {
		await sendEmail({
			email: user.email,
			subject: 'Password reset token',
			message
		})
		res.status(200).json({message: `Email sent to ${user.email}`, success:true});
	}
	catch (err) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
	
		await user.save();
	
		return next(new MyError('Email could not be sent', 500))
	}
})


//Reset password
exports.resetPassword = asyncHandler(async(req, res, next)=> {

	//Hash URL token
	const resetPasswordToken = crypto
					.createHash('sha256')
					.update(req.params.token)
					.digest('hex');
	
	//Compare hashed token with the resetPasswordToken in the db
	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpires: {$gt: Date.now()}
	})

	if(!user) {
		return next(new MyError('Invalid token', 400))
	}

	//Setup new password and save the new password to the db
	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpires = undefined;

	await user.save();

	sendToken(user, 200, res);

})

//Update user profile
exports.updateProfile = asyncHandler(async(req, res, next) => {
	const newUserData = {
		name: req.body.name,
		email: req.body.email,
	
	}
	//Update avatar

	const user = await User.findByIdAndUpdate(req.user.id, newUserData, {new: true, runValidators:true})

	res.status(200).json({
		user,
		success: true
	})
})

/** ADMIN ROUTE CONTROLLERS */

//Show all users
exports.getAllUsers = asyncHandler(async(req, res, next) => {
	const users = await User.find();
	res.status(200).json({users, success: true})
})

//Show user details
exports.getUserDetails = asyncHandler(async(req, res, next) => {
	const user = await User.findById(req.params.id);
	if(!user){
		return next(new MyError(`user not found with id of ${req.params.id}`, 404))
	}
	res.status(200).json({ user, success:true });
})

//Update a user to admin
exports.updateUser = asyncHandler(async (req, res, next) => {
	const newUserData = {
		isAdmin: true
	}
	const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
		new: true,
		runValidators: true,
		useFindAndModify: false
	})
	res.status(200).json({ user})
})

//Delete user profile
exports.deleteUser = asyncHandler(async(req, res, next) => {
	let user = await User.findById(req.params.id);

	if(!user) {
		return next(new MyError('product not found', 404))
	}
	await user.deleteOne();

	res.status(200).json({
		message: 'User successfully deleted.'
	})
})