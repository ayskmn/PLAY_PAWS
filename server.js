const app = require('./app');
const connectDatabase = require('./db');
const dotenv = require('dotenv');
const process = require('process');
const cloudinary = require('cloudinary');


dotenv.config({path: 'server/config/config.env'});


const port = process.env.PORT || 5000 

//Connect to db
connectDatabase();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
})


// The unhandledRejection listener
process.on('unhandledRejection', (reason, promise) => {
        console.log('Unhandled Rejection at:', reason.stack || reason)
        // Recommended: send the information to sentry.io
        // or whatever crash reporting service you use
})


//Connect to server
app.listen(port, () => {
	console.log(`SERVER RUNNING ON PORT ${port} 
	in ${process.env.NODE_ENV} mode}`)
})

