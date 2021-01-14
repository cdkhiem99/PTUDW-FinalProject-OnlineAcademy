const express = require("express");
const router = express.Router();
const courseModel = require("../models/course.model");
const debug = require("debug")("routes:home");

router.get("/", async function (req, res) {
  console.log(res.locals.authUser);
  const mostViewedCourses = await courseModel.get10mostView();
  const newViewedCourses = await courseModel.get10LatestCourse();
  const highlightedCourses = await courseModel.get4HighlightedCourse();
  res.render("home", {
    highlightedCourses: highlightedCourses,
    newViewedCourses: newViewedCourses,
    mostViewedCourses: mostViewedCourses
  })

  res.render("home", {
    popularCourses: popularCourses,
    mostViewedCourses: mostViewedCourses,
    newCourses: newCourses,
  });
});

module.exports = router;
