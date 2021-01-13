const { del } = require('../utils/db');
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

    async del(id) {
        const condition = {
            id: id
        }

        const [result, fields] = await db.del(condition, 'lecturer');
        return result;
    },

    async patch(user) {
        const condition = {
           id: user.id
        }
        delete (user.id);

        const [result, fields] = await db.patch(user, condition, 'lecturer');
        return result;
    }
}