const express = require("express");
const home = require("../routes/home.route");
const about = require("../routes/about.route");
const bs4 = require("../routes/bs4.route");
const categories = require("../routes/category.route");
const products = require("../routes/product.route");
const account = require("../routes/account.route");
const product_fe = require("../routes/product-fe.route");
const _demo = require("../routes/_demo.route");

module.exports = function (app) {
  app.use("/", home);
  app.use("/about", about);

  app.use("/bs4", bs4);

  app.use("/account", account);
  app.use("/products", product_fe);

  app.use("/admin/categories", categories);
  app.use("/admin/products", products);

  app.use("/demo", _demo);
};
