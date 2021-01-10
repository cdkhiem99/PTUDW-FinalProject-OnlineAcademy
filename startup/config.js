const config = require("config");

module.exports = function () {
  const env_var = "env-var";
  const FATAL_ERROR = `FATAL ERROR: '${env_var}' is not defined.`;
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: 'jwtPrivateKey' is not defined.");
  }
  if (!config.get("mysql_port")) {
    throw new Error(FATAL_ERROR.replace(env_var, "mysql.port"));
  }
  if (!config.get("mysql_password")) {
    throw new Error(FATAL_ERROR.replace(env_var, "mysql.password"));
  }
  if (!config.get("mysql_database")) {
    throw new Error(FATAL_ERROR.replace(env_var, "mysql.database"));
  }
};
