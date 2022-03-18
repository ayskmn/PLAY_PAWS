const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const MyError = require('../helpers/MyError');

//Authentication
exports.isAuthenticated = asyncHandler(async (req, res, next) => {
	const {token} = req.cookies;

	// console.log(token)
	if(!token) {
		next(new MyError('Login to access this page', 401))
	}

	const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
	// console.log(decoded)
	req.user = await User.findById(decoded._id);
	// console.log(req.user)

	next()

})


//Authorization for admin routes
exports.isAuthorized = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
	  next();
	} else {
		next(new MyError('Not authorized as admin', 401))

	}
};

