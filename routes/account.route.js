const express = require("express");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const studentModel = require("../models/student.model");
const auth = require("../middlewares/auth.mdw");
const { singleByUserName, singleByEmail } = require("../models/student.model");
const emailService = require("../routes/email.route");
const lecturerModel = require("../models/lecturer.model");
const admin = require("../models/admin.model");
const adminModel = require("../models/admin.model");
const router = express.Router();

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
router.get("/profile", auth, function (req, res, next) {
  res.render("vwAccount/profile");
});

router.get("/register", function (req, res, next) {
  res.render("vwAccount/register");
});

router.post("/register", async function (req, res, next) {
  const hash = bcrypt.hashSync(req.body.password, 10);
  const block = false;
    const user = {
    id: req.body.username,
    password: hash,
    phone_number: req.body.phone,
    name: req.body.name,
    email: req.body.email,
    block: block
  };

  const findID = await singleByUserName(user.id);
  var findEmail = await singleByEmail(user.email);
  if (findEmail === true){
    res.json("Email has been used!");
  }
  if (findID !== null){
    res.json("Username has already existed!");
  }
  else{
    const randomString = makeid(15);
    const url = `http://localhost:3000/account/confirmation/${randomString}`;
        jwt.set(randomString,user);
    emailService.sendConfirmationEmail(user, url, function callback(err,data) {
      if (err === null){
        res.json(true);
      }
      else{
        res.json(err);
      }
    })
  }
});

router.get("/confirmation/:token", async function (req, res) {
  const randomString = req.params.token;
  const user = jwt.get(randomString);
  if(user !== null){
    await studentModel.add(user);
  }
  res.redirect("/account/login")
})

router.get("/is-available", async function (req, res) {
  const username = req.query.user;

  //check wheter student create account have 'lecturer' key in id or not, if have, return false
  if (username.includes('lecturer')){
    res.json(false);
  }

  const user = await studentModel.singleByUserName(username);
  if (user === null) {
    return res.json(true);
  }

  res.json(false);
});

router.get("/login", function (req, res) {
  res.render("vwAccount/login", {
    layout: false,
  });
});

router.post("/login", async function (req, res) {
  var user = await studentModel.singleByUserName(req.body.username);
  if (user !== null && bcrypt.compareSync(req.body.password, user.password) && user.block === 0){
    req.session.auth = true;
    req.session.authUser = user;

    const url = req.session.retUrl || "/";
    res.redirect(url);
    return;
  }

  if (user === null){
    user = await lecturerModel.singleByLecturerID(req.body.username);
    if (user !== null && bcrypt.compareSync(req.body.password, user.password) && user.block === 0){
      req.session.auth = true;
      req.session.authUser = user;

      const url = req.session.retUrl || "/";
      res.redirect(url);
      return;
    }
  }

  if (user === null){
    user = await adminModel.singleAdmin(req.body.username);
    if (user !== null && bcrypt.compareSync(req.body.password, user.password)){
      req.session.auth = true;
      req.session.authUser = user;

      const url = req.session.retUrl || "/";
      res.redirect(url);
      return;
    }
  }

  if (user === null || bcrypt.compareSync(req.body.password, user.password)===false) {
    return res.render("vwAccount/login", {
      layout: false,
      err_message: "Wrong username or password!",
    });
  }
  if (user.block === 1) {
    return res.render("vwAccount/login", {
      layout: false,
      err_message: "Your account has been banned!",
    });
  }
});

router.post("/logout", function (req, res) {
  console.log("Log out");
  req.session.auth = false;
  req.session.authUser = null;
  req.session.retUrl = null;
  console.log("Log out");
  const url = req.headers.referer || "/";
  res.redirect(url);
});

module.exports = router;
