const express = require("express");
const router = express.Router();
const courseModel = require("../models/course.model");

router.get("/", async function (req, res) {
  const mostViewedCourses = await courseModel.get10mostView();
  res.render("home", {
    mostViewedCourses: mostViewedCourses,
  });
});

module.exports = router;
