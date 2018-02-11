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

// 移动端的配置

var MOBILE_BASE_URL = CONFIG.MOBILE_SERVER_FULL_URL;

// v5.0 模板二级页面
var v5templateHome = require('./v5template/v5templateHome');
var v5users = require('./v5template/v5users');
// v4.0 模板二级页面
var home = require('./v4template/home');

//v3.2摸版二级页面
var v3_2home=require('./v3_2template/home');

/* 4.1 二级页面v4_1ArticleDetail*/
var v4_1ArticleDetail = require('./v4_1template/v4_1ArticleDetail');



// v3_1模版
var v3_1home = require('./v3_1template/v3_1home');
var v3_1users = require('./v3_1template/v3_1users');


/* GET users listing. */
router.get('/', function (req, res, next) {





    res.send('respond with a resource');
});
/*  移动端 PC端的链接跳转
*   有文章详情, 专业详情,院系详情,视频在线, 链接已做处理
*   常见问题 有单独的页面.但有一些数据需做处理,此项待解决.需后续处理
*   填报参考,由于未有单独的页面.此项待解决, 需后续处理
* */
/*  PC端新旧链接做处理
*
* */
//----------------------  判断二级页面文章详情--------------------------------
function secondPageArticleDetail(req, res, next) {
    var viewSourceUrl = req.headers['referer'];
    var sCode  = req.params.sCode|| req.query.sCode || req.body.sCode;   // 学校code
    var infoId  = req.params.infoId|| req.query.infoId || req.body.infoId;
    var parentId  = req.params.parentId|| req.query.parentId || req.body.parentId;
    var spreadToken = req.params.spreadToken || req.query.spreadToken || req.body.spreadToken || '';
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求 请求学校基本信息
    v5templateHomeUtil.findSchool(sCode, function (err, data) {
        req.query.schoolInfo = data;
        if (err) {
            return;
            // 失败
        }
        var templateKey = data.template;
        var sCode = data.code;
        // 识别移动端 pc端
        var userAgent = req.headers['user-agent'];
        var ua = useragent.parse(userAgent);
        // 移动端和pc端识别 处理
        if(ua.isiPhone || ua.isiPad || ua.isiPod||ua.isAndroid || ua.isAndroidTablet){
            var url= MOBILE_BASE_URL+'/build/index.html?scode='+sCode+'#/articleDetail?infoId='+infoId+'&catId='+parentId+'&viewSourceUrl='+viewSourceUrl;
            if(spreadToken) {
                url += '&spreadToken='+spreadToken;
            }
            return res.redirect(url);
        }else{
            if (templateKey == 'v5.0') {
                return v5templateHome.getDetailPage(req, res, next)
            } else if (templateKey == 'v4.0') {
                return home.v4getHomePage(req, res, next)
            } else if(templateKey == 'v4.1') {
                return v4_1ArticleDetail.v4getHomePage(req,res,next);
            } else if(templateKey == 'v3.1'){
                return v3_1home.getDetailPage(req, res, next)
            }else if(templateKey == 'v3.2'){
                return v3_2home.v3_2getHomePage(req,res,next);
            } else {
                return v5users.errorPage(req, res, next);
            }
        }
    });


}

router.get('/detail/:sCode/:infoId/:parentId', secondPageArticleDetail);
router.post('/detail/:sCode/:infoId/:parentId', secondPageArticleDetail);
router.secondPageArticleDetail = secondPageArticleDetail;


//--------------------------------------------------------------------------






