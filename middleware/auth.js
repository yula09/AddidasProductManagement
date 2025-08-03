// middleware/auth.js
const isAuthenticated = (req, res, next) => {
  if (req.session.user && req.session.user.is_verified) return next();
  res.redirect("/login");
};

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") return next();
  res.status(403).send("Access Denied: Admins only");
};

module.exports = { isAuthenticated, isAdmin };
