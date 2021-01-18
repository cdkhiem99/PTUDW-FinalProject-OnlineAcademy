const express = require("express");
const { paginate } = require('../config/default.json');
const courseModel = require("../models/course.model");
const subfieldModel = require("../models/subfield.model");
const feedbackModel = require("../models/feedback.model");
const sectionModel = require("../models/section.model");
const debug = require("debug")("routes:product");
const studentModel = require("../models/enroll.model");
const watchL = require("../models/watchlist.model");
const lecturerModel = require("../models/lecturer.model");
const fieldModel = require("../models/fields.model");
const fieldsModel = require("../models/fields.model");

const router = express.Router();

// router.get("/", async function (req, res, next) {
//   const list = await courseModel.all();
//   res.render("vwProducts/index", {
//     products: list,
//     empty: list.length === 0,
//   });

//   const id = await subfieldModel.getBySubName(req.body.fieldsName);

//   const listByFields = await courseModel.getAllCourseByField(id);
//   res.render("vwProducts/byCats", {
//     courseByField: listByFields,
//     empty: listByFields.length === 0,
//   });

//   // try {
//   //   const list = await productModel.all();
//   //   res.render('vwProducts/index', {
//   //     products: list,
//   //     empty: list.length === 0
//   //   });
//   // } catch (err) {
//   //   next(err);
//   //   // console.error(err);
//   //   // res.send('err');
//   // }
// });

router.get("/", async function (req, res) {
  const listLecturersName = await lecturerModel.getAllLecturerName();
  const listFieldsName = await fieldsModel.getAllFieldName();

  const page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await courseModel.countCourse();
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
  const list = await courseModel.getAllCourse(offset);

  res.render("vwProducts/index", {
    list: list,
    empty: list.length === 0,
    listLecturersName,
    listFieldsName,
    page_numbers
  })
});

router.get("/courseBySubField/:subField", async function (req, res, next) {
  const id = await subfieldModel.getBySubName(req.params.subField);

  if (id === null){
    res.redirect("/");
    return;
  }

  const listBySubFields = await courseModel.getAllCourseBySubField(
    parseInt(id.id)
  );
  res.locals.listBySubFields = listBySubFields;
  res.locals.empty = listBySubFields.length === 0;
  res.render("vwProducts/byCat");
});

router.get("/field/:Field", async function (req, res, next) {
  const page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await courseModel.countCourseByField(req.params.Field);
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
  const listByFields = await courseModel.getAllCourseByField(req.params.Field, offset);
  res.locals.listByFields = listByFields;
  res.locals.page_numbers = page_numbers;
  res.locals.empty = listByFields === 0;
  res.render("vwProducts/byFields");
});

router.get("/detail/:courseID", async function (req, res, next) {
  const course = await courseModel.getCourseByID(req.params.courseID);
  
  const feedbackList = await feedbackModel.getFeedBack(req.params.courseID);

  var courseContent;
  var isFisnish;
  if(res.locals.auth===false){
    courseContent = await sectionModel.getCourseContent(
      req.params.courseID
    );
  } else{
    courseContent = await sectionModel.getCourseContentWithProcess(
      req.params.courseID,res.locals.authUser.id
    );

    var count=0;
    for (const key in courseContent) {
      if (Object.hasOwnProperty.call(courseContent, key)) {
        const element = courseContent[key];
        if (element.isComplete===true){
          count+=1;
        }
      }
    }

    if(count===courseContent.length){
      isFisnish=true;
    }
    else{
      isFisnish=false;
    }
  }


  let isEnrolled = false;
  if(res.locals.auth && res.locals.authUser.role === 'student'){
    isEnrolled = await studentModel.isEnroll(res.locals.authUser.id, course.CourseID);
  }

  let isInWatchList = false;
  if(res.locals.auth && res.locals.authUser.role === 'student'){
    isInWatchList = await watchL.isInWatchList(res.locals.authUser.id, course.CourseID);
  }

  // res.locals.course = course;
  // res.locals.empty = course === 0;
  // res.locals.feedbackList = feedbackList;
  // res.locals.feedbackempty = feedbackList === 0;
  // res.locals.previewVideo = previewVideo;
  // res.locals.noPreviewVideo = previewVideo === 0;
  // res.locals.courseContent = courseContent;
  // res.locals.courseContentempty = courseContent === 0;

  console.log(res.locals.authUser);
  res.render("vwProducts/detail", {
    course,
    feedbackList,
    courseContent,
    isEnrolled,
    isInWatchList,
    isFisnish
  });
});

router.get("/search/:searchStr", async function (req, res, next) {
  console.log(req.params.searchStr);
  const fulltext = req.params.searchStr;

  const page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await courseModel.countCourseBySearch(fulltext);
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
  const searchResult = await courseModel.searchCourse(fulltext, offset);
  const highlightedCourses = await courseModel.get4HighlightedCourse();

  res.render("vwProducts/search", {
    searchResult,
    page_numbers,
    highlightedCourses,
    empty: searchResult.length === 0,
  });
});

module.exports = router;
