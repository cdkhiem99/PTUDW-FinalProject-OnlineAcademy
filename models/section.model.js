const db = require("../utils/db");

module.exports = {
  async takeSingleVideo(id, courseID) {
    const sql = `select * from section where id=${id} and courseId=${courseID}`;
    const [rows, fields] = await db.load(sql);
    if (rows.length === 0) return null;

    return rows[0];
  },

  async addNewVideo(video, id) {
    try {
      const condition = {
        courseID: id,
      };
      const newVideo = {
        title: video.title,
        description: video.description,
        preview: video.preview,
      };

      const [result, fields] = await db.patch(newVideo, condition, "section");
    } catch (error) {
      error.message;
    }

    return true;
  },

  async getPreviewVideo(courseID) {
    const sql = `select preview from section where courseId = ? and preview is not null`;
    const condition = [courseID];
    const [result, fields] = await db.load(sql, condition);

    if (result.length === 0) {
      return null;
    }

    return result[0];
  },

  async getCourseContent(courseID) {
    const sql = `select id, title, videoPath, preview from section where courseId = ?`;
    const condition = [courseID];
    const [rows, fields] = await db.load(sql, condition);

    listOfContent = [];

    if (rows.length !== 0) {
      for (let index = 0; index < rows.length; index++) {
        listOfContent.push({
          ID: rows[index].id,
          Title: rows[index].title,
          videoPath: rows[index].videoPath,
          preview: rows[index].preview
        });
      }
    }

    return listOfContent;
  },

  async getCourseContentWithProcess(courseID, studentId) {
    const sql = `select id, title, videoPath, preview, 
                (select count(*) 
                from markComplete as mc 
                where section.id = mc.sectionId and mc.courseId = section.courseId and mc.studentId = ?) as isComplete
                from section 
                where courseId = ?`;
    const condition = [studentId, parseInt(courseID)];
    const [rows, fields] = await db.load(sql, condition);

    listOfContent = [];

    if (rows.length !== 0) {
      for (let index = 0; index < rows.length; index++) {
        listOfContent.push({
          ID: rows[index].id,
          Title: rows[index].title,
          videoPath: rows[index].videoPath,
          preview: rows[index].preview,
          isComplete: rows[index].isComplete === 1
        });
      }
    }

    return listOfContent;
  },

  async finishCourse(studentId, courseId, sectionId){
    try {
      const sql = `insert into markComplete values(?,?,?,?) on duplicate key update isComplete = ?`;
      const condition = [studentId, parseInt(courseId), parseInt(sectionId), true, true];
      const [result, fields] = await db.load(sql, condition);
      console.log(result);
      return true;
    } catch (error) {
      return error.message;
    }
  }
};
