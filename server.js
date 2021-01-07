const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/config")();
require("./startup/routes")(app);

const port = 25565;
app.listen(port, function () {
  console.log(`Server is running at 'http://localhost:${port}'`);
});
