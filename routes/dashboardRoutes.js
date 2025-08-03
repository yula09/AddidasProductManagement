const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const productController = require('../controllers/productController');

router.get('/dashboard', isAuthenticated, productController.dashboard);

module.exports = router;
