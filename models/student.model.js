const db = require('../utils/db');

module.exports = {
  async single(id) {
    const sql = `select * from student where id = ${id}`;
    const [rows, fields] = await db.load(sql);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  async singleByUserName(id) {
    console.log(id);
    const sql = `select * from student where id = ${id}`;
    const [rows, fields] = await db.load(sql);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  async add(user) {
    const [result, fields] = await db.add(user, 'student');
    return result;
  },
};
