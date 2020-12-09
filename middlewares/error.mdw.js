module.exports = function (app) {
  // 404: Not Found
  app.use(function (req, res) {
    res.render("404", {
      layout: false,
    });
  });

  // 500: Internal Server Error
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.render("500", {
      layout: false,
    });
  });
};
