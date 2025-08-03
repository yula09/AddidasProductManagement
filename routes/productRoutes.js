const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// Dashboard route
router.get('/dashboard', isAuthenticated, productController.dashboard);

// Customer view - show all products
router.get('/', isAuthenticated, productController.showProducts);

// Admin manage view - manage all products
router.get('/manage', isAuthenticated, isAdmin, productController.manageProducts);

// Add product (GET + POST)
router.get('/add', isAuthenticated, isAdmin, productController.renderAddProduct);
router.post('/add', isAuthenticated, isAdmin, productController.addProduct);

// Edit product (GET + POST)
router.get('/edit/:id', isAuthenticated, isAdmin, productController.renderEditProduct);
router.post('/edit/:id', isAuthenticated, isAdmin, productController.updateProduct);

// Delete product (POST)
router.post('/delete/:id', isAuthenticated, isAdmin, productController.deleteProduct);

module.exports = router;
