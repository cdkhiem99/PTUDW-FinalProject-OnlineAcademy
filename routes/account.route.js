const express = require("express");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const studentModel = require("../models/student.model");
const auth = require("../middlewares/auth.mdw");
const { singleByUserName } = require("../models/student.model");

const router = express.Router();

router.get("/profile", auth, function (req, res, next) {
  res.render("vwAccount/profile");
});

router.get("/register", function (req, res, next) {
  res.render("vwAccount/register");
});

router.post("/register", async function (req, res, next) {
  const hash = bcrypt.hashSync(req.body.password, 10);
  const block = true;
  console.log(req.body.email);
  const user = {
    id: req.body.username,
    password: hash,
    phone_number: req.body.phone,
    name: req.body.name,
    email: req.body.email,
    block: block
  };

  const findID = await singleByUserName(user.id);
  if (findID !== null){
    res.json("Username has already existed!");
  }
  else{
    await studentModel.add(user);
    res.json(true);
  }
});

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
  console.log(req.body.username);
  const user = await studentModel.singleByUserName(req.body.username);
  if (user === null) {
    return res.render("vwAccount/login", {
      layout: false,
      err_message: "Invalid username.",
    });
  }

  const ret = bcrypt.compareSync(req.body.password, user.password);
  if (ret === false) {
    return res.render("vwAccount/login", {
      layout: false,
      err_message: "Invalid password.",
    });
  }

  req.session.auth = true;
  req.session.authUser = user;

  const url = req.session.retUrl || "/";
  res.redirect(url);
});

router.post("/logout", async function (req, res) {
  req.session.auth = false;
  req.session.authUser = null;
  req.session.retUrl = null;

  const url = req.headers.referer || "/";
  res.redirect(url);
});

module.exports = router;
