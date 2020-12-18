const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const mysql_opts = require("../utils/mysql_opts");

module.exports = function (app) {
  const sessionStore = new MySQLStore(mysql_opts);

  app.set("trust proxy", 1);
  app.use(
    session({
      secret: "SECRET_KEY",
      resave: false,
      saveUninitialized: true,
      store: sessionStore,
      cookie: {
        // secure: true
      },
    })
  );
};
