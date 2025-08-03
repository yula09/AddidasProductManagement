// controllers/checkoutController.js

const pool = require("../config/db");

const checkoutPage = (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
  res.render("checkout", { cart, total });
};

const placeOrder = async (req, res) => {
  const cart = req.session.cart || [];
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
  try {
    await pool.query(
      `INSERT INTO orders (user_id, items, total) VALUES ($1, $2, $3)`,
      [req.session.user.id, JSON.stringify(cart), total]
    );

    req.session.cart = []; // Clear cart after order
    res.render("orderSuccess", { total });
  } catch (err) {
    console.error(err);
    res.send("Failed to place order.");
  }
};

module.exports = {
  checkoutPage,
  placeOrder
};
