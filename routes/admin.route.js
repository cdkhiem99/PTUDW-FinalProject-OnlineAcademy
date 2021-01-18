const express = require('express');
const courseModel = require('../models/course.model');
const lecturerModel = require('../models/lecturer.model');
const studentModel = require('../models/student.model');
const router = express.Router();

router.use(function(req,res,next){
    if(!res.locals.auth || res.locals.authUser.role !== 'admin'){
        return res.redirect('/');
    }
    return next();
})

router.get("/", function (req, res) {
    res.render("vwAccount/profile");
});

router.get("/students/", async function(req, res) {
    const allStudents = await studentModel.getAllStudent();
    res.locals.empty = allStudents === null;
    res.locals.allStudents = allStudents;
    res.render("vwAdmin/student");
});

router.get("/courses/", async function(req, res) {
    const allCourses = await courseModel.allForAd();
    res.locals.empty = allCourses === null;
    res.locals.allCourses = allCourses;
    res.render("vwAdmin/course");
});

router.get("/lecturers/", async function(req, res) {
    const allLecturers = await lecturerModel.getAllLecturer();
    res.locals.empty = allLecturers === null;
    res.locals.allLecturers = allLecturers;
    res.render("vwAdmin/lecturer");
});

router.get("/fields/", async function(req, res) {
    res.render("vwAdmin/field");
});

router.post("/course/suspend", async function(req, res) {
    const getDel = await courseModel.suspendCourse(req.body.courseId);

    res.json(getDel);
});

router.post("/course/open", async function (req, res) {
    const open = await courseModel.unlockCourse(req.body.courseId);
    res.json(open);
});

router.post("/lecturer/block", async function (req, res) {
    const blockL = await lecturerModel.blockLecturer(req.body.id);
    res.json(blockL);   
});

router.post("/lecturer/unblock", async function (req, res) {
    const unblockL = await lecturerModel.unblockLecturer(req.body.id);
    res.json(unblockL);
});

router.post("/student/block", async function (req, res) {
    const blockS = await studentModel.blockStudent(req.body.id);
    res.json(blockS);   
});

router.post("/student/unblock", async function (req, res) {
    const unblockS = await studentModel.unblockStudent(req.body.id);
    res.json(unblockS);
})

module.exports = router;