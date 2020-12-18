const express = require("express");
const app = express();

require("./middlewares/logging.mdw")();
require("./middlewares/config.mdw")();
require("./middlewares/static.mdw")(app);
require("./middlewares/session.mdw")(app);
require("./middlewares/view.mdw")(app);
require("./middlewares/locals.mdw")(app);
require("./middlewares/routes.mdw")(app);
require("./middlewares/error.mdw")(app);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Server is running at 'http://localhost:${port}'`);
});
