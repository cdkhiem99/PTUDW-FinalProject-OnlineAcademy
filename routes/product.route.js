const { response } = require('express');
const express = require('express');
const productModel = require('../models/course.model');
const fieldModel = require('../models/subfield.model');

const router = express.Router();

router.get('/', async function (req, res, next) {
  const list = await productModel.all();
  res.render('vwProducts/index', {
    products: list,
    empty: list.length === 0
  });

  const id = await fieldModel.getBySubName(req.body.fieldsName);

  const listByFields = await productModel.getAllCourseByField(id);
  res.render('vwProducts/byCats', {
    courseByField: listByFields,
    empty: listByFields.length === 0
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
router.get('/courseBySubField/:subField', async function (req, res, next) {
  const id = await fieldModel.getBySubName(req.params.subField);
  const listByFields = await productModel.getAllCourseByField(parseInt(id.id));
  res.locals.listByFields = listByFields;
  res.locals.empty = listByFields.length === 0;
  res.render('vwProducts/byCat');
})
module.exports = router;