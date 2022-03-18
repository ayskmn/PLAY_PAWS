//save token in the cookie
const sendToken = (user, statusCode, res) => {
	const token = user.getJWTtoken();
	let date = new Date()
	date.setDate(date.getDate() + 7);
	const options = { expires: date, httpOnly: true}

	res.status(statusCode).cookie('token',token, options).json({token, user})
}

module.exports = sendToken;