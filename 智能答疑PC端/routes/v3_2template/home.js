var express = require('express');
var router = express.Router();
var v4templateHomeUtil = require('../util/v4templateHomeUtil');
var v5templateHomeUtil = require('../util/v5templateHomeUtil');


//渲染视频页面的配置
function videoOnlinePage(req, res, next) {
    //          视频在线信息请求接口
    var sCode =req.params.sCode|| req.query.sCode || req.body.sCode || 0;
    var curPage =req.params.curPage|| req.query.curPage || req.body.curPage || 0;
    var curPage = 1;
    var needPage = 'false';
    var userInfoJson = req.cookies.zndyKey;
    var userInfo = JSON.parse(userInfoJson || '{}');

    // 获取学校基本配置信息
    v5templateHomeUtil.findSchool(sCode, function (findSchoolErr, schoolInfo) {
        if (findSchoolErr) {
            console.log("v5templateHome.js [getDetailPage] findSchoolErr: " + findSchoolErr);
            var errMsg = "请求失败";
            errMsg = typeof findSchoolErr == 'string' ? findSchoolErr : errMsg;
            return v5templateHomeUtil.ret_json_func(0, errMsg, {}, res);
        }

        v5templateHomeUtil.getSchoolVidoList(sCode, curPage, needPage, function (err, data) {
            var video = data;
            var retJson = {
                sCode: sCode,
                video: video,
                schoolInfo: schoolInfo,
                userInfo: userInfo
            };
            retJson.host = "http://" + req.hostname;
            res.render('./v3_2template/videos', retJson);
        })

    });

}

router.get('/v3_2templateVideoOnline', videoOnlinePage);
router.post('/v3_2templateVideoOnline', videoOnlinePage);

router.videoOnlinePage = videoOnlinePage;


//渲染招录公告页面的配置
function v3_2getNoticeList(req, res, next) {
    var sCode = req.params.sCode || req.query.sCode || req.body.sCode || 0;
    var parentId = req.params.parentId || req.query.parentId || req.body.parentId || 0;
    // 当前页
    var curPage = req.params.curPage || req.query.curPage || req.body.curPage || 1;
    // 每页数量
    var pageSize = req.params.pageSize || req.query.pageSize || req.body.pageSize || 10;
    var schoolInfo = req.params.schoolInfo || req.query.schoolInfo || req.body.schoolInfo || "";
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

        retJson.host = "http://" + req.hostname;
        res.render('./v3_2template/noticeList.jade', retJson)
    })
}

router.get("/v3_2getNoticeList", v3_2getNoticeList);
router.post("/v3_2getNoticeList", v3_2getNoticeList);
router.v3_2getNoticeList = v3_2getNoticeList;


//渲染文章列表页面的配置

function v3_2templateSubList(req, res, next) {
    var sCode = req.params.sCode || req.query.sCode || req.body.sCode || 0;
    var parentId = req.params.parentId || req.query.parentId || req.body.parentId || req.query.catId || req.body.catId || 0;
    // 当前页
    var curPage = req.params.curPage || req.query.curPage || req.body.curPage || 1;
    // 每页数量
    var pageSize = req.params.pageSize || req.query.pageSize || req.body.pageSize || 10;
    var schoolInfo = req.params.schoolInfo || req.query.schoolInfo || req.body.schoolInfo || "";
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

        retJson.host = "http://" + req.hostname;
        res.render('./v3_2template/articleList.jade', retJson)
    })
}

router.get("/v3_2templateSubList", v3_2templateSubList);
router.post("/v3_2templateSubList", v3_2templateSubList);
router.v3_2templateSubList = v3_2templateSubList;


// 渲染详情页的配置
function getHomePage(req, res, next) {
    var sCode = req.params.sCode || req.query.sCode || req.body.sCode || "";
    var infoId = req.params.infoId || req.query.infoId || req.body.infoId || "";
    var parentId = req.params.parentId || req.query.parentId || req.body.parentId || "";

    var schoolInfo = req.params.schoolInfo || req.query.schoolInfo || req.body.schoolInfo || "";

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

        res.render("./v3_2template/articleDetail.jade", retJson)
    })
}

router.get("/v3_2getHomePage", getHomePage);
router.post("/v3_2getHomePage", getHomePage);
router.v3_2getHomePage = getHomePage;


// 渲染相册页面的配置
function getPhotos(req, res, next) {
    var sCode =req.params.sCode|| req.query.sCode || req.body.sCode || '';
    // var schoolInfo =req.query.schoolInfo || req.body.schoolInfo || "";
    var userInfoJson = req.cookies.zndyKey;
    var userInfo = JSON.parse(userInfoJson || '{}');

    v5templateHomeUtil.findSchool(sCode, function (err, schoolInfo) {
        var retJson = {
            sCode: sCode,
            schoolInfo: schoolInfo,
            userInfo: userInfo
        };
        retJson.host = "http://" + req.hostname;
        res.render('./v3_2template/schoolPhotos.jade', retJson)
    })
}

