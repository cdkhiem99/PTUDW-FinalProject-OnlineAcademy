const express = require('express');
const router = express.Router();

router.use(function(req,res,next){
    if(!res.locals.auth || res.locals.authUser.role !== 'lecturer'){
        return res.redirect('/');
    }
    return next();
})

router.get("/", function (req, res) {
    res.render("vwAccount/profile");
});

module.exports = router;