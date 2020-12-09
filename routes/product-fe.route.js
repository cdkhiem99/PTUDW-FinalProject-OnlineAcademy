const express = require('express');
const productModel = require('../models/product.model');

const router = express.Router();

router.get('/byCat/:id', async function (req, res, next) {
  const catId = +req.params.id;

  for (c of res.locals.lcCategories) {
    if (c.CatID === catId) {
      c.IsActive = true;
      break;
    }
  }

  const list = await productModel.allByCat(catId);
  res.render('vwProducts/byCat', {
    products: list,
    empty: list.length === 0
  });
})

router.get('/detail/:id', async function (req, res, next) {
  const proId = +req.params.id;
  const product = await productModel.single(proId);
  if (product === null) {
    return res.redirect('/');
  }

  res.render('vwProducts/detail', {
    product
  });
})

module.exports = router;