// 院系详情页面的跳转配置
function secondPageCollegeInfo(req, res, next) {
    var viewSourceUrl = req.headers['referer'];
    var sCode = req.query.sCode || req.body.sCode || "";
    var departmentId = req.query.departmentId || req.body.departmentId || "";
    var spreadToken = req.params.spreadToken || req.query.spreadToken || req.body.spreadToken || '';
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {
        req.query.schoolInfo = data;

        if (err) {
            return;
            // 失败
        }
        var templateKey = data.template;
        var sCode = data.code;
        // 识别移动端 pc端
        var userAgent = req.headers['user-agent'];
        var ua = useragent.parse(userAgent);
        // 移动端和pc端识别 处理
        if(ua.isiPhone || ua.isiPad || ua.isiPod||ua.isAndroid || ua.isAndroidTablet){
            var url = MOBILE_BASE_URL+'/build/index.html?scode='+sCode+'#/articleDetail2?specType=schoolDetail&sId='+departmentId+'&viewSourceUrl='+viewSourceUrl;
            if(spreadToken) {
                url += '&spreadToken='+spreadToken;
            }
            return res.redirect(url);
        }else{
            if (templateKey == 'v5.0') {
                // todo
            } else if (templateKey == 'v4.0') {
                return home.v4getCollegeInfo(req, res, next)
            } else if(templateKey == 'v4.1') {
                return v4_1ArticleDetail.v4getCollegeInfo(req,res,next);
            } else{
                return v5users.errorPage(req, res, next);
            }
        }
    });
}

router.get('/secondPageCollegeInfo', secondPageCollegeInfo);
router.post('/secondPageCollegeInfo', secondPageCollegeInfo);



// 专业详情页面的跳转配置
function secondPageMajorInfo(req, res, next) {
    var viewSourceUrl =  req.headers['referer'];
    var sCode = req.query.sCode || req.body.sCode || "";
    var majorId =req.query.majorId || req.body.majorId || "";
    var spreadToken = req.params.spreadToken || req.query.spreadToken || req.body.spreadToken || '';
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {
        req.query.schoolInfo = data;

        if (err) {
            return;
            // 失败
        }
        var templateKey = data.template;
        var sCode = data.code;
        // 识别移动端 pc端
        var userAgent = req.headers['user-agent'];
        var ua = useragent.parse(userAgent);
        // 移动端和pc端识别 处理
        if(ua.isiPhone || ua.isiPad || ua.isiPod||ua.isAndroid || ua.isAndroidTablet){
            var url = MOBILE_BASE_URL+'/build/index.html?scode='+sCode+'#/articleDetail2?specType=0&tid='+majorId+'&viewSourceUrl='+viewSourceUrl;
            if(spreadToken) {
                url += '&spreadToken='+spreadToken;
            }
            return res.redirect(url);
        }else{
            if (templateKey == 'v5.0') {
                // todo
            } else if (templateKey == 'v4.0') {
                return home.v4getMajorInfo(req, res, next)
            } else if(templateKey == 'v4.1') {
                return v4_1ArticleDetail.v4getMajorInfo(req,res,next);
            } else{
                return v5users.errorPage(req, res, next);
            }
        }
    });
}

router.get('/secondPageMajorInfo', secondPageMajorInfo);
router.post('/secondPageMajorInfo', secondPageMajorInfo);







// 院系录取的跳转配置
function secondPageCollegeAdmission(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode || "";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {
        req.query.schoolInfo = data;

        if (err) {
            return;
            // 失败
        }
        var templateKey = data.template;
        if (templateKey == 'v5.0') {
            // todo
        } else if (templateKey == 'v4.0') {
        }
    });
}

router.get('/secondPageCollegeAdmission', secondPageCollegeAdmission);
router.post('/secondPageCollegeAdmission', secondPageCollegeAdmission);





