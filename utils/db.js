const mysql = require("mysql2");
const mysql_opts = require("../utils/mysql_opts");
const debug = require("debug")("utils:db");

debug(mysql_opts);

const pool = mysql.createPool(mysql_opts);
const promisePool = pool.promise();

module.exports = {
  load(sql,condition = "") {
    return promisePool.query(sql, condition); // [rows, fields]
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
