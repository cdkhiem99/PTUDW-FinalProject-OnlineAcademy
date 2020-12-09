const express = require('express');
const productModel = require('../models/product.model');

const router = express.Router();

router.get('/', async function (req, res, next) {
  const list = await productModel.all();
  res.render('vwProducts/index', {
    products: list,
    empty: list.length === 0
  });
  // try {
  //   const list = await productModel.all();
  //   res.render('vwProducts/index', {
  //     products: list,
  //     empty: list.length === 0
  //   });
  // } catch (err) {
  //   next(err);
  //   // console.error(err);
  //   // res.send('err');
  // }
})

module.exports = router;