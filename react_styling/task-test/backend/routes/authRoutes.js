const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route to register a new user
router.post('/register', authController.register);

// Route to log in an existing user
router.post('/login', authController.login);

// Route to verify a user's email using a token
router.get('/verify-email/:token', authController.verifyEmail);

// Export the router to be used in the main app
module.exports = router;