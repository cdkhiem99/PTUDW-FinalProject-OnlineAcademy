const db = require('../utils/db');

module.exports = {
  async all() {
    const sql = 'select * from subField';
    const [rows, fields] = await db.load(sql);
    return rows;
  },

  async allWithDetails() {
    const sql = `
      select f.name, count(c.id) as 'NumberOfCourse'
      from fields as f left join subField as sf on f.name = sf.fieldName
            left join course as c on c.subFieldId = sf.id
      where c.status != 'Suspended'
      group by f.name
    `;
    const [rows, fields] = await db.load(sql);
    return rows;
  },

  async single(fieldName) {
    const sql = `select name from subField where fieldName = ?`;
    const condition = [fieldName];
    const [rows, fields] = await db.load(sql, condition);
    if (rows.length === 0)
      return null;
    return rows;
  },

  async getBySubName(subName) {
    const sql = `select id from subfield where name = ?`;
    const condition = [subName];
    const [rows, fields] = await db.load(sql, condition);
    if (rows.length === 0) {
      return null;
    }
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
