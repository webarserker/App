/**
 * Created by liuyang on 2017/7/25.
 */

var express = require('express');
var router = express.Router();
var v4templateHomeUtil = require('../util/v4templateHomeUtil');
var v5templateHomeUtil = require('../util/v5templateHomeUtil');


//渲染视频页面的配置
function videoOnlinePage(req,res,next){
    //          视频在线信息请求接口
    var sCode =req.params.sCode|| req.query.sCode || req.body.sCode || 0;
    var curPage =req.params.curPage|| req.query.curPage || req.body.curPage || 0;
    var curPage = 1;
    var needPage = 'false';
    var userInfoJson = req.cookies.zndyKey;
    var userInfo = JSON.parse(userInfoJson || '{}');

    // 获取学校基本配置信息
    v5templateHomeUtil.findSchool(sCode, function(findSchoolErr, schoolInfo){
        if(findSchoolErr) {
            console.log("v5templateHome.js [getDetailPage] findSchoolErr: " + findSchoolErr);
            var errMsg = "请求失败";
            errMsg = typeof findSchoolErr == 'string' ? findSchoolErr : errMsg;
            return v5templateHomeUtil.ret_json_func(0,errMsg,{},res);
        }

        v5templateHomeUtil.getSchoolVidoList(sCode,curPage,needPage,function(err,data){
            var video=data;
            var retJson = {
                sCode: sCode,
                video : video,
                schoolInfo : schoolInfo,
                userInfo:userInfo
            };
            retJson.host = "http://"+req.hostname;
            res.render('./v4template/videos',retJson);
        })

    });

}
router.get('/v4templateVideoOnline',videoOnlinePage);
router.post('/v4templateVideoOnline',videoOnlinePage);

router.videoOnlinePage =videoOnlinePage;



//渲染招录公告页面的配置
function v4getNoticeList(req,res,next){
    var sCode =req.params.sCode|| req.query.sCode || req.body.sCode || 0;
    var parentId =req.params.parentId|| req.query.parentId || req.body.parentId || 0;
    // 当前页
    var curPage =req.params.curPage|| req.query. curPage|| req.body.curPage || 1;
    // 每页数量
    var pageSize =req.params.pageSize|| req.query. pageSize|| req.body.pageSize ||10;
    var schoolInfo = req.query.schoolInfo || req.body.schoolInfo || "";
    var userInfoJson = req.cookies.zndyKey;
    var userInfo = JSON.parse(userInfoJson || '{}');

    v5templateHomeUtil.findSchool(sCode, function (err, data) {

        if (err) {
            // 失败
            return;
        }
        var retJson = {
            sCode: sCode,
            parentId: parentId,
            curPage: curPage,
            pageSize: pageSize,
            schoolInfo: data,
            userInfo: userInfo
        };

        retJson.host = "http://"+req.hostname;
        res.render('./v4template/noticeList.jade', retJson)
    })
}
router.get("/v4getNoticeList", v4getNoticeList);
router.post("/v4getNoticeList", v4getNoticeList);
router.v4getNoticeList = v4getNoticeList;


//渲染文章列表页面的配置

function v4templateSubList(req,res,next){
    var sCode =req.params.sCode|| req.query.sCode || req.body.sCode || 0;
    var parentId =req.params.parentId|| req.query.parentId || req.body.parentId || req.query.catId || req.body.catId ||0;
    // 当前页
    var curPage =req.params.curPage|| req.query. curPage|| req.body.curPage || 1;
    // 每页数量
    var pageSize =req.params.pageSize|| req.query. pageSize|| req.body.pageSize ||10;
    var schoolInfo = req.query.schoolInfo || req.body.schoolInfo || "";
    var userInfoJson = req.cookies.zndyKey;
    var userInfo = JSON.parse(userInfoJson || '{}');

    v5templateHomeUtil.findSchool(sCode, function (err, data) {

        if (err) {
            // 失败
            return;
        }
        var retJson = {
            sCode: sCode,
            parentId: parentId,
            curPage: curPage,
            pageSize: pageSize,
            schoolInfo: data,
            userInfo: userInfo
        };

        retJson.host = "http://"+req.hostname;
        res.render('./v4template/articleList.jade', retJson)
    })
}
router.get("/v4templateSubList", v4templateSubList);
router.post("/v4templateSubList", v4templateSubList);
router.v4templateSubList = v4templateSubList;


