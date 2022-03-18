const MyError = require("../helpers/MyError");

const errorMiddleware = (err, req, res, next) => {

	res.status(err.statusCode || 500).json({
		error: err,
		name: err.name,
		statusCode: err.statusCode,
		message: err.message,
		stack: err.stack
	});



	
}

module.exports = errorMiddleware;