// 招录公告的跳转配置
function secondNoticeList(req, res, next) {
    var viewSourceUrl = req.headers['referer'];
    var sCode = req.query.sCode || req.body.sCode ||  req.params.sCode||"";
    var spreadToken = req.params.spreadToken || req.query.spreadToken || req.body.spreadToken || '';
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {
        req.query.schoolInfo = data;

        if (err) {
            return;
            // 失败
        }
        var templateKey = data.template;
        var sCode = data.code;
        // 识别移动端 pc端
        var userAgent = req.headers['user-agent'];
        var ua = useragent.parse(userAgent);
        // 移动端和pc端识别 处理
        if(ua.isiPhone || ua.isiPad || ua.isiPod||ua.isAndroid || ua.isAndroidTablet){
            var url = MOBILE_BASE_URL+'/build/index.html?scode='+sCode+'#/noticeList?name='+'招录公告'+'&viewSourceUrl='+viewSourceUrl;
            if(spreadToken) {
                url += '&spreadToken='+spreadToken;
            }
            return res.redirect(url);
        }else {
            if (templateKey == 'v5.0') {
                // todo
            } else if (templateKey == 'v4.0') {
                return home.v4getNoticeList(req, res, next)
            } else if (templateKey == 'v4.1') {
                return v4_1ArticleDetail.v4_1getNoticeList(req, res, next)
            } else if (templateKey == 'v3.1') {
                return v3_1home.recruitment(req, res, next)
            } else if (templateKey == 'v3.2') {
                return v3_2home.v3_2getNoticeList(req, res, next);
            }
        }
    });
}

router.get('/notice/:sCode', secondNoticeList);
router.post('/notice/:sCode', secondNoticeList);




// 学校相册页面的跳转配置
function secondePageSchoolPhotos(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode || "";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {
        req.query.schoolInfo = data;

        if (err) {
            return;
            // 失败
        }
        var templateKey = data.template;
        if (templateKey == 'v5.0') {
            // todo
        } else if (templateKey == 'v4.0') {
            return home.v4getPhotos(req, res, next)
        } else if(templateKey == 'v4.1') {
            return v4_1ArticleDetail.v4getPhotos(req,res,next);
        }
    });
}

router.get('/secondPageSchoolPhotos', secondePageSchoolPhotos);
router.post('/secondPageSchoolPhotos', secondePageSchoolPhotos);


//学校视频页面的跳转配置
function secondePageVideos(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode || "";
    var spreadToken = req.params.spreadToken || req.query.spreadToken || req.body.spreadToken || '';
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {
        req.query.schoolInfo = data;

        if (err) {
            return;
            // 失败
        }
        var templateKey = data.template;
        var sCode = data.code;
        // 识别移动端 pc端
        var userAgent = req.headers['user-agent'];
        var ua = useragent.parse(userAgent);
        // 移动端和pc端识别 处理
        if(ua.isiPhone || ua.isiPad || ua.isiPod||ua.isAndroid || ua.isAndroidTablet){
            var url = MOBILE_BASE_URL+'/build/index.html?scode='+sCode+'#/videoList';
            if(spreadToken) {
                url += '?spreadToken='+spreadToken;
            }
            return res.redirect(url);
        }else{
            if (templateKey == 'v5.0') {
                // todo
            } else if (templateKey == 'v4.0') {
                return home.v4getVideos(req, res, next)
            }else if(templateKey == 'v3.2'){
                return v3_2home.v3_2getVideos(req,res,next);
            } else if(templateKey == 'v4.1') {
                return v4_1ArticleDetail.v4getVideos(req,res,next);
            }
        }
    });
}

router.get('/secondPageVideos', secondePageVideos);
router.post('/secondPageVideos', secondePageVideos);


//搜索页面的跳转配置
function secondePageSearchpage(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode || "";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {
        req.query.schoolInfo = data;

        if (err) {
            return;
            // 失败
        }
        var templateKey = data.template;
        if (templateKey == 'v5.0') {
            // todo
        } else if (templateKey == 'v4.0') {
            return home.v4getSearchPage(req, res, next)
        } else if(templateKey == 'v4.1') {
            return v4_1ArticleDetail.v4getSearchPage(req,res,next);
        }
    });
}

router.get('/secondePageSearchpage', secondePageSearchpage);
router.post('/secondePageSearchpage', secondePageSearchpage);


// -----------判断二级页面文章列表------------------------------------

