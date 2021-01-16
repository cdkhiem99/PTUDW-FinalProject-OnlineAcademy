const express = require('express');
const router = express.Router();
const updateStudent = require("../models/student.model");
const { password } = require('../utils/mysql_opts');
const bcrypt = require("bcryptjs");
const emailService = require("../routes/email.route");
const enrollC = require("../models/enroll.model");

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

router.use(function(req,res,next){
    if(!res.locals.auth || res.locals.authUser.role !== 'student'){
        return res.redirect('/');
    }
    return next();
})

router.get("/", function (req, res) {
    res.render("vwAccount/profile");
});

router.post("/edit/profile", async function (req, res) {
    const randomString = makeid(15);
    jwt.set(randomString, req.body);
    const url = `http://localhost:3000/student/confirmation/${randomString}`;
    emailService.sendConfirmationEmail(req.body, url, async (err, data) => {
        if (err === null){
            const check = await updateStudent.patch(req.body,res.locals.authUser.id);
            const hash = bcrypt.hashSync(req.body.password, 10);
            if (check === true){
                req.session.authUser = {
                id: req.body.username,
                password: hash,
                phone_number: req.body.phone,
                name: req.body.name,
                email: req.body.email,
                role: 'student'}
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

router.post("/enroll", async function (req, res) {
    var today = new Date();
    var date = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, 0)}-${today.getDate().toString().padStart(2, 0)}`;
    const enroll = await enrollC.enrollCourse(res.locals.authUser.id, req.body.courseId, date);
    res.json(enroll);
})

module.exports = router;