const db = require('../utils/db');

module.exports = {
    async takeSignleVideo(id, courseID){
        const sql = `select * from section where id=${id} and courseId=${courseID}`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;

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
                preview: video.preview
            }

            const [result, fields] = await db.patch(newVideo, condition, 'section');
        } catch (error) {
            error.message;
        }

        return true; 
    }
}