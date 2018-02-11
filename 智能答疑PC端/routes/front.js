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

// 模板二级页面 短链接跳转
var page = require('./page');

var index = require('./index');

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
/*  PC端新旧链接处理
*   01文章详情:      /front/info/common?level=3&id=2309&parentId=1033
*   02录取计划       /front/info/enrollPlan?level=2&id=212&parentId=83
*   03专业录取       /front/info/majorScore?level=3&id=220&parentId=83
*   04学校录取       /front/info/schoolEnroll?level=3&id=221&parentId=83
*   05学校基本信息：  /front/info/schoolInfo?level=3&id=202&parentId=81
*   06院系列表：     /front/info/departmentInfo?level=3&id=3976&parentId=189
*   07专业列表：     /front/info/majorInfo?level=3&id=209&parentId=82
*   08视频在线：     /front/info/vido/NLGYFE
*   09校园风采：     /front/info/scenery/NLGYFE
*
*
*
*
*   10填报参考(填报参考)[2]：     /front/info/preScore/NLGYFE
*   11常见问题[1]：     /front/info/toFaqCatPage/NLGYFE      列表
*   /对getScodeByInfoId   请求这个接口   返回catID和scode
*   13研究方向列表： /front/info/majorResearch?level=2&id=10296
*   14研究方向详情： /front/info/majorResearchDetail?id=10296&majorResearchId=15127
*   15专业详情：     /front/info/majorDetail?id=209&majorId=194
*   16院系详情：     /front/info/departmentDetail?id=3976&departmentId=4
*
/*
*
* */
//----------------------   PC端新旧链接处理   二级页面文章详情-01-------------------------------
function infoCommon(req, res, next) {
    var infoId = req.query.id;
    var parentId = req.query.parentId;
    var apiUrl = API_BASE_URL +'/front/template/getScodeByInfoId?infoId='+infoId;
    superagent.get(apiUrl)
        .end(function (err, res2) {
            if (err) {
                console.log("front.js request api err: " + err);
                return v5users.errorPage(req, res, next);
            }
            if (res2.text == "{}") {
                return v5users.cutOffPage(req, res, next);
            }
            // 后台返回数据错误, 直接继续404 // 返回空字符串。屏蔽网站
            if (res2.text.length < 2) {
                return v5users.errorPage(req, res, next);
            }

            var retJson = JSON.parse(res2.text);
            var sCode = retJson.data.sCode;
            req.query.sCode =sCode ;
            req.query.infoId =infoId ;
            if(parentId && parentId!=null){
                req.query.parentId =parentId;
            }else{
                req.query.parentId =retJson.data.catId;
            }

            return secondPage.secondPageArticleDetail(req, res,next)
        });

}

router.get('/info/common', infoCommon);
router.get('/info/enrollPlan', infoCommon);
router.get('/info/majorScore', infoCommon);
router.get('/info/schoolEnroll', infoCommon);
router.get('/info/schoolInfo', infoCommon);
router.get('/info/departmentInfo', infoCommon);
router.get('/info/majorInfo', infoCommon);
//--------------------------------------------------------------------------------

//----------------------   PC端新旧链接处理   视频在线-08-------------------------------
function indexCode(req, res, next) {
    var sCode  = req.params.sCode;
    req.query.sCode =sCode ;
    // 错误情况处理

    return index.brifeEntity(req, res, next)

}

router.get('/index/:sCode', indexCode);
//--------------------------------------------------------------------------------

//----------------------   PC端新旧链接处理   视频在线-08-------------------------------
function infoVido(req, res, next) {
    var sCode  = req.params.sCode;
    req.query.sCode =sCode ;
    // 错误情况处理
    return secondPage.secondPageVideoOnline(req, res,next)

}

router.get('/info/vido/:sCode', infoVido);
//--------------------------------------------------------------------------------

//----------------------   PC端新旧链接处理  校园风采-08-------------------------------
function infoScenery(req, res, next) {
    var sCode  = req.params.sCode;
    req.query.sCode =sCode ;
    return secondPage.photoPage(req, res,next)

}
router.get('/info/scenery/:sCode', infoScenery);
//--------------------------------------------------------------------------------

//----------------------   PC端新旧链接处理    填报参考-10-------------------------------
function infoPreScore(req, res, next) {
    var sCode  = req.params.sCode;
    var apiUrl = API_BASE_URL +'/front/template/getCatInfoIdbyScode?sCode='+sCode+'&type=2';
    superagent.get(apiUrl)
        .end(function (err, res2) {
            if (err) {
                console.log("front.js request api err: " + err);
                return v5users.errorPage(req, res, next);
            }
            if (res2.text == "{}") {
                return v5users.cutOffPage(req, res, next);
            }
            // 后台返回数据错误, 直接继续404 // 返回空字符串。屏蔽网站
            if (res2.text.length < 2) {
                return v5users.errorPage(req, res, next);
            }

            var retJson = JSON.parse(res2.text);
            // 后台返回的数据为空
            if(!retJson.data || retJson.data == null || retJson.data.length == 0){
                return v5users.errorPage(req, res, next);
            }
            if(retJson.code =="000000"){
                var infoId = retJson.data.infoId;
                var parentId = retJson.data.catId;
                req.query.sCode =sCode ;
                req.query.infoId =infoId ;
                req.query.parentId =parentId ;
                return secondPage.secondPageArticleDetail(req, res,next)
            }else{
                return v5users.errorPage(req, res, next);
            }
        });

}

router.get('/info/preScore/:sCode', infoPreScore);





