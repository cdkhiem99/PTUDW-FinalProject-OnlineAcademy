const express = require("express");

module.exports = function (app) {
  app.use(express.static("public"));
  app.use(express.static("resource/public"));
};
