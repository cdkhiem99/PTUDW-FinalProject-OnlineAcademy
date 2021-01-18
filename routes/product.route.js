const express = require("express");
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
  const list = await courseModel.getAllCourse();
  const listLecturersName = await lecturerModel.getAllLecturerName();
  const listFieldsName = await fieldsModel.getAllFieldName();
  res.render("vwProducts/index", {
    list: list,
    empty: list.length === 0,
    listLecturersName,
    listFieldsName,
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
  const listByFields = await courseModel.getAllCourseByField(req.params.Field);
  res.locals.listByFields = listByFields;

  res.locals.empty = listByFields === 0;
  res.render("vwProducts/byFields");
});

router.get("/:Field", async function (req, res, next) {
  const listByFields = await courseModel.getAllCourseByField(req.params.Field);
  res.locals.listByFields = listByFields;

  res.locals.empty = listByFields === 0;
  res.render("vwProducts/byFields");
});

router.get("/:lecturerName", async function (req, res, next) {
  console.log(req.params.lecturerName);
  const listByLecturerName = await courseModel.getAllCourseByLecturerName(req.params.lecturerName);
  res.locals.listByLecturerName = listByLecturerName;

  res.locals.empty = listByLecturerName === 0;
  res.render("vwProducts/byLect");
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

  res.render("vwProducts/detail", {
    course,
    feedbackList,
    courseContent,
    isEnrolled,
    isInWatchList,
    isFisnish
  });
});

router.get("/search", async function (req, res, next) {
  const fulltext = req.query.search;
  const searchResult = await courseModel.searchCourse(fulltext);

  res.render("vwProducts/search", {
    searchResult,
    empty: searchResult.length === 0,
  });
});

module.exports = router;
