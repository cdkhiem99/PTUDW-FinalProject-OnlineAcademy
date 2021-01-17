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
    const allCourses = await courseModel.all();
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

module.exports = router;