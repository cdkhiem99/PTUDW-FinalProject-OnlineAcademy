const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.render("bs4", {
    layout: false,
  });
});

module.exports = router;