//----------------------   PC端新旧链接处理  常见问题  -11-------------------------------
function infoToFaqCatPage(req, res, next) {
    var sCode  = req.params.sCode;
    var apiUrl = API_BASE_URL +'/front/template/getCatInfoIdbyScode?sCode='+sCode+'&type=1';
    superagent.get(apiUrl)
        .end(function (err, res2) {
            if (err) {
                console.log("front.js request api err: " + err);
                return v5users.errorPage(req, res, next);
            }
            if (res2.text == "{}") {
                return v5users.cutOffPage(req, res, next);
            }
            // 后台返回数据错误, 直接继续404 // 返回空字符串。屏蔽网站
            if (res2.text.length < 2) {
                return v5users.errorPage(req, res, next);
            }

            var retJson = JSON.parse(res2.text);
            console.log(retJson);
            var catId = retJson.data.catId;
            req.query.sCode =sCode ;
            req.query.catId =catId ;

            return secondPage.secondPageArticleList(req, res,next)
        });

}

router.get('/info/toFaqCatPage/:sCode',infoToFaqCatPage);


//----------------------   PC端新旧链接处理  研究方向列表  -13-------------------------------
function infoMajorResearch(req, res, next) {
    var infoId = req.query.id;
    var apiUrl = API_BASE_URL +'/front/template/getScodeByInfoId?infoId='+infoId;
    superagent.get(apiUrl)
        .end(function (err, res2) {
            if (err) {
                console.log("front.js request api err: " + err);
                return v5users.errorPage(req, res, next);
            }
            if (res2.text == "{}") {
                return v5users.cutOffPage(req, res, next);
            }
            // 后台返回数据错误, 直接继续404 // 返回空字符串。屏蔽网站
            if (res2.text.length < 2) {
                return v5users.errorPage(req, res, next);
            }

            var retJson = JSON.parse(res2.text);
            var sCode = retJson.data.sCode;
            var parentId = retJson.data.catId;
            req.query.sCode =sCode ;
            req.query.infoId =infoId ;
            req.query.parentId =parentId ;

            return secondPage.secondPageArticleDetail(req, res,next)
        });
}

router.get('/info/majorResearch',infoMajorResearch);

//----------------------   PC端新旧链接处理  研究方向详情  -14-------------------------------
function infoMajorResearchDetail(req, res, next) {
    var infoId = req.query.id;
    var majorResearchId = req.query.majorResearchId;
    var apiUrl = API_BASE_URL +'/front/template/getScodeByInfoId?infoId='+infoId;
    superagent.get(apiUrl)
        .end(function (err, res2) {
            if (err) {
                console.log("front.js request api err: " + err);
                return v5users.errorPage(req, res, next);
            }
            if (res2.text == "{}") {
                return v5users.cutOffPage(req, res, next);
            }
            // 后台返回数据错误, 直接继续404 // 返回空字符串。屏蔽网站
            if (res2.text.length < 2) {
                return v5users.errorPage(req, res, next);
            }

            var retJson = JSON.parse(res2.text);
            // 请求回来的数据
            var sCode = retJson.data.sCode;
            var parentId = retJson.data.catId;

            req.query.sCode =sCode ;
            req.query.majorResearchId =majorResearchId ;
            req.query.parentId =parentId ;

            return secondPage.secondPageResearchDirectionDetail(req, res,next)
        });
}

router.get('/info/majorResearchDetail',infoMajorResearchDetail);

//----------------------   PC端新旧链接处理  专业详情  -15-------------------------------
function infoMajorDetail(req, res, next) {
    var infoId = req.query.id;
    var majorId = req.query.majorId;
    var apiUrl = API_BASE_URL +'/front/template/getScodeByInfoId?infoId='+infoId;
    superagent.get(apiUrl)
        .end(function (err, res2) {
            if (err) {
                console.log("front.js infoMajorDetail request api err: " + err);
                return v5users.errorPage(req, res, next);
            }
            if (res2.text == "{}") {
                return v5users.cutOffPage(req, res, next);
            }
            // 后台返回数据错误, 直接继续404 // 返回空字符串。屏蔽网站
            if (res2.text.length < 2) {
                return v5users.errorPage(req, res, next);
            }

            var retJson = JSON.parse(res2.text);
            var sCode = retJson.data.sCode;
            var catId = retJson.data.catId;
            req.query.sCode =sCode ;
            req.query.majorId =majorId ;
            req.query.catId =catId ;

            return secondPage.secondPageMajorDetail(req, res,next)
        });
}

router.get('/info/majorDetail',infoMajorDetail);


//----------------------   PC端新旧链接处理  院系详情  -16-------------------------------
function infoDepartmentDetail(req, res, next) {
    var infoId = req.query.id;
    var departmentId = req.query.departmentId;
    var apiUrl = API_BASE_URL +'/front/template/getScodeByInfoId?infoId='+infoId;
    superagent.get(apiUrl)
        .end(function (err, res2) {
            if (err) {
                console.log("front.js request api err: " + err);
                return v5users.errorPage(req, res, next);
            }
            if (res2.text == "{}") {
                return v5users.cutOffPage(req, res, next);
            }
            // 后台返回数据错误, 直接继续404 // 返回空字符串。屏蔽网站
            if (res2.text.length < 2) {
                return v5users.errorPage(req, res, next);
            }

            var retJson = JSON.parse(res2.text);
            var sCode = retJson.data.sCode;
            var catId = retJson.data.catId;
            req.query.sCode =sCode ;
            req.query.departmentId =departmentId ;
            req.query.catId =catId ;

            return secondPage.secondPageFacultyDetail(req, res,next)
        });
}

router.get('/info/departmentDetail',infoDepartmentDetail);

//----------------------   PC端新旧链接处理  登录页面  11-------------------------------
function toLogin(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode || "";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    req.query.sCode =sCode ;
    return secondPage.secondPageLogin(req, res,next)
}

router.get('/user/toLogin',toLogin);




module.exports = router;