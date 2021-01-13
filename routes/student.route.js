const express = require('express');
const router = express.Router();
const updateStudent = require("../models/student.model");
const { password } = require('../utils/mysql_opts');
const bcrypt = require("bcryptjs");

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
    const check = await updateStudent.patch(req.body,res.locals.authUser.id);
    const hash = bcrypt.hashSync(req.body.password, 10);
    if (check === true){
        req.session.authUser = {
            id: req.body.username,
            password: hash,
            phone_number: req.body.phone,
            name: req.body.name,
            email: req.body.email,
            role: 'student'
        }
    }
    res.json(check);
})

module.exports = router;