function secondPageArticleList(req, res, next) {
    var orrginalUrl = req.originalUrl;
    var viewSourceUrl = req.headers['referer'];
    console.log(orrginalUrl);
    var sCode = req.params.sCode|| req.query.sCode || req.body.sCode;
    var catId = req.query.catId || req.body.catId || req.query.parentId || req.body.parentId||req.params.parentId|| 0;
    var spreadToken = req.params.spreadToken || req.query.spreadToken || req.body.spreadToken || '';
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {

        if (err) {
            // 失败
            return;
        }
        var templateKey = data.template;
        // 识别移动端 pc端
        var userAgent = req.headers['user-agent'];
        var ua = useragent.parse(userAgent);
        // 移动端和pc端识别 处理
        if(ua.isiPhone || ua.isiPad || ua.isiPod||ua.isAndroid || ua.isAndroidTablet){
            var url= MOBILE_BASE_URL+'/build/index.html?scode='+sCode+'#/articleList?catId='+catId+'&viewSourceUrl='+viewSourceUrl;
            if(spreadToken) {
                url += '&spreadToken='+spreadToken;
            }
            return res.redirect(url);
        }else {
            if (templateKey == 'v5.0') {
                return v5templateHome.v5templateSubList01(req, res, next)
            } else if (templateKey == 'v4.0') {
                return home.v4templateSubList(req, res, next);
            } else if (templateKey == 'v4.1') {
                return v4_1ArticleDetail.v4_1templateSubList(req, res, next);
            } else if (templateKey == "v3.1") {
                return v3_1home.v5templateSubList01(req, res, next)
            } else if (templateKey == "v3.2") {
                return v3_2home.v3_2templateSubList(req, res, next)
            } else {
                return v5users.errorPage(req, res, next);
            }
        }
    });

}

router.get('/list/:sCode/:parentId', secondPageArticleList);
router.post('/list/:sCode/:parentId', secondPageArticleList);
router.secondPageArticleList = secondPageArticleList;

//---------------------------------------------------------------------------------------

//----------判断二级页面  视频在线-----------------------------------------------------------

function secondPageVideoOnline(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode || req.params.sCode||"";
    var spreadToken = req.params.spreadToken || req.query.spreadToken || req.body.spreadToken || '';
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {

        if (err) {
            // 失败
            return;
        }
        var templateKey = data.template;
        var sCode = data.code;
        // 识别移动端 pc端
        var userAgent = req.headers['user-agent'];
        var ua = useragent.parse(userAgent);
        // 移动端和pc端识别 处理
        if(ua.isiPhone || ua.isiPad || ua.isiPod||ua.isAndroid || ua.isAndroidTablet){
            var url = MOBILE_BASE_URL+'/build/index.html?scode='+sCode+'#/videoList';
            if(spreadToken) {
                url += '?spreadToken='+spreadToken;
            }
            return res.redirect(url);
        }else{
            if (templateKey == 'v5.0') {
                return v5templateHome.videoOnlinePage(req, res, next)
            } else if (templateKey == 'v4.0') {
                return home.videoOnlinePage(req,res,next);
            } else if(templateKey == 'v4.1'){
                return v4_1ArticleDetail.v4_1templateVideoOnline(req,res,next);
            } else if(templateKey == 'v3.1'){
                return v3_1home.videoOnlinePage(req, res, next)
            }else if(templateKey == 'v3.2'){
                return v3_2home.videoOnlinePage(req, res, next)
            } else{
                return v5users.errorPage(req, res, next);
            }
        }
    });

}

router.get('/video/:sCode', secondPageVideoOnline);
router.post('/video/:sCode', secondPageVideoOnline);
router.secondPageVideoOnline = secondPageVideoOnline;


//-----------判断二级页面  校园风采---------------------------------------------------------------------------

