const db = require('../utils/db');

module.exports = {
  async single(id) {
    const sql = `select * from users where id = ${id}`;
    const [rows, fields] = await db.load(sql);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  async singleByUserName(username) {
    const sql = `select * from users where username = '${username}'`;
    const [rows, fields] = await db.load(sql);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  async add(user) {
    const [result, fields] = await db.add(user, 'users');
    return result;
  },
};
