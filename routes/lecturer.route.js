const express = require('express');
const bcrypt = require("bcryptjs");
const emailService = require("../routes/email.route");
const { password } = require('../utils/mysql_opts');
const router = express.Router();
const updateLecturer = require("../models/lecturer.model");
const multer = require('multer');
const mkdirp = require('mkdirp');
const courseModel = require('../models/course.model');
const lecturerModel = require('../models/lecturer.model');

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

const jwt = new Map();

router.use(async (req,res,next) => {
    if(!res.locals.auth || res.locals.authUser.role !== 'lecturer'){
        return res.redirect('/');
    }
    res.locals.courseSize = await courseModel.getCountC();
    return next();
})

router.get("/", function (req, res) {
    res.render("vwAccount/profile");
});

router.get("/mycourse", async function (req, res) {
    const myCourseList = await updateLecturer.getCourseOfLecturer(res.locals.authUser.id);
    res.locals.myCourseList = myCourseList;

    res.render("vwLecturer/courselist");
})

router.post("/edit/profile", async function (req, res) {
    const randomString = makeid(15);
    jwt.set(randomString, req.body);
    const url = `http://localhost:3000/lecturer/confirmation/${randomString}`;
    emailService.sendConfirmationEmail(req.body, url, async (err, data) => {
        if (err === null){
            const check = await updateLecturer.patch(req.body,res.locals.authUser.id);
            const hash = bcrypt.hashSync(req.body.password, 10);
            if (check === true){
                req.session.authUser = {
                id: req.body.username,
                password: hash,
                phone_number: req.body.phone,
                gender: req.body.gender,
                university: req.body.university,
                name: req.body.name,
                email: req.body.email,
                role: 'lecturer'}
            }
            res.json(true);
        }
        else{
            res.json(err);
        }
    })
})

router.get("/confirmation/:token", async function (req, res) {
    const randomString = req.params.token;
    const user = jwt.get(randomString);
    res.redirect("/");
})

router.get('/addCourse', (req, res) => {
    res.locals.currentView = '#user-preferences';
    res.render('vwLecturer/addcourse');
})
router.post('/addCourse', async (req, res) => {
    console.log("ADDDDDDDDDDDDDDD");
    var today = new Date();
    var date = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, 0)}-${today.getDate().toString().padStart(2, 0)}`;
    console.log(req.body.subField);
    var subId = await courseModel.getSubIDbyName(req.body.subField);
    console.log(subId);
    let err = await lecturerModel.AddCourse(req.body,res.locals.authUser.id,res.locals.courseSize+1,subId,date);
    res.json(err);
})
router.post('/upload', (req, res) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const courseId = res.locals.courseSize+1;
            var path = `./resource/public/course/${courseId}`;
            const made = mkdirp.sync(path);
            cb(null, path);
        },
        filename: function (req, file, cb) {
            if (file.fieldname === "coverImage") {
                return cb(null, "photo.png");
            }
            cb(null, file.originalname);
        }
    });

    const upload = multer({ storage: storage });
    upload.any()(req, res, function (err) {
        
        if (err) {
            console.log(err);
        }
    });

})

router.get("/editCourse", function (req, res) {
    res.render('vwLecturer/editcourse');   
})

module.exports = router;