function photoPage(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode || req.params.sCode||"";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {

        if (err) {
            // 失败
            return;
        }
        var templateKey = data.template;
        if (templateKey == 'v5.0') {
            return v5templateHome.photoPage(req, res, next)
        } else if (templateKey == 'v4.0') {
            return home.v4getPhotos(req, res, next)
        } else if(templateKey == 'v4.1') {
            return v4_1ArticleDetail.v4getPhotos(req,res,next);
        }else if(templateKey == 'v3.1'){
            return v3_1home.photoPage(req, res, next)
        } else if(templateKey == 'v3.2'){
            return v3_2home.v3_2getPhotos(req, res, next)
        } else{
            return v5users.errorPage(req, res, next);
        }
    });

}

router.get('/photo/:sCode', photoPage);
router.post('/photo/:sCode', photoPage);
router.photoPage = photoPage;








//-------------判断二级页面   专业详情-----------------------------------------------------------------
function secondPageMajorDetail(req, res, next) {
     var viewSourceUrl = req.headers['referer'];
    var sCode = req.query.sCode || req.body.sCode || req.params.sCode||"";
    var majorId =req.query.majorId || req.body.majorId ||req.params.majorId|| "";
    var spreadToken = req.params.spreadToken || req.query.spreadToken || req.body.spreadToken || '';
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {

        if (err) {
            // 失败
            return;
        }
        var templateKey = data.template;
        var sCode = data.code;
        // 识别移动端 pc端
        var userAgent = req.headers['user-agent'];
        var ua = useragent.parse(userAgent);
        // 移动端和pc端识别 处理
        if(ua.isiPhone || ua.isiPad || ua.isiPod||ua.isAndroid || ua.isAndroidTablet){
            var url = MOBILE_BASE_URL+'/build/index.html?scode='+sCode+'#/articleDetail2?specType=0&tid='+majorId+'&viewSourceUrl='+viewSourceUrl;
            if(spreadToken) {
                url += '&spreadToken='+spreadToken;
            }
            return res.redirect(url);
        }else{
            if (templateKey == 'v5.0') {
                return v5templateHome.professionalDetailPage(req, res, next)
            } else if (templateKey == 'v4.0') {
                return home.v4getMajorInfo(req, res, next)
            } else if(templateKey == 'v4.1') {
                return v4_1ArticleDetail.v4getMajorInfo(req,res,next);
            }else if(templateKey == 'v3.1'){
                return v3_1home.professionalDetailPage(req, res, next)
            }else if (templateKey == 'v3.2') {
                return v3_2home.v3_2getMajorInfo(req, res, next)
            } else{
                return v5users.errorPage(req, res, next);
            }
        }

    });

}

router.get('/major/:sCode/:majorId/:parentId', secondPageMajorDetail);
router.post('/major/:sCode/:majorId/:parentId', secondPageMajorDetail);
router.secondPageMajorDetail = secondPageMajorDetail;
//-----------------------------------------------------------------------------------------


//-------------判断二级页面   院系详情-----------------------------------------------------------------
function secondPageFacultyDetail(req, res, next) {
    var viewSourceUrl = req.headers['referer'];
    var sCode = req.query.sCode || req.body.sCode ||req.params.sCode|| "";
    var departmentId = req.query.departmentId || req.body.departmentId || req.params.departmentId||"";
    var spreadToken = req.params.spreadToken || req.query.spreadToken || req.body.spreadToken || '';
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {

        if (err) {
            // 失败
            return;
        }
        var templateKey = data.template;
        var sCode = data.code;
        // 识别移动端 pc端
        var userAgent = req.headers['user-agent'];
        var ua = useragent.parse(userAgent);
        // 移动端和pc端识别 处理
        if(ua.isiPhone || ua.isiPad || ua.isiPod||ua.isAndroid || ua.isAndroidTablet){
            var url = MOBILE_BASE_URL+'/build/index.html?scode='+sCode+'#/articleDetail2?specType=schoolDetail&sId='+departmentId+'&viewSourceUrl='+viewSourceUrl;
            if(spreadToken) {
                url += '&spreadToken='+spreadToken;
            }
            return res.redirect(url);
        }else{
            if (templateKey == 'v5.0') {
                return v5templateHome.facultyDetail(req, res, next)
            } else if (templateKey == 'v4.0') {
                return home.v4getCollegeInfo(req, res, next)
            } else if (templateKey == 'v4.1'){
                return v4_1ArticleDetail.v4getCollegeInfo(req,res,next);
            } else if(templateKey == 'v3.1'){
                return v3_1home.facultyDetail(req, res, next)
            }else if (templateKey == 'v3.2') {
                return v3_2home.v3_2getCollegeInfo(req, res, next)
            }  else{
                return v5users.errorPage(req, res, next);
            }
        }
    });

}