// 渲染详情页的配置
function getHomePage(req, res, next) {
    var sCode  = req.params.sCode|| req.query.sCode || req.body.sCode;   // 学校code
    var infoId  = req.params.infoId|| req.query.infoId || req.body.infoId;
    var parentId  = req.params.parentId|| req.query.parentId || req.body.parentId;

    var schoolInfo = req.query.schoolInfo || req.body.schoolInfo || "";

    v4templateHomeUtil.getInfoContentDetail(infoId, parentId, sCode, function (err, contentDetail) {
        var retJson = {};
        if (contentDetail) {
            retJson = {
                sCode: sCode,
                infoId: infoId,
                parentId: parentId,
                schoolInfo: schoolInfo,
                specType: contentDetail.specType
            }
        } else {
            retJson = {
                sCode: sCode,
                infoId: infoId,
                parentId: parentId,
                schoolInfo: schoolInfo
            }
        }


        // 尝试获取用户登录信息
        var userInfoJson = req.cookies.zndyKey;
        if (userInfoJson && userInfoJson.length > 2) {
            var userInfo = JSON.parse(userInfoJson || '{}');
            retJson.userInfo = userInfo;
        }

        res.render("./v4template/articleDetail.jade", retJson)
    })
}

router.get("/v4getHomePage", getHomePage);
router.post("/v4getHomePage", getHomePage);
router.v4getHomePage = getHomePage;


// 渲染相册页面的配置
function getPhotos(req, res, next) {
    var sCode =req.params.sCode|| req.query.sCode || req.body.sCode || '';
    var schoolInfo =req.params.schoolInfo|| req.query.schoolInfo || req.body.schoolInfo || "";
    var userInfoJson = req.cookies.zndyKey;
    var userInfo = JSON.parse(userInfoJson || '{}');

    var retJson = {
        sCode: sCode,
        schoolInfo: schoolInfo,
        userInfo:userInfo
    };
    retJson.host = "http://"+req.hostname;
    res.render('./v4template/schoolPhotos.jade', retJson)
}

router.get('/v4getPhotos', getPhotos);
router.post('/v4getPhotos', getPhotos);
router.v4getPhotos = getPhotos;


// 渲染视频页面的配置
function getVideos(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode || '';
    var schoolInfo = req.query.schoolInfo || req.body.schoolInfo || "";
    var userInfoJson = req.cookies.zndyKey;
    var userInfo = JSON.parse(userInfoJson || '{}');

    var retJson = {
        sCode: sCode,
        schoolInfo: schoolInfo,
        userInfo:userInfo
    };
    retJson.host = "http://"+req.hostname;
    res.render('./v4template/videos.jade', retJson)
}

router.get('/v4getVideos', getVideos);
router.post('/v4getVideos', getVideos);
router.v4getVideos = getVideos;


// 渲染搜索页面的配置
function getSearchPage(req, res, next) {
    var sCode =req.params.sCode|| req.query.sCode || req.body.sCode || '';
    var question =req.params.question|| req.query.question || req.body.question || '';
    var parentId =req.params.parentId|| req.query.parentId || req.body.parentId || '';
    var schoolInfo =req.params.schoolInfo|| req.query.schoolInfo || req.body.schoolInfo || "";
    var userInfoJson = req.cookies.zndyKey;
    var userInfo = JSON.parse(userInfoJson || '{}');


    var retJson = {
        sCode: sCode,
        question: question,
        parentId: parentId,
        schoolInfo: schoolInfo,
        userInfo:userInfo
    };

    retJson.host = "http://"+req.hostname;
    res.render('./v4template/searchPage.jade', retJson)
}

router.get('/v4getSearchPage', getSearchPage);
router.post('/v4getSearchPage', getSearchPage);
router.v4getSearchPage = getSearchPage;


// 渲染院系列表页面的配置
// function getCollegeList(req, res, next) {
//     var sCode = req.query.sCode || req.body.sCode || '';
//     var parentId = req.query.parentId || req.body.parentId || '';
//     var schoolInfo = req.query.schoolInfo || req.body.parentId || "";
//
//     var retJson = {
//         sCode: sCode,
//         schoolInfo: schoolInfo,
//         parentId: parentId
//     }
//
//     res.render('./v4template/collegeList.jade', retJson)
// }
//
// router.get('/v4getCollegeList', getCollegeList);
// router.post('/v4getCollegeList', getCollegeList);
// router.v4getCollegeList = getCollegeList;

// 渲染专业列表页面的配置
// function getMajorList(req, res, next) {
//     var sCode = req.query.sCode || req.body.sCode || '';
//     var parentId = req.query.parentId || req.body.parentId || '';
//     var schoolInfo = req.query.schoolInfo || req.body.parentId || "";
//
//     var retJson = {
//         sCode: sCode,
//         schoolInfo: schoolInfo,
//         parentId: parentId
//     }
//
//     res.render('./v4template/majorList.jade', retJson)
// }
//
// router.get('/v4getMajorList', getMajorList);
// router.post('/v4getMajorList', getMajorList);
// router.v4getMajorList = getMajorList;


