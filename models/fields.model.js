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
  },

  async mostPopularField(){
    const sql = `select distinct f.fieldName, count(course.id)
                  from course join enroll on course.id = enroll.courseId 
                        join subField as f on course.subFieldId = f.id 
                  group by f.name 
                  order by count(course.id) desc limit 5`;
    const [rows, fields] = await db.load(sql);
    if (rows.length === 0)
      return null;

    return rows;
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
