const db = require('../utils/db');

module.exports = {
    async takeFeedback(studenID, courseID){
        const sql = `select * from feedback where studentId=${studenID} and courseID=${courseID}`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0)
            return null;

        return rows[0];
    },

    async add(feedbacks) {
        const [result, fields] = await db.add(feedbacks, 'feedback');
        return result;
    }
}