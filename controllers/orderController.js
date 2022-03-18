const asyncHandler = require('express-async-handler');
const Order = require('../models/order');
// const User = require('../models/user');
// const Product = require('../models/product');
const MyError = require('../helpers/MyError');
const product = require('../models/product');

//Create new order
exports.newOrder = asyncHandler(async(req, res, next) => {
	const { orderItems,
		shippingAddress,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		paymentInfo } = req.body;


		const order = await Order.create({
			orderItems,
			shippingAddress,
			itemsPrice,
			taxPrice,
			shippingPrice,
			totalPrice,
			paymentInfo,
			paidAt: Date.now(),
			user: req.user._id
		})

	console.log(order)
	res.status(200).json({order})
})

//Get order
exports.getOrder = asyncHandler(async(req, res, next) => {
	const order = await Order.findById(req.params.id);
	if(!order){
		return next(new MyError('order not found', 404))
	}
	res.status(200).json({order})

})

//Get orders of logged in user
exports.getMyOrders = asyncHandler(async(req, res, next) => {
	const orders = await Order.find({name: req.user._id});
	res.status(200).json({orders})
})

/** ADMIN */
//Get all orders
exports.allOrders = asyncHandler(async(req, res, next) => {
	const orders = await Order.find();

	let totalAmount;

	orders.forEach(order => {
		totalAmount += order.totalPrice
	})
	res.status(200).json({orders, totalAmount})
})

//Process Order
exports.updateOrder = asyncHandler(async(req, res, next) => {
	const order = await Order.findById(req.params.id);

	if(order.isDelivered === true) {
		return next(new MyError('The order has already been delivered.', 400))
	}

	order.orderItems.forEach(async item => {
		await updateStock(item.product, item.qty)
	})

	order.isDelivered = true;
	order.deliveredAt = Date.now();

	const updatedOrder = await order.save({validateBef})

	res.status(200).json({updatedOrder})


	async function updateStock(id, qty) {
		const product = await product.findById(id)
		product.stock = product.stock - qty;

		await product.save();
	}
})


//Delete Order
exports.deleteOrder = asyncHandler(async(req,res,next) => {
	let order = await Order.findById(req.params.id);

	if(!order) {
		return next(new MyError('order not found', 404))
	}
	await order.deleteOne();

	res.status(200).json({
		message: 'Order successfully deleted.'
	})
})