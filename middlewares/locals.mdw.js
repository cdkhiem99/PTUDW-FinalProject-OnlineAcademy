const cartModel = require('../models/cart.model');
const categoryModel = require("../models/fields.model");

module.exports = function (app) {
  app.use(function (req, res, next) {
    if (typeof (req.session.auth) === 'undefined') {
      req.session.auth = false;
    }

    if (req.session.auth === false) {
      req.session.cart = [];
    }

    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    res.locals.cartSummary = cartModel.getNumberOfItems(req.session.cart);
    next();
  });

  app.use(async function (req, res, next) {
    res.locals.lcCategories = await categoryModel.allWithDetails();
    next();
  });
};
