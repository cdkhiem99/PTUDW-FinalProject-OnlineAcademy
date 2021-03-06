const db = require("../utils/db");
const { paginate } = require("../config/default.json");
const debug = require("debug")("models:course");

module.exports = {
  async all() {
    const sql = "select * from course as c where c.ban=false";
    const [rows, fields] = await db.load(sql);
    return rows;
  },

  async allForAd() {
    const sql = "select * from course";
    const [rows, fields] = await db.load(sql);
    return rows;
  },

  async allByCat(id) {
    const sql = `select * from course where id=${id} and ban=false`;
    const [rows, fields] = await db.load(sql);
    return rows;
  },

  async countByCat(id) {
    const sql = `select count(*) as total from course where id=${id} and ban=false`;
    const [rows, fields] = await db.load(sql);
    return rows[0].total;
  },

  async pageByCat(id, offset) {
    const sql = `select * from course where id=${id} and ban=false limit ${paginate.limit} offset ${offset}`;
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
    const sql = `select * from course where id=${id} and ban=false`;
    const [rows, fields] = await db.load(sql);
    if (rows.length === 0) return null;

    return rows[0];
  },

  async get10mostView() {
    const sql = `select c.*, lt.name as LecturerName
                  from course as c
                  join lecturer as lt
                  on lt.id = c.lecturerId
                  where c.ban=false
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
                  where c.ban=false
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
                  where c.ban=false
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
                where sf.id = ?
                and c.ban=false`;
    const condition = [fieldsId];
    const [rows, fields] = await db.load(sql, condition);

    return rows[0];
  },

  async getCourseNamebyFieldID(fieldsId) {
    const sql = `select c.name
                from course as c join subfield as sf on sf.courseID = c.subFieldId
                where sf.id = ?
                and c.ban=false`;
    const condition = [fieldsId];
    const [rows, fields] = await db.load(sql, condition);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  },

  async getCountC(){
    const sql = `select count(*) as count
                  from course`;
    const [rows, fields] = await db.load(sql);
    if(rows.length===0)
      return null;

    return rows[0].count;
  },

  async getSubIDbyName(name){
    const sql = `select id from subField where name=?`
    const condition = [name];

    const [rows, fields] = await db.load(sql, condition);
    if(rows.length===0)
      return null;

    return rows[0];
  },

  async getCourseByID(courseID) {
    const sql = `select c.*, c.id as CourseID, c.title as CourseName, c.imagePath as imagePath, c.briefDescription as BriefDes, c.description as fullDes,
                TIMESTAMPDIFF(day, c.date, CURRENT_TIME()) as lastUpdate,
                c.price as Price, lt.id as LectID, lt.name as LecturerName, lt.phone_number as PhoneNumber, lt.university as University, lt.email
                from course as c
                join lecturer as lt on c.lecturerId = lt.id
                where c.id = ${courseID}
                and c.ban=false`;

    const [rows, f0] = await db.load(sql);

    if (rows.length === 0) {
      return null;
    }

    const sql1 = `select count(*) as nSections from section where section.courseId = ${courseID};`;
    const [rowsSections, f1] = await db.load(sql1);

    const sql2 = `select sf.fieldName, sf.name as subFieldName from course as c join subfield as sf on c.subFieldId = sf.id where c.id = ${courseID}`;
    const [rowsField, f2] = await db.load(sql2);

    const sql3 = `select count(*) as nStudents from enroll as er join course as c on er.courseId = c.id where c.id = ${courseID}`;
    const [rowsStudents, f3] = await db.load(sql3);

    return {
      CourseID: rows[0].CourseID,
      CourseName: rows[0].CourseName,
      imagePath: rows[0].imagePath,
      Price: rows[0].Price,
      briefDescription: rows[0].BriefDes,
      fullDescription: rows[0].fullDes,
      lastUpdate: rows[0].lastUpdate,
      LecturerID: rows[0].LectID,
      LecturerName: rows[0].LecturerName,
      LecturerPhone: rows[0].PhoneNumber,
      LecturerEmail: rows[0].email,
      LecturerUniversity: rows[0].University,
      status: rows[0].status,
      totalHours: rows[0].totalHours,
      nLikes: rows[0].likes,
      nViews: rows[0].view,
      nSections: rowsSections[0].nSections,
      nStudents: rowsStudents[0].nStudents,
      fieldName: rowsField[0].fieldName,
      subFieldName: rowsField[0].subFieldName,
    };
  },

  async getAllCourseByField(fieldName, offset) {
    const sql = `select c.id as CourseID, c.title as CourseName, sf.fieldname as FieldName, c.imagePath as imagePath,
                lt.name as LecturerName, c.likes as Rating, c.price as CoursePrice, c.briefDescription as briefDes, c.description as FullDes
                from course as c join subfield as sf on c.subFieldId = sf.id
                join lecturer as lt on lt.id = c.lecturerId
                where sf.fieldName = ?
                and c.ban=false limit ${paginate.limit} offset ${offset}`;
    const condition = [fieldName];
    const [rows, fields] = await db.load(sql, condition);

    const listByFields = [];

    if (rows.length !== 0) {
      for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        listByFields.push({
          CourseID: element.CourseID,
          CourseName: element.CourseName,
          imagePath: element.imagePath,
          LecturerName: element.LecturerName,
          imagePath: element.imagePath,
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

  async getAllCourseByLecturerName(LecturerName) {
    const sql = `select c.id as CourseID, c.title as CourseName, sf.fieldname as FieldName, c.imagePath as imagePath,
                lt.name as LecturerName, c.likes as Rating, c.price as CoursePrice, c.briefDescription as briefDes, c.description as FullDes
                from course as c join subfield as sf on c.subFieldId = sf.id
                join lecturer as lt on lt.id = c.lecturerId
                where lt.name = ?
                and c.ban=false`;
    const condition = [LecturerName];
    const [rows, fields] = await db.load(sql, condition);

    const listByLecturerName = [];

    if (rows.length !== 0) {
      for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        listByLecturerName.push({
          CourseID: element.CourseID,
          CourseName: element.CourseName,
          imagePath: element.imagePath,
          LecturerName: element.LecturerName,
          imagePath: element.imagePath,
          Rating: element.Rating,
          Price: element.CoursePrice,
          briefDescription: element.briefDes,
          fullDescription: element.FullDes,
          fieldName: element.FieldName,
        });
      }
    }
    return listByLecturerName;
  },

  async getAllCourseBySubField(fieldsID) {
    const sql = `select c.id as CourseID, c.title as CourseName, sf.fieldname as FieldName, c.imagePath as imagePath,
                lt.name as LecturerName, c.likes as Rating, c.price as CoursePrice, c.briefDescription as briefDes, c.description as FullDes
                from course as c join subfield as sf on c.subFieldId = sf.id
                join lecturer as lt on lt.id = c.lecturerId
                where sf.id = ?
                and c.ban=false`;
    const condition = [fieldsID];
    const [rows, fields] = await db.load(sql, condition);

    const listByFields = [];

    if (rows.length !== 0) {
      for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        listByFields.push({
          CourseID: element.CourseID,
          CourseName: element.CourseName,
          imagePath: element.imagePath,
          LecturerName: element.LecturerName,
          imagePath: element.imagePath,
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

  async getAllCourse(offset) {
    const sql = `select c.id as CourseID, c.title as CourseName, sf.fieldname as FieldName, c.imagePath as imagePath,
                lt.name as LecturerName, c.likes as Rating, c.price as CoursePrice, c.briefDescription as briefDes, c.description as FullDes
                from course as c join subfield as sf on c.subFieldId = sf.id
                join lecturer as lt on lt.id = c.lecturerId
                where c.ban=false limit ${paginate.limit} offset ${offset}`;
    const [rows, fields] = await db.load(sql);

    const allCourses = [];

    if (rows.length !== 0) {
      for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        allCourses.push({
          CourseID: element.CourseID,
          CourseName: element.CourseName,
          imagePath: element.imagePath,
          LecturerName: element.LecturerName,
          imagePath: element.imagePath,
          Rating: element.Rating,
          Price: element.CoursePrice,
          briefDescription: element.briefDes,
          fullDescription: element.FullDes,
          fieldName: element.FieldName,
        });
      }
    }
    return allCourses;
  },

  async searchCourse(match, offset) {
    let sql = ``;
    if (match.trim() === "IT") {
      sql = `select c.id as CourseID, c.title as CourseName, sf.fieldname as FieldName, c.imagePath as imagePath,
            lt.name as LecturerName, c.likes as Rating, c.price as CoursePrice, c.briefDescription as briefDes, c.description as FullDes
            from course as c 
            join subfield as sf on c.subFieldId = sf.id
            join lecturer as lt on lt.id = c.lecturerId
            where c.title LIKE '%IT' or sf.fieldname LIKE '%IT' and
            c.ban=false limit ${paginate.limit} offset ${offset}`;
    } else {
      sql = `select c.id as CourseID, c.title as CourseName, sf.fieldname as FieldName, c.imagePath as imagePath,
            lt.name as LecturerName, c.likes as Rating, c.price as CoursePrice, c.briefDescription as briefDes, c.description as FullDes
            from course as c 
            join subfield as sf on c.subFieldId = sf.id
            join lecturer as lt on lt.id = c.lecturerId
            where 
            Match (c.title, c.description) AGAINST (? IN NATURAL LANGUAGE MODE) or 
            Match (sf.fieldname, sf.name) AGAINST (? IN NATURAL LANGUAGE MODE) and 
            c.ban=false limit ${paginate.limit} offset ${offset}`;
    } 
    const condition = [match, match];
    const [rows, fields] = await db.load(sql, condition);

    const listOfResults = [];

    if (rows.length !== 0) {
      for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        listOfResults.push({
          CourseID: element.CourseID,
          CourseName: element.CourseName,
          LecturerName: element.LecturerName,
          imagePath: element.imagePath,
          Rating: element.Rating,
          Price: element.CoursePrice,
          briefDescription: element.briefDes,
          fullDescription: element.FullDes,
          fieldName: element.FieldName,
        });
      }
    }

    return listOfResults;
  },

  async suspendCourse(courseId) {
    try {
      const sql = `update course set ban=true where id = ?`;
      const condition = [courseId];
      const [result, fields] = await db.load(sql, condition);
      console.log(result);
      return true;
    } catch (error) {
      return error.message;
    }
  },

  async unlockCourse(courseId) {
    try {
      const sql = `update course set ban=false where id = ?`;
      const condition = [courseId];
      const [result, fields] = await db.load(sql, condition);
      console.log(result);
      return true;
    } catch (error) {
      return error.message;
    }
  },

  async countCourse() {
    const sql = `select count(*) as total from course where ban=false`;
    const [rows, fields] = await db.load(sql);
    return rows[0].total;
  },

  async countCourseByField(field) {
    const sql = `select count(*) as total 
                from course as c 
                join subfield as sf on c.subFieldId = sf.id
                where sf.fieldName = ? and c.ban=false`;
    condition = [field]
    const [rows, fields] = await db.load(sql, condition);
    return rows[0].total;
  },

  async countCourseBySearch(match) {
    const sql = `select count(*) as total
            from course as c 
            join subfield as sf on c.subFieldId = sf.id
            join lecturer as lt on lt.id = c.lecturerId
            where 
            Match (c.title, c.description) AGAINST (? IN NATURAL LANGUAGE MODE) or 
            Match (sf.fieldname, sf.name) AGAINST (? IN NATURAL LANGUAGE MODE) and 
            c.ban=false`;
    const condition = [match, match];
    const [rows, fields] = await db.load(sql, condition);
    return rows[0].total;
  }
};
