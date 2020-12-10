const express = require("express");
const home = require("../routes/home.route");
const about = require("../routes/about.route");
const bs4 = require("../routes/bs4.route");
const categories = require("../routes/category.route");
const products = require("../routes/product.route");
const _account = require("../routes/_account.route");
const _product = require("../routes/_product.route");
const _demo = require("../routes/_demo.route");

module.exports = function (app) {
  app.use(express.json());
  // app.use(
  //   express.urlencoded({
  //     extended: true,
  //   })
  // );
  app.use("/", home);
  app.use("/about", about);
  app.use("/bs4", bs4);
  app.use("/admin/categories", categories);
  app.use("/admin/products", products);
  app.use("/account", _account);
  app.use("/products", _product);
  app.use("/demo", _demo);
};
