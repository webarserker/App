/**
 * Created by liuyang on 2017/7/25.
 */

var express = require('express');
var router = express.Router();

/* GET home page. 设置子路由以及对应的数据传入 */
router.get('/', function(req, res, next) {
    res.render('./v4template/articleDetail');
});

module.exports = router;
