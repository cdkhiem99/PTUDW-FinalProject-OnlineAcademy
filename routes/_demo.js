const express = require('express');
const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })

const router = express.Router();

router.get('/editor', async function (req, res) {
  res.render('vwDemo/editor');
})

router.post('/editor', async function (req, res) {
  console.log(req.body.FullDes);
  res.send('ok');
})

router.get('/upload', async function (req, res) {
  res.render('vwDemo/upload');
})

router.post('/upload', async function (req, res) {
  const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    },
    destination: function (req, file, cb) {
      cb(null, `./public/imgs/`);
    },
  });
  const upload = multer({ storage });
  upload.array('fuMain', 3)(req, res, function (err) {
    if (err) {

    } else {
      res.render('vwDemo/upload');
    }
  })
})

module.exports = router;