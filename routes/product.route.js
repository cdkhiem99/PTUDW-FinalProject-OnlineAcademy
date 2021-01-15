const express = require("express");
const courseModel = require("../models/course.model");
const subfieldModel = require("../models/subfield.model");
const feedbackModel = require("../models/feedback.model");
const sectionModel = require("../models/section.model");
const debug = require("debug")("routes:product");

const router = express.Router();

router.get("/", async function (req, res, next) {
  const list = await courseModel.all();
  res.render("vwProducts/index", {
    products: list,
    empty: list.length === 0,
  });

  const id = await subfieldModel.getBySubName(req.body.fieldsName);

  const listByFields = await courseModel.getAllCourseByField(id);
  res.render("vwProducts/byCats", {
    courseByField: listByFields,
    empty: listByFields.length === 0,
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
});
router.get("/courseBySubField/:subField", async function (req, res, next) {
  const id = await subfieldModel.getBySubName(req.params.subField);
  const listBySubFields = await courseModel.getAllCourseBySubField(
    parseInt(id.id)
  );
  res.locals.listBySubFields = listBySubFields;
  res.locals.empty = listBySubFields.length === 0;
  res.render("vwProducts/byCat");
});

router.get("/field/:Field", async function (req, res, next) {
  console.log(req.params.Field);
  const listByFields = await courseModel.getAllCourseByField(req.params.Field);
  res.locals.listByFields = listByFields;
  res.locals.empty = listByFields === 0;
  res.render("vwProducts/byFields");
});

router.get("/detail/:courseID", async function (req, res, next) {
  const course = await courseModel.getCourseByID(req.params.courseID);
  const feedbackList = await feedbackModel.getFeedBack(req.params.courseID);
  const previewVideo = await sectionModel.getPreviewVideo(req.params.courseID);
  const courseContent = await sectionModel.getCourseContent(
    req.params.courseID
  );
  // res.locals.course = course;
  // res.locals.empty = course === 0;
  // res.locals.feedbackList = feedbackList;
  // res.locals.feedbackempty = feedbackList === 0;
  // res.locals.previewVideo = previewVideo;
  // res.locals.noPreviewVideo = previewVideo === 0;
  // res.locals.courseContent = courseContent;
  // res.locals.courseContentempty = courseContent === 0;

  debug(previewVideo);

  res.render("vwProducts/detail", {
    course,
    feedbackList,
    previewVideo,
    courseContent,
  });
});

module.exports = router;
