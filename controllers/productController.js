const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../models/productModel");

exports.dashboard = async (req, res) => {
  const products = await getAllProducts();
  if (req.session.user.role === "admin") {
    res.render("admin", { user: req.session.user, products });
  } else {
    res.render("products", { user: req.session.user, products });
  }
};

exports.showProducts = async (req, res) => {
  const products = await getAllProducts();
  res.render("products", { user: req.session.user, products });
};

exports.manageProducts = async (req, res) => {
  const products = await getAllProducts();
  res.render("admin", { user: req.session.user, products });
};

exports.renderAddProduct = (req, res) => {
  res.render("addProduct");
};

exports.addProduct = async (req, res) => {
  const { name, description, price } = req.body;
  await createProduct(name, description, price);
  res.redirect("/product/manage");  // <-- use /product here
};

exports.renderEditProduct = async (req, res) => {
  const product = await getProductById(req.params.id);
  res.render("editProduct", { product });
};

exports.updateProduct = async (req, res) => {
  const { name, description, price } = req.body;
  await updateProduct(req.params.id, name, description, price);
  res.redirect("/product/manage");  // <-- use /product here
};

exports.deleteProduct = async (req, res) => {
  await deleteProduct(req.params.id);
  res.redirect("/product/manage");  // <-- use /product here
};
