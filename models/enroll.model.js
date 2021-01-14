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
    const sql = `select c.*, count(studentId) as NumberOfStudents
                from enroll as er
                join course as c on er.courseId = c.id
                join lecturer as lt on c.lecturerId = lt.id
                group by courseId
                order by NumberOfStudents desc limit 5`;

    const [result, fields] = await db.load(sql);
    
    if (result.length === 0) {
      return null;
    }

    return result;
  }
};
