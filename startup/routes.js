const express = require("express");

module.exports = function (app) {
  app.use(express.json());
  // app.use(
  //   express.urlencoded({
  //     extended: true,
  //   })
  // );
  require("../middlewares/static.mdw")(app);
  require("../middlewares/session.mdw")(app);
  require("../middlewares/view.mdw")(app);
  require("../middlewares/locals.mdw")(app);
  require("../middlewares/routes.mdw")(app);
  require("../middlewares/error.mdw")(app);
};
