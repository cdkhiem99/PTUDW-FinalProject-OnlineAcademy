const express = require("express");

module.exports = function (app) {
  app.use('resource/public', express.static("resource/public"));
};
