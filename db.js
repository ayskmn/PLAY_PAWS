const mongoose = require('mongoose');

const connectDatabase = async () => {
	await mongoose.connect(process.env.DB_LOCAL_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).then(() => console.log('Connected to db!')) 
}

module.exports = connectDatabase;