const express = require('express');
const router = express.Router();

const {newOrder, getOrder, getMyOrders, allOrders, updateOrder, deleteOrder} = require('../controllers/orderController');
const{isAuthenticated, isAuthorized} = require('../middleware/auth');

//create new order
router.route('/order/new').post(isAuthenticated, newOrder);

//get order by id
router.route('/order/:id').get(isAuthenticated, getOrder);

//get all orders of logged in user
router.route('/orders/me').get(isAuthenticated,  getMyOrders);

//ADMIN ROUTES

//get all orders
router.route('/admin/orders').get(isAuthenticated, isAuthorized, allOrders);

//update order stock and delivery status
router.route('/admin/order/:id').put(isAuthenticated, isAuthorized, updateOrder)
				.delete(isAuthenticated, isAuthorized, deleteOrder)

module.exports = router;