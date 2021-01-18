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

    const listOfContent = [];

    if (rows.length !== 0) {
      let panelID = 2;
      let paneltitleID = 3;
      for (let index = 0; index < rows.length; index++) {
        listOfContent.push({
          ID: rows[index].id,
          Title: rows[index].title,
          videoPath: rows[index].videoPath,
          preview: rows[index].preview,
          panelID,
          paneltitleID,
        });
        panelID += 4;
        paneltitleID += 4;
      }
    }

    return listOfContent;
  },
};