router.get('/v3_2getPhotos', getPhotos);
router.post('/v3_2getPhotos', getPhotos);
router.v3_2getPhotos = getPhotos;


// 渲染视频页面的配置
function getVideos(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode || '';
    var schoolInfo = req.query.schoolInfo || req.body.schoolInfo || "";
    var userInfoJson = req.cookies.zndyKey;
    var userInfo = JSON.parse(userInfoJson || '{}');

    var retJson = {
        sCode: sCode,
        schoolInfo: schoolInfo,
        userInfo: userInfo
    };
    retJson.host = "http://" + req.hostname;
    res.render('./v3_2template/videos.jade', retJson)
}

router.get('/v3_2getVideos', getVideos);
router.post('/v3_2getVideos', getVideos);
router.v3_2getVideos = getVideos;


// 渲染搜索页面的配置
function getSearchPage(req, res, next) {
    var sCode =req.params.sCode|| req.query.sCode || req.body.sCode || '';
    var question =req.params.question|| req.query.question || req.body.question || '';
    var parentId =req.params.parentId|| req.query.parentId || req.body.parentId || '';
    var schoolInfo =req.params.schoolInfo|| req.query.schoolInfo || req.body.schoolInfo || "";
    var userInfoJson = req.cookies.zndyKey;
    var userInfo = JSON.parse(userInfoJson || '{}');

    v5templateHomeUtil.findSchool(sCode, function (err, schoolInfo) {
        if (err) {
            // 失败
            return;
        }
        var retJson = {
            sCode: sCode,
            question: question,
            parentId: parentId,
            schoolInfo: schoolInfo,
            userInfo: userInfo
        };

        retJson.host = "http://" + req.hostname;
        res.render('./v3_2template/searchPage.jade', retJson)
    })
}

router.get('/v3_2getSearchPage', getSearchPage);
router.post('/v3_2getSearchPage', getSearchPage);
router.v3_2getSearchPage = getSearchPage;


// 渲染院系详情页面的配置
function getCollegeInfo(req, res, next) {
    var sCode =req.params.sCode|| req.query.sCode || req.body.sCode || '';
    var parentId =req.params.parentId|| req.query.parentId || req.body.parentId || '';
    var infoId =req.params.infoId|| req.query.infoId || req.body.infoId || '';
    var schoolInfo = req.query.schoolInfo || req.body.schoolInfo || "";
    var departId =req.params.departmentId|| req.query.departId || req.body.departId || "";
    var userInfoJson = req.cookies.zndyKey;
    var userInfo = JSON.parse(userInfoJson || '{}');

    v5templateHomeUtil.findSchool(sCode, function (err, schoolInfo) {

        if (err) {
            // 失败
            return;
        }

        var retJson = {
            sCode: sCode,
            schoolInfo: schoolInfo,
            parentId: parentId,
            departId: departId,
            infoId: infoId,
            userInfo: userInfo
        };

        retJson.host = "http://" + req.hostname;
        res.render('./v3_2template/collegeInfo.jade', retJson)

    })


}

router.get('/v3_2getCollegeInfo', getCollegeInfo);
router.post('/v3_2getCollegeInfo', getCollegeInfo);
router.v3_2getCollegeInfo = getCollegeInfo;


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


    v5templateHomeUtil.findSchool(sCode, function (err, schoolInfo) {

        if (err) {
            // 失败
            return;
        }

        var retJson = {
            sCode: sCode,
            schoolInfo: schoolInfo,
            parentId: parentId,
            majorId: majorId,
            infoId: infoId,
            userInfo: userInfo
        };

        retJson.host = "http://" + req.hostname;
        res.render('./v3_2template/majorInfo.jade', retJson)


    })


}

router.get('/v3_2getMajorInfo', getMajorInfo);
router.post('/v3_2getMajorInfo', getMajorInfo);
router.v3_2getMajorInfo = getMajorInfo;


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
            userInfo: userInfo
        };

        retJson.host = "http://" + req.hostname;
        res.render('./v3_2template/researchInfo.jade', retJson)
    });


}

router.get('/v3_2getResearchInfo', getResearchInfo);
router.post('/v3_2getResearchInfo', getResearchInfo);
router.v3_2getResearchInfo = getResearchInfo;


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

    retJson.host = "http://" + req.hostname;
    res.render('./v4template/collegeAdmission.jade', retJson)
}

router.get('/v4getCollegeAdmission', getCollegeAdmission);
router.post('/v4getCollegeAdmission', getCollegeAdmission);
router.v4getCollegeAdmission = getCollegeAdmission;


module.exports = router;
