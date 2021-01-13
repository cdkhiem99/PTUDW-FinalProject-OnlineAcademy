const db = require('../utils/db');
const { paginate } = require('../config/default.json');
const { differenceBy } = require('lodash');

module.exports = {
  async all() {
    const sql = 'select * from course';
    const [rows, fields] = await db.load(sql);
    return rows;
  },

  async allByCat(id) {
    const sql = `select * from course where id=${id}`;
    const [rows, fields] = await db.load(sql);
    return rows;
  },

  async countByCat(id) {
    const sql = `select count(*) as total from course where id=${id}`;
    const [rows, fields] = await db.load(sql);
    return rows[0].total;
  },

  async pageByCat(id, offset) {
    const sql = `select * from course where id=${id} limit ${paginate.limit} offset ${offset}`;
    const [rows, fields] = await db.load(sql);
    return rows;
  },

  async addCourse() {
    const [result, fields] = await db.add(course, 'course');
    // console.log(result);
    return result;
  },

  async deleteCourse(id) {
    const condition = {
      id: id
    };

    const [result, fields] = await db.del(condition, 'course');
    return result;
  },

  async updateCourse(entity) {
    const condition = {
      id: entity.id
    }
    delete (entity.id);

    const [result, fields] = await db.patch(entity, condition, 'course');
    return result;
  },

  async single(id) {
    const sql = `select * from course where id=${id}`;
    const [rows, fields] = await db.load(sql);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  async get10mostView(){
    const sql = `select c.*
                  from course as c
                  order by c.view desc limit 10`;
    const [rows, fields] = await db.load(sql);
    if (rows.length === 0){
      return null;
    }

    return rows;
  }
};
