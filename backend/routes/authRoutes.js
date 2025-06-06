const express = require('express');
const { signup, login, verifyEmail } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify-email', verifyEmail); // New verification route

module.exports = router;