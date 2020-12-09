const express = require("express");
const router = express.Router();

router.get("/bs4", function (req, res) {
  res.render("bs4", {
    layout: false,
  });
});

module.exports = router;
