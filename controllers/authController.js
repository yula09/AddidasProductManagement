const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { findUserByEmail, createUser, verifyUser } = require("../models/userModel");

exports.showSignup = (req, res) => res.render("signup");
exports.showLogin = (req, res) => res.render("login");

exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  const existingUser = await findUserByEmail(email);
  if (existingUser) return res.send("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(name, email, hashedPassword, role);

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  const verifyLink = `${process.env.BASE_URL}/verify?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Adidas Auth" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Verify Your Email",
    html: `<p>Click <a href='${verifyLink}'>here</a> to verify your email</p>`,
  });

  res.send("Verification email sent. Check your inbox.");
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    await verifyUser(email);
    res.send("Email verified successfully. You can now log in.");
  } catch (err) {
    res.send("Invalid or expired token");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user || !user.is_verified) return res.send("Invalid credentials or email not verified");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.send("Incorrect password");

  req.session.user = user;
  res.redirect("/dashboard");  // <-- Redirect to dashboard on login success
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
