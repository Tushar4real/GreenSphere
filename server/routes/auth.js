const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/initiate-signup', authController.initiateSignup);
router.post('/register', authController.register); // Direct registration
router.post('/verify-signup-otp', authController.verifySignupOTP);
router.post('/login', authController.login);
router.get('/verify', authController.verify);
router.post('/forgot-password', authController.forgotPassword);
router.post('/confirm-forgot-password', authController.confirmForgotPassword);
router.post('/change-password', authController.changePassword);

module.exports = router;