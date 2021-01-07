const db = require('../utils/db');

// const list = [
//   { fieldsID: 1, name: 'Laptop' },
//   { fieldsID: 2, name: 'Phone' },
//   { fieldsID: 3, name: 'Quần áo' },
//   { fieldsID: 4, name: 'Giày dép' },
//   { fieldsID: 5, name: 'Trang sức' },
//   { fieldsID: 6, name: 'Khác' },
// ];

module.exports = {
  async all() {
    const sql = 'select * from fields';
    const [rows, fields] = await db.load(sql);
    return rows;
  },

  async allWithDetails() {
    const sql = `
      select c.*, count(p.fieldsID) as ProductCount, 0 as IsActive
      from fields c left join course p on c.id = p.fieldsID
      group by c.id, c.name
    `;
    const [rows, fields] = await db.load(sql);
    return rows;
  },

  async single(id) {
    const sql = `select * from fields where id = ${id}`;
    const [rows, fields] = await db.load(sql);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  async add(category) {
    const [result, fields] = await db.add(category, 'fields');
    // console.log(result);
    return result;
  },

  async del(id) {
    const condition = {
      fieldsID: id
    };
    const [result, fields] = await db.del(condition, 'fields');
    return result;
  },

  async patch(entity) {
    const condition = {
      fieldsID: entity.fieldsID
    };
    delete (entity.fieldsID);

    const [result, fields] = await db.patch(entity, condition, 'fields');
    return result;
  }
};
