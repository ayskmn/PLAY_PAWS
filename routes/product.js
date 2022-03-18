const express = require('express');
const router = express.Router();
const { getProducts, 
	addProduct, 
	getProductById, 
	updateProduct, 
	deleteProduct, 
	createProductReview} = require('../controllers/productController');

const { isAuthenticated, isAuthorized }  = require('../middleware/auth');


//list all products
router.route('/products').get(getProducts);

//get a single product
router.route('/products/:id').get(getProductById);

//create product review
router.route('/products/:id/review').post(isAuthenticated, createProductReview)

//update a product
router.route('/admin/products/:id').put(isAuthenticated, isAuthorized, updateProduct);

//delete product
router.route('/admin/products/:id').delete(isAuthenticated, isAuthorized,deleteProduct);

//create new product
router.route('/admin/products/new').post(isAuthenticated,isAuthorized, addProduct);



module.exports = router;
