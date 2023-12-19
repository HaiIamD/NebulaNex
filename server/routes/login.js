const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Login routes
router.get('/login', loginController.login);

module.exports = router;
