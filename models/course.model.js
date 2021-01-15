const db = require("../utils/db");
const { paginate } = require("../config/default.json");
const debug = require("debug")("models:course");
const sub = require("../models/subfield.model");

module.exports = {
  async all() {
    const sql = "select * from course";
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
    const [result, fields] = await db.add(course, "course");
    // console.log(result);
    return result;
  },

  async deleteCourse(id) {
    const condition = {
      id: id,
    };

    const [result, fields] = await db.del(condition, "course");
    return result;
  },

  async updateCourse(entity) {
    const condition = {
      id: entity.id,
    };
    delete entity.id;

    const [result, fields] = await db.patch(entity, condition, "course");
    return result;
  },

  async single(id) {
    const sql = `select * from course where id=${id}`;
    const [rows, fields] = await db.load(sql);
    if (rows.length === 0) return null;

    return rows[0];
  },

  async get10mostView() {
    const sql = `select c.*, lt.name as LecturerName
                  from course as c
                  join lecturer as lt
                  on lt.id = c.lecturerId
                  order by c.view desc limit 10`;
    const [rows, fields] = await db.load(sql);
    if (rows.length === 0) {
      return null;
    }

    debug("Fields:\n", fields);
    debug(`rows.length: ${rows.length}`);
    debug(`rows[0]:\n`, rows[0]);

    return rows;
  },

  async get10LatestCourse() {
    const sql = `select c.*, lt.name as LecturerName
                  from course as c
                  join lecturer as lt
                  on lt.id = c.lecturerId
                  order by c.date desc limit 10`;
    const [rows, fields] = await db.load(sql);

    if (rows.length === 0) {
      return null;
    }

    return rows;
  },

  async get4HighlightedCourse() {
    const sql = `select c.*, lt.name as LecturerName
                  from course as c
                  join lecturer as lt
                  on lt.id = c.lecturerId
                  order by c.likes desc limit 10`;
    const [rows, fields] = await db.load(sql);

    if (rows.length === 0) {
      return null;
    }

    return rows;
  },

  async getCourseIDbyFieldID(fieldsId) {
    const sql = `select c.id
                from course as c join subfield as sf on sf.courseID = c.subFieldId
                where sf.id = ?`;
    const condition = [fieldsId];
    const [rows, fields] = await db.load(sql, condition);

    return rows[0];
  },

  async getCourseNamebyFieldID(fieldsId) {
    const sql = `select c.name
                from course as c join subfield as sf on sf.courseID = c.subFieldId
                where sf.id = ?`;
    const condition = [fieldsId];
    const [rows, fields] = await db.load(sql, condition);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  },

  async getCourseByID(courseID) {
    const sql = `select c.id as CourseID, c.title as CourseName, c.briefDescription as BriefDes, c.description as fullDes,
                TIMESTAMPDIFF(day, c.date, CURRENT_TIME()) as lastUpdate,
                c.price as Price, lt.id as LectID, lt.name as LecturerName, lt.phone_number as PhoneNumber, lt.university as University
                from course as c
                join lecturer as lt on c.lecturerId = lt.id
                where c.id = ${courseID}`;

    const [rows, _] = await db.load(sql);

    if (rows.length === 0) {
      return null;
    }

    return {
      CourseID: rows[0].CourseID,
      CouresName: rows[0].CouresName,
      Price: rows[0].Price,
      briefDescription: rows[0].BriefDes,
      fullDescription: rows[0].fullDes,
      lastUpdate: rows[0].lastUpdate,
      LecturerID: rows[0].LectID,
      LecturerName: rows[0].LecturerName,
      LecturerPhone: rows[0].PhoneNumber,
      LecturerUniversity: rows[0].University,
    };
  },

  async getAllCourseByField(fieldName) {
    const sql = `select c.id as CourseID, c.title as CourseName, sf.name as FieldName,
                lt.name as LecturerName, c.likes as Rating, c.price as CoursePrice, c.briefDescription as briefDes, c.description as FullDes
                from course as c join subfield as sf on c.subFieldId = sf.id
                join lecturer as lt on lt.id = c.lecturerId
                where sf.fieldName = ?`;
    const condition = [fieldName];
    const [rows, fields] = await db.load(sql, condition);

    const listByFields = [];

    if (rows.length !== 0) {
      for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        listByFields.push({
          CourseID: element.CourseID,
          CourseName: element.CourseName,
          LecturerName: element.LecturerName,
          Rating: element.Rating,
          Price: element.CoursePrice,
          briefDescription: element.briefDes,
          fullDescription: element.FullDes,
          fieldName: element.FieldName,
        });
      }
    }
    return listByFields;
  },

  async getAllCourseBySubField(fieldsID) {
    const sql = `select c.id as CourseID, c.title as CourseName, sf.name as FieldName,
                lt.name as LecturerName, c.likes as Rating, c.price as CoursePrice, c.briefDescription as briefDes, c.description as FullDes
                from course as c join subfield as sf on c.subFieldId = sf.id
                join lecturer as lt on lt.id = c.lecturerId
                where sf.id = ?`;
    const condition = [fieldsID];
    const [rows, fields] = await db.load(sql, condition);

    const listByFields = [];

    if (rows.length !== 0) {
      for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        listByFields.push({
          CourseID: element.CourseID,
          CourseName: element.CourseName,
          LecturerName: element.LecturerName,
          Rating: element.Rating,
          Price: element.CoursePrice,
          briefDescription: element.briefDes,
          fullDescription: element.FullDes,
          fieldName: element.FieldName,
        });
      }
    }
    return listByFields;
  },
};