router.get('/faculty/:sCode/:departmentId/:parentId', secondPageFacultyDetail);
router.post('/faculty/:sCode/:departmentId/:parentId', secondPageFacultyDetail);
router.secondPageFacultyDetail = secondPageFacultyDetail;

//-----------------------------------------------------------------------------------------


//-------------判断二级页面     搜索结果----------------------------------------------------------------
function secondPageSearchPage(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode ||req.params.sCode|| "";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {

        if (err) {
            // 失败
            return;
        }
        var templateKey = data.template;
        if (templateKey == 'v5.0') {
            return v5templateHome.searchPage(req, res, next)
        } else if (templateKey == 'v4.0') {
            return home.v4getSearchPage(req, res, next)
        } else if (templateKey == 'v4.1'){
            return v4_1ArticleDetail.v4getSearchPage(req,res,next);
        } else if (templateKey == 'v3.1'){
            return v3_1home.searchPage(req, res, next)
        }else if(templateKey=='v3.2'){
            v3_2home.v3_2getSearchPage(req, res, next)
        } else{
            return v5users.errorPage(req, res, next);
        }
    });

}

router.get('/search/:sCode/:parentId/:question', secondPageSearchPage);
router.post('/search/:sCode/:parentId/:question', secondPageSearchPage);

//------------------------------------------------------------------------------


//---------   登录页面------------------------------------------
function secondPageLogin(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode || req.params.sCode||"";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {

        if (err) {
            // 失败
            return;
        }
        var templateKey = data.template;
        if (templateKey == 'v5.0') {
            return v5users.loginPage(req, res, next)
        } else if (templateKey == 'v4.0') {
            return v5users.loginPage(req, res, next)
        } else if(templateKey == 'v4.1') {
            return v5users.loginPage(req, res, next)
        } else if(templateKey == 'v3.1'){
            return v3_1users.loginPage(req, res, next)
        }else if(templateKey == 'v3.2'){
            return v3_1users.loginPage(req, res, next)
        } else{
            return v5users.errorPage(req, res, next);
        }
    });

}
router.get('/login/:sCode', secondPageLogin);
router.post('/login/:sCode', secondPageLogin);

//------------------------------------------------------------------------------

//---------   注册页面----------------------------------------
function secondPageRegister(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode || req.params.sCode||"";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {

        if (err) {
            return;
            // 失败
        }
        var templateKey = data.template;
        if (templateKey == 'v5.0') {
            return v5users.registerPage(req, res, next)
        } else if (templateKey == 'v4.0') {
            return v5users.registerPage(req, res, next)
        } else if (templateKey == 'v4.1'){
            return v5users.registerPage(req, res, next)
        }else if(templateKey == 'v3.1'){
            return v3_1users.registerPage(req, res, next)
        }else if(templateKey == 'v3.2'){
            return v3_1users.registerPage(req, res, next)
        } else{
            return v5users.errorPage(req, res, next);
        }
    });

}

router.get('/register/:sCode', secondPageRegister);
router.post('/register/:sCode', secondPageRegister);

