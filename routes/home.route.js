const express = require("express");
const router = express.Router();
const courseModel = require("../models/course.model");

router.get("/", async function (req, res) {
  const mostViewedCourses = await courseModel.get10mostView();
  const newViewedCourses = await courseModel.get10LatestCourse();
  const highlightedCourses = await courseModel.get4HighlightedCourse();
  
  res.render("home", {
    highlightedCourses: highlightedCourses,
    newViewedCourses: newViewedCourses,
    mostViewedCourses: mostViewedCourses
  })

});

module.exports = router;