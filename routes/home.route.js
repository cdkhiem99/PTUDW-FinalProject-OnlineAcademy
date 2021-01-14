const express = require("express");
const router = express.Router();
const courseModel = require("../models/course.model");

router.get("/", async function (req, res) {
  const mostViewedCourses = await courseModel.get10mostView();
  res.render("home", {
    mostViewedCourses: mostViewedCourses,
  });

  const newViewedCourses = await courseModel.get10LatestCourse();
  res.render("home", {
    newViewedCourses: newViewedCourses,
  })

  const highlightedCourses = await courseModel.get4HighlightedCourse();
  res.render("home", {
    highlightedCourses: highlightedCourses,
  })

});

module.exports = router;