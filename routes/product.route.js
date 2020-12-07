const express = require('express');
const productModel = require('../models/product.model');

const router = express.Router();

router.get('/', async function (req, res) {
  const results = await productModel.all();
  res.render('vwProducts/index', {
    products: results,
    empty: results.length === 0
  })
})

module.exports = router;