const express = require("express");
const app = express();

// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

// app.use("/public", express.static("public"));

// require("./middlewares/session.mdw")(app);
// require("./middlewares/view.mdw")(app);
// require("./middlewares/locals.mdw")(app);

// require("./middlewares/routes.mdw")(app);
// require("./middlewares/error.mdw")(app);

require("./startup/logging")();
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/database")();
require("./startup/validation")();

app.listen(process.env.PORT || 3000, function () {
  console.log(`Server is running at http://localhost:${PORT}`);
});