// 渲染院系详情页面的配置
function getCollegeInfo(req, res, next) {
    var sCode =req.params.sCode|| req.query.sCode || req.body.sCode || '';
    var parentId =req.params.parentId|| req.query.parentId || req.body.parentId || '';
    var infoId =req.params.infoId|| req.query.infoId || req.body.infoId || '';
    var schoolInfo =req.params.schoolInfo|| req.query.schoolInfo || req.body.schoolInfo || "";
    var departId =req.params.departmentId|| req.query.departId || req.body.departId || "";
    var userInfoJson = req.cookies.zndyKey;
    var userInfo = JSON.parse(userInfoJson || '{}');

    var retJson = {
        sCode: sCode,
        schoolInfo: schoolInfo,
        parentId: parentId,
        departId: departId,
        infoId: infoId,
        userInfo:userInfo
    };

    retJson.host = "http://"+req.hostname;
    res.render('./v4template/collegeInfo.jade', retJson)
}

router.get('/v4getCollegeInfo', getCollegeInfo);
router.post('/v4getCollegeInfo', getCollegeInfo);
router.v4getCollegeInfo = getCollegeInfo;



// 渲染专业详情页面的配置
function getMajorInfo(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");   //设置跨域访问
    var sCode =req.params.sCode|| req.query.sCode || req.body.sCode || '';
    var parentId =req.params.parentId|| req.query.parentId || req.body.parentId || '';
    var infoId =req.params.infoId|| req.query.infoId || req.body.infoId || '';
    var schoolInfo =req.params.schoolInfo|| req.query.schoolInfo || req.body.schoolInfo || "";
    var majorId =req.params.majorId|| req.query.majorId || req.body.majorId || "";
    var userInfoJson = req.cookies.zndyKey;
    var userInfo = JSON.parse(userInfoJson || '{}');

    var retJson = {
        sCode: sCode,
        schoolInfo: schoolInfo,
        parentId: parentId,
        majorId: majorId,
        infoId: infoId,
        userInfo:userInfo
    };

    retJson.host = "http://"+req.hostname;
    res.render('./v4template/majorInfo.jade', retJson)
}

router.get('/v4getMajorInfo', getMajorInfo);
router.post('/v4getMajorInfo', getMajorInfo);
router.v4getMajorInfo = getMajorInfo;



// 渲染研究方向详情页面的配置
function getResearchInfo(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");   //设置跨域访问
    var sCode =req.params.sCode|| req.query.sCode || req.body.sCode || '';
    var parentId =req.params.parentId|| req.query.parentId || req.body.parentId || '';
    var infoId =req.params.infoId|| req.query.infoId || req.body.infoId || '';
    // var schoolInfo = req.query.schoolInfo || req.body.schoolInfo || "";
    var majorResearchId =req.params.majorResearchId|| req.query.majorResearchId || req.body.majorResearchId || "";
    var userInfoJson = req.cookies.zndyKey;
    var userInfo = JSON.parse(userInfoJson || '{}');



    v5templateHomeUtil.findSchool(sCode, function (err, data) {

        if (err) {
            // 失败
            return;
        }
        var retJson = {
            sCode: sCode,
            schoolInfo: data,
            parentId: parentId,
            majorResearchId: majorResearchId,
            infoId: infoId,
            userInfo:userInfo
        };

        retJson.host = "http://"+req.hostname;
        res.render('./v4template/researchInfo.jade', retJson)
    });






}

router.get('/v4getResearchInfo', getResearchInfo);
router.post('/v4getResearchInfo', getResearchInfo);
router.v4getResearchInfo = getResearchInfo;


// 渲染院系录取页面的配置
function getCollegeAdmission(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode || '';
    var parentId = req.query.parentId || req.body.parentId || '';
    var infoId = req.query.infoId || req.body.infoId || '';
    var schoolInfo = req.query.schoolInfo || req.body.schoolInfo || "";

    var retJson = {
        sCode: sCode,
        schoolInfo: schoolInfo,
        parentId: parentId,
        infoId: infoId
    };

    retJson.host = "http://"+req.hostname;
    res.render('./v4template/collegeAdmission.jade', retJson)
}

router.get('/v4getCollegeAdmission', getCollegeAdmission);
router.post('/v4getCollegeAdmission', getCollegeAdmission);
router.v4getCollegeAdmission = getCollegeAdmission;


module.exports = router;