//------------------------------------------------------------------------------
//---------  12- 忘记密码------------------------------------------
function secondPageForgetPassWord(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode ||req.params.sCode|| "";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {

        if (err) {
            return;
            // 失败
        }
        var templateKey = data.template;
        if (templateKey == 'v5.0') {
            return v5users.forgetPasswordPage(req, res, next)
        } else if (templateKey == 'v4.0') {
            return v5users.forgetPasswordPage(req, res, next)
        } else if (templateKey == 'v4.1') {
            return v5users.forgetPasswordPage(req, res, next)
        } else if(templateKey == 'v3.1'){
            return v3_1users.forgetPasswordPage(req, res, next)
        }  else if(templateKey == 'v3.2'){
            return v5users.forgetPasswordPage(req, res, next)
        } else{
            return v5users.errorPage(req, res, next);
        }
    });
}

router.get('/forget/:sCode', secondPageForgetPassWord);
router.post('/forget/:sCode', secondPageForgetPassWord);

//------------------------------------------------------------------------------
//---------  13   修改密码------------------------------------------
function secondPageModifyPassWord(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode || req.params.sCode|| "";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {

        if (err) {
            return;
            // 失败
        }
        var templateKey = data.template;
        if (templateKey == 'v5.0') {
            return v5users.modifyPasswordPage(req, res, next)
        } else if (templateKey == 'v4.0') {
            return v5users.modifyPasswordPage(req, res, next)
        } else if (templateKey == 'v4.1') {
            return v5users.modifyPasswordPage(req, res, next)
        } else if(templateKey == 'v3.1'){
            return v3_1users.modifyPasswordPage(req, res, next)
        } else if (templateKey == 'v3.2') {
            return v5users.modifyPasswordPage(req, res, next)
        } else{
            return v5users.errorPage(req, res, next);
        }
    });

}

router.get('/modify/:sCode', secondPageModifyPassWord);
router.post('/modify/:sCode', secondPageModifyPassWord);

//------------------------------------------------------------------------------


//---------   我的资料页面------------------------------------------
function secondPagePersonalPage(req, res, next) {

    var sCode = req.query.sCode || req.body.sCode || req.params.sCode||"";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {

        if (err) {
            // 失败
            return;
        }
        var templateKey = data.template;
        if (templateKey == 'v5.0') {
            return v5users.personalProfilePage(req, res, next)
        } else if (templateKey == 'v4.0') {
            return v5users.personalProfilePage(req, res, next)
        } else if (templateKey == 'v4.1') {
            return v5users.personalProfilePage(req, res, next)
        } else if(templateKey == 'v3.1'){
            return v3_1users.personalProfilePage(req, res, next)
        } else if (templateKey == 'v3.2') {
            return v5users.personalProfilePage(req, res, next)
        }  else{
            return v5users.errorPage(req, res, next);
        }
    });

}

router.get('/personal/:sCode', secondPagePersonalPage);
router.post('/personal/:sCode', secondPagePersonalPage);

//------------------------------------------------------------------------------
//---------  15 消息列表------------------------------------------
function messageList(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode || req.params.sCode||"";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {

        if (err) {
            // 失败
            return;
        }
        var templateKey = data.template;
        if (templateKey == 'v5.0') {
            return v5users.messageListPage(req, res, next)
        } else if (templateKey == 'v4.0') {
            return v5users.messageListPage(req, res, next)
        } else if (templateKey == 'v4.1') {
            return v5users.messageListPage(req, res, next)
        } else if(templateKey == 'v3.1'){
            return v3_1users.messageListPage(req, res, next)
        } else if(templateKey == 'v3.2'){
            return v5users.messageListPage(req, res, next)
        } else{
            return v5users.errorPage(req, res, next);
        }
    });

}

router.get('/message/:sCode', messageList);
router.post('/message/:sCode', messageList);

//------------------------------------------------------------------------------


