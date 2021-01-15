const db = require('../utils/db');
const bcrypt = require("bcryptjs");

module.exports = {
  async singleByUserName(id) {
    const sql = `select *,'student' as role from student where id = ?`;
    const condition = [id];
    const [rows, fields] = await db.load(sql, condition);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  async singleByEmail(email){
    const sql = `select * from student where email = ?`;
    const condition = [email];
    const [rows, fields] = await db.load(sql, condition);
    if (rows.length === 0)
      return false;

    return true;
  },

  async add(user) {
    const [result, fields] = await db.add(user, 'student');
    return result;
  },

  async del(id) {
      const condition = {
          id: id
      }

      const [result, fields] = await db.del(condition, 'student');
      return result;
  },

  async patch(user,id) {
    try {
      const hash = bcrypt.hashSync(user.password, 10);
      const newUser = {
        name: user.name,
        phone_number: user.phone,
        email: user.email,
        password: hash
      }
      const condition = {
        id: id
      }
      const [result, fields] = await db.patch(newUser, condition, 'student');

    } catch (error) {
      return error.message;
    }
    return true;
  }
};
