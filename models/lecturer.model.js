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
    }
}