//---------  14 在线留言------------------------------------------
function onlineMsg(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode || req.params.sCode||"";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {

        if (err) {
            // 失败
            return;
        }
        var templateKey = data.template;
        if (templateKey == 'v5.0') {
            return v5users.onlineMessagePage(req, res, next)
        } else if (templateKey == 'v4.0') {
            return v5users.onlineMessagePage(req, res, next)
        } else if (templateKey == 'v4.1') {
            return v5users.onlineMessagePage(req, res, next)
        } else if(templateKey == 'v3.1'){
            return v3_1users.onlineMessagePage(req, res, next)
        } else if(templateKey == 'v3.2'){
            return v5users.onlineMessagePage(req, res, next)
        } else{
            return v5users.errorPage(req, res, next);
        }
    });

}

router.get('/online/:sCode', onlineMsg);
router.post('/online/:sCode', onlineMsg);

//------------------------------------------------------------------------------





//------------------------21 招生计划页面 --------------------------------------------
function secondPageEnrollmentPage(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode || req.params.sCode|| "";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {

        if (err) {
            // 失败
            return;
        }
        var templateKey = data.template;
        if (templateKey == 'v5.0') {
            return v5templateHome.enrollmentPlanPage(req, res, next)
        } else if (templateKey == 'v4.0') {
            // 引用的是jsp页面

        } else if(templateKey == 'v4.1'){
            // 引用的是jsp 页面

        } else if(templateKey == 'v3.1'){
            return v3_1home.enrollmentPlanPage(req, res, next)
        } else{
            return v5users.errorPage(req, res, next);
        }
    });

}

router.get('/enrollment/:sCode/:parentId', secondPageEnrollmentPage);
router.post('/enrollment/:sCode/:parentId', secondPageEnrollmentPage);

//--------------------------------------------------------------------------


//------------------------22 历史录取页面 --------------------------------------------
function secondPageAdmissionPage(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode || req.params.sCode||"";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {

        if (err) {
            // 失败
            return;
        }
        var templateKey = data.template;
        if (templateKey == 'v5.0') {
            return v5templateHome.admissionHistoryPage(req, res, next)
        } else if (templateKey == 'v4.0') {
            // 引用的是jsp页面

        } else if(templateKey == 'v4.1'){
            // 引用的是jsp 页面

        } else if(templateKey == 'v3.1'){
            return v3_1home.admissionHistoryPage(req, res, next)
        } else{
            return v5users.errorPage(req, res, next);
        }
    });

}

router.get('/admission/:sCode/:parentId', secondPageAdmissionPage);
router.post('/admission/:sCode/:parentId', secondPageAdmissionPage);


//--------------------------------------------------------------------------


//------------------------23 研究方向页面---报考指南点击查看,出现研究方向里面的 专业详解 --------------------------------------------
function secondPageResearchDirectionDetail(req, res, next) {
    var sCode = req.query.sCode || req.body.sCode ||req.params.sCode|| "";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 发请求
    v5templateHomeUtil.findSchool(sCode, function (err, data) {

        if (err) {
            // 失败
            return;
        }
        var templateKey = data.template;
        if (templateKey == 'v5.0') {
            return v5templateHome.researchDirectionDetail(req, res, next);
        } else if (templateKey == 'v4.0') {
            return home.v4getResearchInfo(req, res, next);
        } else if (templateKey == 'v4.1') {
            return v4_1ArticleDetail.v4getResearchInfo(req, res, next);
        } else if(templateKey == 'v3.1'){
            return v3_1home.researchDirectionDetail(req, res, next)
        } else if(templateKey == 'v3.2'){
            return v3_2home.v3_2getResearchInfo(req, res, next)
        } else{
            return v5users.errorPage(req, res, next);
        }
    });

}

router.get('/direction/:sCode/:majorResearchId/:parentId', secondPageResearchDirectionDetail);
router.post('/direction/:sCode/:majorResearchId/:parentId', secondPageResearchDirectionDetail);
router.secondPageResearchDirectionDetail = secondPageResearchDirectionDetail;

//--------------------------------------------------------------------------











module.exports = router;