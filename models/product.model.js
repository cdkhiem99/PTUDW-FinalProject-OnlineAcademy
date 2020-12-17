const db = require('../utils/db');
const { paginate } = require('./../config/default.json');

module.exports = {
  async all() {
    const sql = 'select * from products';
    const [rows, fields] = await db.load(sql);
    return rows;
  },

  async allByCat(catId) {
    const sql = `select * from products where CatID=${catId}`;
    const [rows, fields] = await db.load(sql);
    return rows;
  },

  async countByCat(catId) {
    const sql = `select count(*) as total from products where CatID=${catId}`;
    const [rows, fields] = await db.load(sql);
    return rows[0].total;
  },

  async pageByCat(catId, offset) {
    const sql = `select * from products where CatID=${catId} limit ${paginate.limit} offset ${offset}`;
    const [rows, fields] = await db.load(sql);
    return rows;
  },

  async single(id) {
    const sql = `select * from products where ProID=${id}`;
    const [rows, fields] = await db.load(sql);
    if (rows.length === 0)
      return null;

    return rows[0];
  },
};
