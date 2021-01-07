const db = require('../utils/db');

module.exports = {
    async singleByLecturerID(id) {
        const sql = `select * from lecturer where id = ${id}`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
          return null;
    
        return rows[0];
      },
    
    async add(user) {
        const [result, fields] = await db.add(user, 'lecturer');
        return result;
    },
}