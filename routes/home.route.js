const express = require("express");
const router = express.Router();
const courseModel = require("../models/course.model");
const enrollModel = require("../models/enroll.model");
const fieldsModel = require("../models/fields.model");
const debug = require("debug")("routes:home");

router.get("/", async function (req, res) {
  const popularCourses = await enrollModel.getBestSeller();
  const mostViewedCourses = await courseModel.get10mostView();
  const newViewedCourses = await courseModel.get10LatestCourse();
  const highlightedCourses = await courseModel.get4HighlightedCourse();
  const mostPopularField = await fieldsModel.mostPopularField();

  debug("popular:", popularCourses[0]);
  debug("mostViewed", mostViewedCourses[0]);
  debug("brand-new:", newViewedCourses[0]);
  debug("highlight:", highlightedCourses[0]);

  res.render("home", {
    popularCourses,
    mostViewedCourses,
    newViewedCourses,
    highlightedCourses,
    mostPopularField,
  });
});

module.exports = router;
