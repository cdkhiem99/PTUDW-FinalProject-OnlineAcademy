const express = require('express');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const config = require('../config/default.json');

const router = express.Router();

router.get('/login', async function (req, res) {
  res.render('vwAccount/login', {
    layout: false
  });
})

router.post('/login', async function (req, res) {
  const user = await userModel.singleByUserName(req.body.username);
  if (user === null)
    return res.render('vwAccount/login', {
      layout: false,
      err_message: 'Invalid username or password.'
    });

  const rs = bcrypt.compareSync(req.body.password, user.password_hash);
  if (rs === false)
    return res.render('vwAccount/login', {
      layout: false,
      err_message: 'Invalid username or password.'
    });

  delete user.password_hash;
  req.session.isAuthenticated = true;
  req.session.authUser = user;

  const url = req.query.retUrl || '/';
  res.redirect(url);
})

router.post('/logout', async function (req, res) {
  req.session.isAuthenticated = false;
  req.session.authUser = null;
  res.redirect(req.headers.referer);
})


const restrict = require('../middlewares/auth.mdw');
router.get('/profile', restrict, async function (req, res) {
  res.render('vwAccount/profile');
})

router.get('/register', async function (req, res) {
  res.render('vwAccount/register');
})

router.post('/register', async function (req, res) {
  const hash = bcrypt.hashSync(req.body.password, config.authentication.saltRounds);
  const dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
  const entity = {
    username: req.body.username,
    password_hash: hash,
    name: req.body.name,
    email: req.body.email,
    dob,
    permission: 0
  }
  const ret = await userModel.add(entity);
  res.render('vwAccount/register');
})

router.get('/is-available', async function (req, res) {
  const user = await userModel.singleByUserName(req.query.user);
  if (!user)
    return res.json(true);

  res.json(false);
})

module.exports = router;