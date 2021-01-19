const { del } = require('../utils/db');
const db = require('../utils/db');

module.exports = {
    async singleByLecturerID(id) {
        const sql = `select *, 'lecturer' as role from lecturer where id = ?`;
        const condition = [id];
        const [rows, fields] = await db.load(sql, condition);
        
        if (rows.length === 0)
          return null;
    
        return rows[0];
    },

    async checkIdExist(id){
      const sql = `select * from lecturer where id = ?`;
      const condition = [id];
      const [rows, fields] = await db.load(sql, condition);
      
      if (rows.length === 0)
        return true;
  
      return false;
    },

    async singleEmailByID(email){
      const sql = `select id from lecturer where email = ?`;
      const condition = [email];
      const [rows, fields] = await db.load(sql, condition);
      
      if (rows.length === 0)
        return true;
  
      return false;
    },

    async allCourseByID(id){
      const sql = `select *
                    from lecturer as l join course as c on l.id=c.lecturerId
                    where id=?`;
      const condition = [id];
      const [rows, fields] = await db.load(sql, condition);

      if (rows.length === 0)
          return null;
    
      return rows;
    },
    
    async add(user) {
        const [result, fields] = await db.add(user, 'lecturer');
        return result;
    },

    async del(id) {
        const condition = {
            id: id
        }

        const [result, fields] = await db.del(condition, 'lecturer');
        return result;
    },

    async patch(user) {
        try {
            const hash = bcrypt.hashSync(user.password, 10);
            const newUser = {
              name: user.name,
              phone_number: user.phone,
              gender: user.gender,
              university: user.university,
              email: user.email,
              password: hash
            }
            const condition = {
              id: id
            }
            const [result, fields] = await db.patch(newUser, condition, 'lecturer');
      
          } catch (error) {
            return error.message;
          }
          return true;
    },

    async getAllLecturer() {
      const sql = `select * from lecturer`;
      const [rows, fields] = await db.load(sql);
      if (rows.length === 0) {
        return null;
      }
      return rows;
    },

    async blockLecturer(id){
      try {
        const sql = `update lecturer set block=true where id = ?`;
        const condition = [id];
        const [result, fields] = await db.load(sql, condition);
        console.log(result);
        return true;
      } catch (error) {
        return error.message;
      }
    },

    async unblockLecturer(id){
      try {
        const sql = `update lecturer set block=false where id = ?`;
        const condition = [id];
        const [result, fields] = await db.load(sql, condition);
        console.log(result);
        return true;
      } catch (error) {
        return error.message;
      }
    },

    async getAllLecturerName() {
      const sql = `select name from lecturer`;
      const [rows, fields] = await db.load(sql);

      if (rows.length === 0) {
        return null;
      }

      return rows;
    },

    async getCourseOfLecturer(id){
      const sql = `select c.title as CourseName, c.id as CourseID
                    from lecturer as l join course as c on l.id=c.lecturerId
                    where l.id=?`;
      const condition = [id];
      const [rows, fields] = await db.load(sql, condition);

      const listByFields = [];

      if (rows.length !== 0) {
        for (let index = 0; index < rows.length; index++) {
          const element = rows[index];
          listByFields.push({
            id: element.CourseID,
            title: element.CourseName
          });
        }
      }
      return listByFields;
    },

    async AddCourse(newCourse, lecturerId, courseId, sfId, date){
      try {
        const newData = {
            subFieldId: sfId,
            title: newCourse.courseName,
            lecturerId: lecturerId,
            description: newCourse.description,
            briefDescription: newCourse.shortDescription,
            price: newCourse.price,
            status: newCourse.status,
            imagePath: `/resource/public/course/${courseId}/photo.png`,
            date: date
        }

        console.log(newData);
        const [result, fields] = await db.add(newData, 'course');
        console.log(result);
        
    } catch (e) {
        return e;
    }
    return null;
    }
}