const db = require('../utils/db');
const config = require('../config/default.json');

module.exports = {
  all: _ => db.load('select * from products'),
  single: id => db.load(`select * from products where ProID = ${id}`),
  allByCat: catId => db.load(`select * from products where CatID = ${catId}`),
  countByCat: async catId => {
    const rows = await db.load(`select count(*) as total from products where CatID = ${catId}`)
    return rows[0].total;
  },
  pageByCat: (catId, offset) => db.load(`select * from products where CatID = ${catId} limit ${config.pagination.limit} offset ${offset}`),
};
