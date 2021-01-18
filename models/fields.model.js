const db = require('../utils/db');
const sub = require('../models/subfield.model');
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
      select f.name, count(c.id) as 'NumberOfCourse'
      from fields as f left join subField as sf on f.name = sf.fieldName
            left join course as c on c.subFieldId = sf.id
      group by f.name
    `;
    const [rows, fields] = await db.load(sql);
    const list = [];

    if (rows.length !== 0){
      for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
          const subName = await sub.single(element.name);
          list.push({
            name: element.name,
            subName: subName
          })
      }
    }

    return list;
  },

  async single(id) {
    const sql = `select * from fields where name = ${id}`;
    const [rows, fields] = await db.load(sql);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  async add(name) {
    const obj ={
      name: name
    }

    try{
      const [result, fields] = await db.add(obj, 'fields');
      return true;
    } catch(e){
      return false;
    }
  },

  async del(name) {
    const sql1 = `delete from fields where name=?`;
    const sql2 = `delete from subField where fieldName=?`
    const condition=[name];

    const [r1, f1] = await db.load(sql1, condition);
    const [r2, f2] = await db.load(sql2, condition);

    return;
  },

  async patch(obj) {
    try{
      const sql1 = `update fields set name=? where name=?`;
      const condition = [obj.name, obj.old];

      const sql2 = `update subField set fieldName=? where fieldName=?`;

      const [r1, f1] = await db.load(sql1, condition);
      const [r2, f2] = await db.load(sql2, condition);

      if (r1.length===0 || r2.length===0){
        return false;
      }

      return true;
    } catch(e){
      return false;
    }
  },

  async mostPopularField(){
    const sql = `select distinct f.fieldName
                  from course join enroll on course.id = enroll.courseId 
                        join subField as f on course.subFieldId = f.id 
                  group by f.fieldName 
                  order by count(course.id) desc limit 5`;
    const [rows, fields] = await db.load(sql);
    if (rows.length === 0)
      return null;

    return rows;
  },

  async haveCourse(name){
    const sql = `select count(f.name) as count
                  from fields as f join subField as sf on f.name=sf.fieldName
                                    join course as c on sf.id=c.subFieldId
                  where f.name=?
                  group by f.name`;

    const condition=[name];
    const [rows, fields] = await db.load(sql, condition);

    if (rows.length === 0){
      return true;
    }

    return false;
  },

  async getAllFieldName() {
    const sql = `select name from fields`;
    const [rows, fields] = await db.load(sql);

    if (rows.length === 0) {
      return null;
    }

    return rows;
  }
};
