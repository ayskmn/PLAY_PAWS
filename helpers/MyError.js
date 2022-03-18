class MyError extends Error{
	constructor(message, statusCode) {
	  super(message, statusCode);
	  this.statusCode = statusCode;
	  this.message = message;

	//   Error.captureStackTrace(this, this.constructor)
	}
}


module.exports = MyError;