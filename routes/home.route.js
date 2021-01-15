const express = require("express");
const router = express.Router();
const courseModel = require("../models/course.model");
const enrollModel = require("../models/enroll.model");
const debug = require("debug")("routes:home");

router.get("/", async function (req, res) {
  console.log(res.locals.authUser);
  const mostViewedCourses = await courseModel.get10mostView();
  const newViewedCourses = await courseModel.get10LatestCourse();
  const highlightedCourses = await courseModel.get4HighlightedCourse();
  const popularCourses = await enrollModel.getBestSeller();

  debug(mostViewedCourses[0]);
  debug(newViewedCourses[0]);
  debug(highlightedCourses[0]);
  debug(popularCourses[0]);

  res.render("home", {
    highlightedCourses: highlightedCourses,
    newViewedCourses: newViewedCourses,
    mostViewedCourses: mostViewedCourses,
    popularCourses: popularCourses,
  });
});

module.exports = router;
