const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

	name: {
		type: String,
		required: [true, 'Product name can not be blank.'],
		maxLength: [120, 'Product name is too long.'],
	},
	price: {
		type: Number,
		required: [true, 'Product price can not be blank.'],
		maxLength: [5, 'Product name is too long.'],
		default: 0
	},
	description: {
		type: String,
		required: [true, 'Product description can not be blank.'],
	},
	ratings: {
		type: Number,
		default: 0,
		required: true
	},
	images: [{
		public_id: {
			type: String,
			required:true
		},
		url : {
			type: String,
			required: true
		}
	}],
	category: {
		type: String,
		required: [true, 'Select category for the product.'],
		enum: {
			values: [
				'Toys',
				'Food',
				'Litter',
				'Containers',
				'Bedding',
				'Outerwear',
				'Electronics',
				'Books'
			],
			message: 'Select a category for your product.'
		}
	},
	seller: {
		type: String,
		required: true
	},
	stock: {
		type: Number,
		required: [true, 'Enter stock for your product.'],
		maxLength: 5,
		default: 0
	},
	numOfReviews: {
		type:Number,
		default: 0
	},
	reviews: [{
		name: {
			type: String,
			required: true
		},
		rating:{
			type:Number,
			required:true
		},
		comment: {
			type: String,
			required: true
		},
		user: {
			type: mongoose.Schema.Types.ObjectId, 
			required: true, 
			ref: 'User'
		}

	}],
	user: {
		type: mongoose.Schema.Types.ObjectId, 
		required: true, 
		ref: 'User'
	},

	createdAt: {
		type: Date,
		default: Date.now
	}
	
})

module.exports = mongoose.model('Product', productSchema)