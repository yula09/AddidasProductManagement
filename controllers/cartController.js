const pool = require("../config/db");

// Get current user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { rows: cartItems } = await pool.query(
      `SELECT p.*, c.quantity FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1`,
      [userId]
    );
    res.render("cart", { user: req.session.user, cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading cart");
  }
};

// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { productId, quantity } = req.body;

    // Validate inputs
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).send("Invalid product or quantity");
    }

    // Check if product already in cart
    const { rows } = await pool.query(
      `SELECT * FROM cart WHERE user_id = $1 AND product_id = $2`,
      [userId, productId]
    );

    if (rows.length > 0) {
      // Update quantity
      await pool.query(
        `UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3`,
        [parseInt(quantity), userId, productId]
      );
    } else {
      // Insert new cart item
      await pool.query(
        `INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)`,
        [userId, productId, quantity]
      );
    }

    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding to cart");
  }
};

// Remove product from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const productId = req.params.id;

    await pool.query(
      `DELETE FROM cart WHERE user_id = $1 AND product_id = $2`,
      [userId, productId]
    );

    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error removing from cart");
  }
};
