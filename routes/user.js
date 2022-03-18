const express = require('express');
const router = express.Router();

const { registerUser, 
	loginUser, 
	logoutUser, 
	forgotPassword,
	resetPassword,
	getUserProfile,
	updateProfile,
	getAllUsers, 
	getUserDetails,
	deleteUser,
	updateUser} = require('../controllers/userController');
const {isAuthenticated, isAuthorized} = require('../middleware/auth');

//register user
router.route('/user/register').post(registerUser);

//login user 
router.route('/user/login').post(loginUser);

//forgot password
router.route('/user/password/forgot').post(forgotPassword);

//reset password
router.route('/user/password/reset/:token').put(resetPassword);

//show user profile page
router.route('/user/me').get(isAuthenticated, getUserProfile)

//update user profile page
router.route('/user/me/update').put(isAuthenticated, updateProfile)

//logout user and remove cookie
router.route('/user/logout').get(logoutUser);

//ADMIN ROUTES

//get all users
router.route('/admin/users').get(isAuthenticated, isAuthorized, getAllUsers);

//get details of a user
router.route('/admin/user/:id').get(isAuthenticated, isAuthorized, getUserDetails)
				.put(isAuthenticated, isAuthorized, updateUser)
				.delete(isAuthenticated, isAuthorized, deleteUser);

module.exports = router;
