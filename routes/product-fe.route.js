const express = require('express');
const courseModel = require('../models/course.model');
const { paginate } = require('../config/default.json');

const router = express.Router();

router.get('/byCat/:id', async function (req, res, next) {
  const catId = +req.params.id;

  for (c of res.locals.lcCategories) {
    if (c.CatID === catId) {
      c.IsActive = true;
      break;
    }
  }

  const page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await courseModel.countByCat(catId);
  let nPages = Math.floor(total / paginate.limit);
  if (total % paginate.limit > 0) nPages++;

  const page_numbers = [];
  for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page
    });
  }

  const offset = (page - 1) * paginate.limit;
  const list = await courseModel.pageByCat(catId, offset);

  res.render('vwProducts/byCat', {
    products: list,
    page_numbers,
    empty: list.length === 0
  });
})

router.get('/detail/:id', async function (req, res, next) {
  const proId = +req.params.id;
  const product = await courseModel.single(proId);
  if (product === null) {
    return res.redirect('/');
  }

  res.render('vwProducts/detail', {
    product
  });
})

module.exports = router;