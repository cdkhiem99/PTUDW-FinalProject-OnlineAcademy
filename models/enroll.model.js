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
  },

  async getBestSeller() {
    const sql = `select courseId, count(studentId) as NumberOfStudents
                from enroll
                group by courseId
                order by NumberOfStudents desc limit 10`;

    const [result, fields] = await db.load(sql);
    
    if (result.length === 0) {
      return null;
    }

    return result;
  }
};
