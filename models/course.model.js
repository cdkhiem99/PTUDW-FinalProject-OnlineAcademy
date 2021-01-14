const db = require("../utils/db");
const { paginate } = require("../config/default.json");
const debug = require("debug")("models:course");

module.exports = {
  async all() {
    const sql = "select * from course";
    const [rows, fields] = await db.load(sql);
    return rows;
  },

  async allByCat(id) {
    const sql = `select * from course where id=${id}`;
    const [rows, fields] = await db.load(sql);
    return rows;
  },

  async countByCat(id) {
    const sql = `select count(*) as total from course where id=${id}`;
    const [rows, fields] = await db.load(sql);
    return rows[0].total;
  },

  async pageByCat(id, offset) {
    const sql = `select * from course where id=${id} limit ${paginate.limit} offset ${offset}`;
    const [rows, fields] = await db.load(sql);
    return rows;
  },

  async single(id) {
    const sql = `select * from course where id=${id}`;
    const [rows, fields] = await db.load(sql);
    if (rows.length === 0) return null;

    return rows[0];
  },

  async get10mostView() {
    const sql = `select c.*
                  from course as c
                  order by c.view desc limit 10`;
    const [rows, fields] = await db.load(sql);
    if (rows.length === 0) {
      return null;
    }

    debug("Fields:\n", fields);
    debug(`rows.length: ${rows.length}`);
    debug(`rows[0]:\n`, rows[0]);

    return rows;
  },
};
