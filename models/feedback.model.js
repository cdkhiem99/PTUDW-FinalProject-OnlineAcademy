const db = require('../utils/db');

module.exports = {
    async takeFeedback(studentID, courseID){
        const sql = `select * from feedback where studentId=? and courseID=?`;
        const condition = [studentID, courseID];
        const [rows, fields] = await db.load(sql, condition);
        if (rows.length === 0)
            return null;

        return rows[0];
    },

    async add(studentId, courseId, star, comment, date) {
        try{
            const newData={
                studentId: studentId,
                courseId: parseInt(courseId),
                star: parseInt(star),
                comment: comment,
                date: date
            }
            
            await db.add(newData, 'feedback');
            return true;
        } catch(e){
            return e.messege;
        }
    },

    async getFeedBack(courseID) {
        const sql = `select fb.star as Star, fb.comment as StudentComment, fb.date as datePost,
                    st.name as StudentName 
                    from feedback as fb
                    join student as st on fb.studentId = st.id
                    where fb.courseId = ?`
        const condition = [courseID];

        const [result, fields] = await db.load(sql, condition);

        listOfFeedbacks = [];

        if (result.length !== 0) {
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                listOfFeedbacks.push({
                    StudentName: element.StudentName,
                    Star: element.Star,
                    StudentComment: element.StudentComment,
                    datePost: element.datePost
                })
            }
        }

        return listOfFeedbacks;
    },
}