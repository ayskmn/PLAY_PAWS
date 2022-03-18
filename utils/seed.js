const Product = require('../models/product');
const dotenv = require('dotenv');
const connectDatabase = require('../db');

const products = require('../data/product');


dotenv.config({path: 'server/config/config.env'});

connectDatabase();

const seedProducts = async() => {
	try{
		await Product.deleteMany();
		await Product.insertMany(products);
		console.log('seeded!')
	}catch(err){
		console.log(err.message);
		process.exit();
	}
}

seedProducts();