const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const MyError = require('../helpers/MyError');

//  /payment  create paymentIntent => pass client_secret to the client
// a key that’s unique to the individual PaymentIntent
// On client side, Stripe uses client_secret as a param when invoking
// stripe.confirmCard / stripe.handleCardAction functions to complete payment

// Process stripe payments   =>   /api/v1/payment/process
exports.processPayment = asyncHandler(async(req, res, next) => {
	const paymentIntent = await stripe.paymentIntents.create({
		amount: req.body.amount,
		currency: 'usd',
		// payment_method_types: ['card'],
		// metadata: { integration_check: 'accept_a_payment' }

	})
	res.status(200).json({
		success: true,
		client_secret: paymentIntent.client_secret

	})
})

exports.sendStripeApiKey = asyncHandler(async(req, res, next) => {

	res.status(200).json({	
		stripeApiKey: process.env.STRIPE_API_KEY

	})
})