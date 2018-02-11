/**
 * created by abby 2017/7/18
 */
var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('OK');
});



module.exports = router;