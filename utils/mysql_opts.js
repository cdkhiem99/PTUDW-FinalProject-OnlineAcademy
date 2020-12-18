const { mysql } = require("../config/default.json");
const config = require("config");

mysql.host = config.get("mysql_host") || "localhost";
mysql.port = config.get("mysql_port");
mysql.user = config.get("mysql_user") || "root";
mysql.password = config.get("mysql_password");
mysql.database = config.get("mysql_database");

module.exports = mysql;
