const express = require("express");
const router = express.Router();

const courseModel = require("../models/course.model");
const feedbackModel = require("../models/feedback.model");
const sectionModel = require("../models/section.model");
const studentModel = require("../models/enroll.model");
const debug = require("debug")("routes:course");

router.get("/detail/:courseID", async function (req, res) {
  const course = await courseModel.getCourseByID(req.params.courseID);
  const feedbackList = await feedbackModel.getFeedBack(req.params.courseID);
  const courseContent = await sectionModel.getCourseContent(
    req.params.courseID
  );

  let isEnrolled = false;
  if (res.locals.auth && res.locals.authUser.role === "student") {
    isEnrolled = await studentModel.isEnroll(
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
  });
});

module.exports = router;
