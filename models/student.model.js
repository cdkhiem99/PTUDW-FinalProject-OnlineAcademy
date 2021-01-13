const db = require('../utils/db');

module.exports = {
  async singleByUserName(id) {
    const sql = `select * from student where id = ?`;
    const condition = [id];
    const [rows, fields] = await db.load(sql, condition);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  async add(user) {
    const [result, fields] = await db.add(user, 'student');
    return result;
  },

  async del(id) {
      const condition = {
          id: id
      }

      const [result, fields] = await db.del(condition, 'student');
      return result;
  },

  async patch(user) {
      const condition = {
        id: user.id
      }
      delete (user.id);

      const [result, fields] = await db.patch(user, condition, 'student');
      return result;
  }
};
