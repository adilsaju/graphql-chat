var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  console.log("hello");
  res.json("ab")
});

// router.get('/test', function (req, res, next) {
//   console.log("test");
//   res.json("test")

// });
module.exports = router;
