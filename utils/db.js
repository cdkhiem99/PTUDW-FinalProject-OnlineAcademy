const mysql = require("mysql2");
const mysql_opts = require("../config/default.json").mysql;
const config = require("config");
const debug = require("debug")("utils:db");

mysql_opts.host = config.get("mysql_host") || "localhost";
mysql_opts.port = config.get("mysql_port");
mysql_opts.user = config.get("mysql_user") || "root";
mysql_opts.password = config.get("mysql_password");
mysql_opts.database = config.get("mysql_database");

debug(mysql_opts);

const pool = mysql.createPool(mysql_opts);
const promisePool = pool.promise();

module.exports = {
  load(sql) {
    return promisePool.query(sql); // [rows, fields]
  },

  add(entity, table_name) {
    const sql = `insert into ${table_name} set ?`;
    return promisePool.query(sql, entity);
  },

  del(condition, table_name) {
    const sql = `delete from ${table_name} where ?`;
    return promisePool.query(sql, condition);
  },

  patch(new_data, condition, table_name) {
    const sql = `update ${table_name} set ? where ?`;
    return promisePool.query(sql, [new_data, condition]);
  },
};
