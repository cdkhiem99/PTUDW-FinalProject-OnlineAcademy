const { response } = require('express');
const express = require('express');
const productModel = require('../models/course.model');
const fieldModel = require('../models/subfield.model');
const feedbackModel = require('../models/feedback.model');

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
  const listBySubFields = await productModel.getAllCourseBySubField(parseInt(id.id));
  res.locals.listBySubFields = listBySubFields;
  res.locals.empty = listBySubFields.length === 0;
  res.render('vwProducts/byCat');
})

router.get('/field/:Field', async function (req, res, next) {
  console.log(req.params.Field);
  const listByFields = await productModel.getAllCourseByField(req.params.Field);
  res.locals.listByFields = listByFields;
  res.locals.empty = listByFields === 0;
  res.render('vwProducts/byFields');
})

router.get('/detail/:courseID', async function(req, res, next) {
  const course = await productModel.getCourseByID(req.params.courseID);
  const feedbackList = await feedbackModel.getFeedBack(req.params.courseID);
  res.locals.course = course;
  res.locals.empty = course === 0;
  
  res.locals.feedbackList = feedbackList;
  res.locals.feedbackempty = feedbackList === 0;
  res.render('vwProducts/detail');
})

module.exports = router;