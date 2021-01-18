const express = require("express");
const router = express.Router();

const courseModel = require("../models/course.model");
const feedbackModel = require("../models/feedback.model");
const sectionModel = require("../models/section.model");
const studentModel = require("../models/enroll.model");
const watchL = require("../models/watchlist.model");
const debug = require("debug")("routes:course");

router.get("/detail/:courseID", async function (req, res) {
  const course = await courseModel.getCourseByID(req.params.courseID);

  const feedbackList = await feedbackModel.getFeedBack(req.params.courseID);

  let courseContent;
  let isFisnish;
  if (res.locals.auth === false) {
    courseContent = await sectionModel.getCourseContent(req.params.courseID);
  } else {
    courseContent = await sectionModel.getCourseContentWithProcess(
      req.params.courseID,
      res.locals.authUser.id
    );

    let count = 0;
    for (const key in courseContent) {
      if (Object.hasOwnProperty.call(courseContent, key)) {
        const element = courseContent[key];
        if (element.isComplete === true) {
          count += 1;
        }
      }
    }

    if (count === courseContent.length) {
      isFisnish = true;
    } else {
      isFisnish = false;
    }
  }

  let panelID = 2;
  let paneltitleID = 3;
  for (const section_ of courseContent) {
    section_.panelID = panelID;
    section_.paneltitleID = paneltitleID;

    panelID += 4;
    paneltitleID += 4;
  }

  debug(courseContent);

  let isEnrolled = false;
  if (res.locals.auth && res.locals.authUser.role === "student") {
    isEnrolled = await studentModel.isEnroll(
      res.locals.authUser.id,
      course.CourseID
    );
  }

  let isInWatchList = false;
  if (res.locals.auth && res.locals.authUser.role === "student") {
    isInWatchList = await watchL.isInWatchList(
      res.locals.authUser.id,
      course.CourseID
    );
  }

  let firstPreview = "javascript:;";
  for (const section of courseContent) {
    if (section.preview) {
      firstPreview = section.preview;
      debug("firstPreview: ", firstPreview);
      break;
    }
  }
  course.CourseIntro = firstPreview;

  res.render("vwCourses/details2", {
    course,
    feedbackList,
    courseContent,
    isEnrolled,
    isInWatchList,
    isFisnish,
  });
});

module.exports = router;
