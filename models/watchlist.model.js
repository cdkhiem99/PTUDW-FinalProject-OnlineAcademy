const db = require('../utils/db');

module.exports = {
  async addToWL(studentId, courseId){
    try {
      const newData = {
        studentId: studentId,
        courseId: courseId
      }

      await db.add(newData, 'watchList');
      return true;
    } catch(e){
      return e.messege;
    }
  },

  async isInWatchList(studentId, courseId){
    const sql = `select * from watchList where studentId=? and courseId=?`;
    const condition = [studentId, parseInt(courseId)];
    const [rows, fields] = await db.load(sql, condition);
    return (rows.length !== 0);
  },

  async takeAllFromWL(studentId){
    const sql = `select c.* from watchList as wl join course as c on wl.courseId=c.id where wl.studentId=?`;
    const condition = [studentId];
    const [rows, fields] = await db.load(sql, condition);

    if (rows.length === 0){
      return null;
    }

    return rows;
  },

  async deleteInWatchList(studentId, courseId) {
    try{
      const sql = 'delete from watchList where courseId = ? and studentId = ?'
      const condition = [parseInt(courseId),studentId];
      const [result, fields] = await db.load(sql, condition);
      return true;
    } catch(e){
      return e.messege;
    }
  }
};
