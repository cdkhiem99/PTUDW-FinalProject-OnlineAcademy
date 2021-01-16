const express = require("express");

module.exports = function (app) {
  app.use(express.static("public"));
  app.use('/resource/public', express.static('resource/public'));
  app.use('/resource/private', express.static('resource/private'));
};

