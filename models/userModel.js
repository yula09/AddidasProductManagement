// models/userModel.js
const pool = require("../config/db");

const findUserByEmail = async (email) => {
  const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0];
};

const createUser = async (name, email, password, role = "customer") => {
  const res = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, email, password, role]
  );
  return res.rows[0];
};

const verifyUser = async (email) => {
  await pool.query("UPDATE users SET is_verified = true WHERE email = $1", [email]);
};

module.exports = { findUserByEmail, createUser, verifyUser };
