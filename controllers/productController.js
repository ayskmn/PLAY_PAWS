const asyncHandler = require('express-async-handler');
const Product = require('../models/product');
const MyError = require('../helpers/MyError');


//Get all products
exports.getProducts = asyncHandler(async (req,res, next) => {
	const limit = Number(req.query.limit) || 4;
	const page = Number(req.query.page) || 1;
	const startIndex = (page -1) * limit;
	const endIndex = page * limit;

	const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};

	//number of documents with the keyword - {...keyword}
	const productCount = await Product.countDocuments({...keyword});

	const allProducts = await Product.find({...keyword}).limit(limit).skip(startIndex);

	res.status(200).json({ allProducts, productCount, limit, totalPages: Math.ceil (productCount / limit)  });
})



//Get product by id
exports.getProductById = asyncHandler(async (req,res,next) => {
	const product = await Product.findById(req.params.id);
	if(!product){
		return next(new MyError('product not found', 404))
	}
	res.status(200).json({ product });	
}) 


//Update product
exports.updateProduct = asyncHandler(async(req,res,next) => {
	let product = await Product.findById(req.params.id);
	console.log('************')

	if(!product) {
		return next(new MyError('product not found', 404))
	}

	product = await Product.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});

	res.status(200).json({
		product
	})
})

//Create new product
exports.addProduct = asyncHandler(async(req, res, next) => {
	req.body.user = req.user._id;
	console.log('******************')
	console.log(req.body.user)
	
	const newProduct = await Product.create(req.body);

	res.status(201).json({ newProduct })
})

//Delete product
exports.deleteProduct = asyncHandler(async(req,res,next) => {
	let product = await Product.findById(req.params.id);

	if(!product) {
		return next(new MyError('product not found', 404))
	}
	await product.deleteOne();

	res.status(200).json({
		message: 'Product successfully deleted.'
	})
})



exports.createProductReview = asyncHandler(async (req, res, next) => {
	const { rating, comment } = req.body;
	const product = await Product.findById(req.params.id);
	

	if (product) {

	  const review = { name: req.user.name, rating: Number(rating), comment, user: req.user._id };
	  console.log(product.reviews)

	  product.reviews.push(review);
	  console.log(product.reviews)

	  product.numReviews = product.reviews.length;
	  product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
	  await product.save({ validateBeforeSave: false });
	  res.status(201).json({ message: 'Review added', review });

	} else {
		return next(new MyError('Product can not be found. Review can not be added.', 404))
	}
});

