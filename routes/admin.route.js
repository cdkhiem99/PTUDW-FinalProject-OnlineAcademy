const express = require('express');
const { func } = require('joi');
const lecturerModel = require('../models/lecturer.model');
const studentModel = require('../models/student.model');
const subfieldModel = require('../models/subfield.model');
const router = express.Router();
const bcrypt = require("bcryptjs");
const fieldsModel = require('../models/fields.model');
const courseModel = require('../models/course.model');

router.use(function(req,res,next){
    if(!res.locals.auth || res.locals.authUser.role !== 'admin'){
        return res.redirect('/');
    }
    return next();
})

router.get("/", function (req, res) {
    res.render("vwAccount/profile");
});

router.get("/students", async function(req, res) {
    const allStudents = await studentModel.getAllStudent();
    res.locals.empty = allStudents === null;
    res.locals.allStudents = allStudents;
    res.render("vwAdmin/student");
});

router.get("/courses", async function(req, res) {
    const allCourses = await courseModel.allForAd();
    res.locals.empty = allCourses === null;
    res.locals.allCourses = allCourses;
    res.render("vwAdmin/course");
});

router.get("/lecturers", async function(req, res) {
    const allLecturers = await lecturerModel.getAllLecturer();
    res.locals.empty = allLecturers === null;
    res.locals.allLecturers = allLecturers;
    res.render("vwAdmin/lecturer");
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

router.get("/changeview", async function (req, res) {
    res.render("vwAdmin/addLecturer");    
})

router.post("/add/profile", async function (req, res) {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const block = false;
    const user = {
        id: req.body.username,
        password: hash,
        phone_number: req.body.phone,
        name: req.body.name,
        gender: req.body.gender,
        university: req.body.university,
        email: req.body.email,
        block: block
    };

    const getLec = await lecturerModel.checkIdExist(user.id);
    if (getLec === false){
        res.json("ID existed!");
    }
    else{
        const getEmail = await lecturerModel.singleEmailByID(user.email);
        if (getEmail===false){
            res.json("Email existed!");
        }
        else{
            await lecturerModel.add(user);
            res.json(true);
        }
    }
})

router.get("/fields", async function (req, res, next) {
    const listSubFields = await subfieldModel.all();
    res.locals.listSubFields = listSubFields;

    const listFields = await fieldsModel.all();
    res.locals.listFields = listFields;
    
    res.render("vwAdmin/field");
});

router.post("/edit/field", async function (req, res) {
    console.log(req.body);
    const editfield = await fieldsModel.patch(req.body);
    if (editfield===false){
        res.json("Field's name can not be duplicate!");
    }
    else{
        res.json(true);
    }
})

router.post("/edit/subfield", async function (req, res) {
    const editsub = await subfieldModel.patch(req.body.name, req.body.id);
    if (editsub===false){
        res.json("Subfield's name can not be duplicate!");
    }
    else{
        res.json(true);
    }
})

router.post("/del/fields", async function (req, res) {
    const check = await fieldsModel.haveCourse(req.body.name);
    if (check===false){
        res.json("Can not delete field has courses!");
    }
    else{
        await fieldsModel.del(req.body.name);
        res.json(true);
    }
})

router.post("/del/subfield", async function (req, res) {
    const checksub = await subfieldModel.haveCourse(req.body.id);
    if (checksub===false){
        res.json("Can not delete Subfield has courses!");
    }
    else{
        await subfieldModel.del(req.body.id);
        res.json(true);
    }
})

router.post("/add/field", async function (req, res) {
    const addF = await fieldsModel.add(req.body.fname);
    if (addF===false){
        res.json("Can not have duplicate field!");
    }
    else{
        res.json(addF);
    }
})

router.post("/add/subfield", async function (req, res) {
    const addS = await subfieldModel.add(req.body);
    if (addS===false){
        res.json("Can not have duplicate Subfield!");
    }
    else{
        res.json(addS);
    }
})

module.exports = router;