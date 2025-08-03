require("dotenv").config();
const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const path = require("path");
const app = express();
const pool = require("./config/db");

// View engine setup
app.set("view engine", "ejs");

// Middleware to parse urlencoded form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Session setup with Postgres session store
app.use(
  session({
    store: new pgSession({ pool }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// ✅ Middleware to make `user` available in all EJS views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Import routes
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const indexRoutes = require("./routes/indexRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Mount routes
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/product", productRoutes);  // singular
app.use("/", dashboardRoutes);

// Start server
app.listen(process.env.PORT, () =>
  console.log(`Server running at http://localhost:${process.env.PORT}`)
);
