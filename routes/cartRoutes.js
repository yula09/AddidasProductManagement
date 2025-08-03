// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
} = require("../controllers/cartController");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", isAuthenticated, getCart);
router.post("/add", isAuthenticated, addToCart);
router.post("/remove/:id", isAuthenticated, removeFromCart);

module.exports = router;
