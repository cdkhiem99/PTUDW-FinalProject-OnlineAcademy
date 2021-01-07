const db = require('../utils/db');
const { paginate } = require('../config/default.json');

module.exports = {
  async all() {
    const sql = 'select * from course';
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
    const sql = `select * from course where ProID=${id}`;
    const [rows, fields] = await db.load(sql);
    if (rows.length === 0)
      return null;

    return rows[0];
  },
};
