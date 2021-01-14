const db = require('../utils/db');

module.exports = {
  async add(order) {
    const [result, fields] = await db.add(order, 'enroll');
    return result;
  },

  async getAllEnroll(id) {
    const sql = `select * from enroll where studentId = ?`;
    const condition = [id];
    const [rows, fields] = await db.load(sql, condition);

    if (rows.length === 0) {
      return null;
    }

    return rows;
  }
};
