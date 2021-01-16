const { exceptions } = require("winston");
const db = require("../utils/db");

module.exports = {
  async enrollCourse(studentId, courseId, date){
    try{
      const newData = {
        studentId: studentId,
        courseId: courseId,
        date: date
      }

      await db.add(newData, 'enroll');
      return true;

    } catch(e){
      return e.messege;
    }
  },

  async isEnroll(studentId, courseId){
    const sql = `select * from enroll where studentId=? and courseId=?`;
    const condition = [studentId, parseInt(courseId)];
    const [rows, fields] = await db.load(sql, condition);
    return (rows.length !== 0);
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
  },
};
