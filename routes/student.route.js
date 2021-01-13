const express = require('express');
const router = express.Router();
const updateStudent = require("../models/student.model");

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
    res.json(check);
})

module.exports = router;