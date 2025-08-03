// routes/checkoutRoutes.js

const express = require("express");
const router = express.Router();
const { checkoutPage, placeOrder } = require("../controllers/checkoutController");

router.get("/", checkoutPage);
router.post("/", placeOrder);

module.exports = router;
