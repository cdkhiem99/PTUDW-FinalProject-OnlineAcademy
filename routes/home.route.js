const express = require("express");
const router = express.Router();
const courseModel = require("../models/course.model");
const debug = require("debug")("routes:home");

router.get("/", async function (req, res) {
  const popularCourses = await courseModel.get4HighlightedCourse();
  const mostViewedCourses = await courseModel.get10mostView();
  const newCourses = await courseModel.get10LatestCourse();

  debug("popularCourses", popularCourses[0]);
  debug("mostViewedCourses", mostViewedCourses[0]);
  debug("newCourses", newCourses[0]);

  res.render("home2", {
    popularCourses: popularCourses,
    mostViewedCourses: mostViewedCourses,
    newCourses: newCourses,
  });
});

module.exports = router;
