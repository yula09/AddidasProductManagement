const pool = require('../config/db');

async function createProduct(name, description, price) {
  const result = await pool.query(
    'INSERT INTO products (name, description, price) VALUES ($1, $2, $3)',
    [name, description, price]
  );
  return result;
}

async function getAllProducts() {
  const { rows } = await pool.query('SELECT * FROM products');
  return rows;
}

async function getProductById(id) {
  const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return rows[0];
}

async function updateProduct(id, name, description, price) {
  await pool.query(
    'UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4',
    [name, description, price, id]
  );
}

async function deleteProduct(id) {
  await pool.query('DELETE FROM products WHERE id = $1', [id]);
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
