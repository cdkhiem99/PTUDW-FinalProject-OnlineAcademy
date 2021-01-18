const db = require('../utils/db');
const { haveCourse } = require('./fields.model');

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

  async haveCourse(id){
    const sql = `select *
                  from course as c join subField as sf on sf.id=c.subFieldId
                  where sf.id=?`;
    const condition=[id];
    const [rows, fields] = await db.load(sql, condition);

    if (rows.length===0){
      return true;
    }

    return false;
  },

  async add(category) {
    console.log(category);
    const obj = {
      fieldName: category.fname,
      name: category.sname
    }

    try{
      console.log(obj);
      const [result, fields] = await db.add(obj, 'subField');
      console.log(result);
      return true;
    } catch(e){
      return false;
    }
  },

  async del(id) {
    const condition = {
      id: id
    };
    const [result, fields] = await db.del(condition, 'subField');
    return result;
  },

  async patch(name, id) {
    try{
      const sql = `update subField set name=? where id=?`;
      const condition = [name, id];

      const [result, fields] = await db.load(sql, condition);

      return true;
    } catch(e){
      return false;
    }
  }
};
