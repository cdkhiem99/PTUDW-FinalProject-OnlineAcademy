const { del } = require('../utils/db');
const db = require('../utils/db');

module.exports = {
    async singleAdmin(id) {
        const sql = `select *, 'admin' as role from admin where id = ?`;
        const condition = [id];
        const [rows, fields] = await db.load(sql, condition);
        
        if (rows.length === 0)
          return null;
    
        return rows[0];
      }
}