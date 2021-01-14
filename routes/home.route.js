const express = require("express");
const router = express.Router();
const courseModel = require("../models/course.model");

router.get("/", async function (req, res) {
  console.log("1");
  const mostViewedCourses = await courseModel.get10mostView();
  console.log("2");
  const newViewedCourses = await courseModel.get10LatestCourse();
  console.log("3");
  const highlightedCourses = await courseModel.get4HighlightedCourse();
  console.log("4");
  res.render("home", {
    highlightedCourses: highlightedCourses,
    newViewedCourses: newViewedCourses,
    mostViewedCourses: mostViewedCourses
  })

});

module.exports = router;