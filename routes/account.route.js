const express = require("express");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const userModel = require("../models/user.model");
const auth = require("../middlewares/auth.mdw");

const router = express.Router();

router.get("/profile", auth, function (req, res, next) {
  res.render("vwAccount/profile");
});

router.get("/register", function (req, res, next) {
  res.render("vwAccount/register");
});

router.post("/register", async function (req, res, next) {
  const hash = bcrypt.hashSync(req.body.password, 10);
  const dob = moment(req.body.dob, "DD/MM/YYYY").format("YYYY-MM-DD");
  const user = {
    username: req.body.username,
    password: hash,
    dob: dob,
    name: req.body.name,
    email: req.body.email,
    permission: 0,
  };

  await userModel.add(user);
  res.render("vwAccount/register");
});

router.get("/is-available", async function (req, res) {
  const username = req.query.user;
  const user = await userModel.singleByUserName(username);
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
  const user = await userModel.singleByUserName(req.body.username);
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
