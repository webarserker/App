/**
 * created by abby 2017/7/18
 */
var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var useragent = require('express-useragent');
var CONFIG = require('../config');
var API_BASE_URL = CONFIG.API_SERVER_FULL_URL;
//var base_sever_url = CONFIG.HOME_SERVER_DOMAIN_FOR_HOME;
var async = require('async');
var v5templateHomeUtil = require('./util/v5templateHomeUtil');
var fs = require('fs');
var jade = require('jade');
var secondPage = require('./secondPage');
var index = require('./index');
// 模板二级页面 短链接跳转
var page = require('./page');


// 移动端的配置

var MOBILE_BASE_URL = CONFIG.MOBILE_SERVER_FULL_URL;

// v5.0 模板二级页面
var v5templateHome = require('./v5template/v5templateHome');
var v5users = require('./v5template/v5users');
// v4.0 模板二级页面
var home = require('./v4template/home');

/* 4.1 二级页面v4_1ArticleDetail*/
var v4_1ArticleDetail = require('./v4_1template/v4_1ArticleDetail');



// v3_1模版
var v3_1home = require('./v3_1template/v3_1home');


/* GET users listing. */
router.get('/', function (req, res, next) {





    res.send('respond with a resource');
});
/*  后台链接处理
*   01后台登录页面:  /manage/index
*   02录取计划      /manage/frame
* */
//----------------------   PC端新旧链接处理   二级页面文章详情-01-------------------------------
function manageIndex(req, res, next) {
    var url = API_BASE_URL;
    return res.redirect(url);
}

router.get('/index', manageIndex);
router.get('/frame', manageIndex);

module.exports = router;