/**
 * created by abby 2017/7/18
 */
var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var CONFIG = require('../../config');
var API_BASE_URL =  CONFIG.API_SERVER_FULL_URL;
var base_sever_url = CONFIG.HOME_SERVER_DOMAIN_FOR_HOME;
var async = require('async');
var v3_1templateHomeUtil = require('../util/v3_1templateHomeUtil');
var v5users = require('../v5template/v5users');
var fs = require('fs');
var jade = require('jade');
var moment = require('moment');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//统一返回json格式
function ret_func(success, msg, data, res) {
    var obj = {
        success: success,
        msg: msg,
        data: data || {}
    }
    // 返回
    res.set('Content-Type', 'application/json');
    res.json(obj);
}


//---------------------模版3_1 首页-----------------------------------------

function getHomePage(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");   //设置跨域访问
    //   1.请求学校基本配置接口
    var codeOrIdentify = req.query.sCode || req.body.sCode || 0;    // 专业id
    //学校唯一标识id
    if (typeof codeOrIdentify == 'undefined' || codeOrIdentify == null || codeOrIdentify.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }

    // 1. 学校基础信息
    v3_1templateHomeUtil.findSchool(codeOrIdentify, function(findSchoolErr, schoolInfo){
        if(findSchoolErr) {
            console.log("v5templateHome.js [getHomePage] findSchoolErr: " + findSchoolErr);
            var errMsg = "请求失败";
            errMsg = typeof findSchoolErr == 'string' ? findSchoolErr : errMsg;
            return v3_1templateHomeUtil.ret_json_func(0,errMsg,{},res);
        }

        // 4.获取首页各个模块信息
        async.series([
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code, schoolInfo.template, "m01", function(err,data){return callback(err,data)});
            },//**** m01 导航栏
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code, schoolInfo.template, "m02", function(err,data){return callback(err,data)});
            },//**** m02 自定义,
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code, schoolInfo.template, "m03", function(err,data){return callback(err,data)});
            },//**** m03 学校首图,
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code, schoolInfo.template, "m04", function(err,data){return callback(err,data)});
            },//**** m04   招生公告  ** 左边热点信息提醒 **
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code, schoolInfo.template, "m05", function(err,data){return callback(err,data)});
            },//**** m05   热点信息  ** 五个快捷入口模块 **
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code, schoolInfo.template, "m06", function(err,data){return callback(err,data)});
            },//**** m06   招生快讯  ** 三个tab键 分类切换
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code, schoolInfo.template, "m07", function(err,data){return callback(err,data)});
            },//**** m07   招生章程  ** 招生章程
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code, schoolInfo.template, "m08", function(err,data){return callback(err,data)});
            },//**** m08   在线视频
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code, schoolInfo.template, "m09", function(err,data){return callback(err,data)});
            },//**** m09   人物  导师风采
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code, schoolInfo.template, "m10", function(err,data){return callback(err,data)});
            },//**** m10   故事
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code, schoolInfo.template, "m11", function(err,data){return callback(err,data)});
            },//**** m11   校园风采
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code, schoolInfo.template, "m12", function(err,data){return callback(err,data)});
            },//**** m12   友情链接
            function(callback){
                v3_1templateHomeUtil.getInfoCatByFAQ(schoolInfo.code,function(err,data){return callback(err,data)});
            },//***** 首页增加常见问题,返回父级id 字段
            function(callback){
                v3_1templateHomeUtil.findContactWay(schoolInfo.code,function(err,data){return callback(err,data)});
            } // 页尾 联系方式


        ], function(getModuleErr, modules){

            if(getModuleErr) {
                console.log("v5templateHome.js [getHomePage] getBannerErr: " + getModuleErr);
                var errMsg = "请求失败";
                errMsg = typeof findSchoolErr == 'string' ? findSchoolErr : errMsg;
                return v3_1templateHomeUtil.ret_json_func(0,errMsg,{},res);
            }

            var retJson ={};
            retJson.schoolInfo = schoolInfo;         // 学校基本信息
            retJson.m01 = modules[0];                // 导航栏
            retJson.m02 = modules[1];                // 自定义
            retJson.m03 = modules[2];                // banner  学校首图
            retJson.m04 = modules[3];                // m04 招生公告 左边热点信息提醒
            retJson.m05 = modules[4];                // m05 热点信息 右边5个快捷入口模块
            retJson.m06 = modules[5];                // m06 招生快讯 三个TAB键切换
            retJson.m07 = modules[6];                // m07 招生章程
            retJson.m08 = modules[7];                // m08 在线视频
            retJson.m09 = modules[8];                // m09 人物 导师风采
            retJson.m10 = modules[9];                // m10 校园故事
            retJson.m11 = modules[10];                // m11 校园风采
            retJson.m12 = modules[11];                // m12 友情链接
            retJson.question = modules[12];           // question 常见问题,返回父级id 字段 搜索框需要用
            retJson.contact = modules[13];            // 页尾 联系方式
            // 尝试获取用户登录信息
            var userInfoJson = req.cookies.zndyKey;
            if(userInfoJson && userInfoJson.length > 2) {
                var userInfo = JSON.parse(userInfoJson || '{}');
                retJson.userInfo = userInfo;
                var userToken = userInfo.userToken;
                // 获取用户userToken 请求用户消息列表总数
                v3_1templateHomeUtil.getNoticeNum(schoolInfo.code, userToken,function(getNoticeNumErr, NoticeNumInfo) {
                    if (getNoticeNumErr) {
                        console.log("v5templateHome.js [getHomePage] getBannerErr: " + getNoticeNumErr);
                        var errMsg = "请求失败";
                        errMsg = typeof getNoticeNumErr == 'string' ? getNoticeNumErr : errMsg;
                        return v3_1templateHomeUtil.ret_json_func(0, errMsg, {}, res);
                    }
                    retJson.NoticeNum = NoticeNumInfo;
                    retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
                    retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
                    retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
                    retJson.sidebarBookImg = retJson.schoolInfo.styleSidebarBook;  // 将二级侧边栏中的右侧书本背景图信息提取至模型根部,便于jade读取



                    retJson.navColor = retJson.school;
                    retJson.title= retJson.schoolInfo.name+"-"+retJson.schoolInfo.professor;
                    retJson.host = "http://"+req.hostname;
                    //console.log(JSON.stringify(retJson));
                    return res.render('./v3_1template/pages/01_v3_1home',retJson);
                });
            }else{
                retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
                retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
                retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
                retJson.sidebarBookImg = retJson.schoolInfo.styleSidebarBook;  // 将二级侧边栏中的右侧书本背景图信息提取至模型根部,便于jade读取
                retJson.navColor = retJson.school;
                retJson.title= retJson.schoolInfo.name+retJson.schoolInfo.professor;
                retJson.host = "http://"+req.hostname;
                //console.log(JSON.stringify(retJson));
                return res.render('./v3_1template/pages/01_v3_1home',retJson);
            }
        });
    });
}
router.get('/getHomePage', getHomePage);
router.post('/getHomePage', getHomePage);
router.getHomePage = getHomePage;
//-------------------------------------------------------------------


//-------------------------二级页面子菜单(二级侧边栏)------------------------
function sidebarPage(req,res,next){
    //          学校基本信息请求接口
    var sCode = req.query.sCode || req.body.sCode || 0;
    var catId = req.query.catId || req.body.catId || req.query.parentId || req.body.parentId||0;


    //参数判断
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    if (typeof catId == 'undefined' || catId == null || catId.length == 0) {
        console.log('***** 二级分类为空');
        return ret_func(0,'二级分类为空', res,{});
    }
    var url = API_BASE_URL + '/weixin/api/infoCat/getInfoCatlist?'
        + 'sCode='+sCode
        + '&catId='+catId;
    superagent.get(url)
        .end(function (err, res2) {
            if (err) {
                console.log("v5templateHome.js request api err: " + err);
                return ret_func(0,'二级菜单侧边栏请求错误', res,{});
            }

            var retJson = JSON.parse(res2.text);
            if (retJson.success == 0) {
                return ret_func(0,retJson.msg, res,{});
            }

            retJson.data.toString = function(){return JSON.stringify(this)};

            retJson.host = "http://"+req.hostname;
            res.render('./v5template/components/sidebar',retJson);

        });
}
router.get('/v5templateSidebarPage',sidebarPage);
router.post('/v5templateSidebarPage',sidebarPage);
//------------------------------------------------------------------------

//-------------------------二级页面子菜单(二级页面文章详情)------------------------
function getDetailPage(req,res,next){
    //          文章详情请求接口
    var infoId = req.query.infoId || req.body.infoId || req.params.infoId|| '';
    var sCode = req.query.sCode || req.body.sCode || req.params.sCode||'';
    var parentId = req.query.parentId || req.body.parentId ||  req.params.parentId||'';
    //参数判断
    if(typeof infoId=='undefined' || infoId == null || infoId.length == 0){
        console.log('***** infoId为空');
        return ret_func(0,'infoId错误', res,{});
    }

    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    if (typeof parentId == 'undefined' || parentId == null || parentId.length == 0) {
        console.log('***** 父级唯一标识错误');
        return ret_func(0,'父级唯一标识错误', res,{});
    }

    // 获取学校基本配置信息
    v3_1templateHomeUtil.findSchool(sCode, function(findSchoolErr, schoolInfo){
        if(findSchoolErr) {
            console.log("v5templateHome.js [getDetailPage] findSchoolErr: " + findSchoolErr);
            var errMsg = "请求失败";
            errMsg = typeof findSchoolErr == 'string' ? findSchoolErr : errMsg;
            return v3_1templateHomeUtil.ret_json_func(0,errMsg,{},res);
        }

        // 请求详情信息, 根据详情type, 再请求不同类型信息
        v3_1templateHomeUtil.getInfoContentDetail(infoId,parentId,sCode,function(err,contentDetail){

            if(err) {
                console.log('v5template/v5templateHome.js [getDetailPage] getInfoContentDetail Err: ' + err);
                return v3_1templateHomeUtil.ret_json_func(0,'失败',{}, res);
            }
            /*
             * contentDetail.specType
             *  1	学校基本信息	            3.1、3.2
             *  6	专业查询列表	            3.3, 3.4
             *  8	历年招生计划（学校+专业）	3.5
             *  9	录取规则	                3.13
             *  10	学校录取历史	            3.11、3.12
             *  11	专业录取历史	            3.8、3.9、3.10
             *  13	研究方向	3.14
             *  14  院系列表
             * */
            var tasks = [];
            // 侧边栏信息 *** 0
            tasks.push(function(callback){
                v3_1templateHomeUtil.getInfoCatlist(sCode,parentId,function(err,data){callback(err,data)})
            });
            // layout 需要使用  新接口, 返回全部一级分类和二级分类
            tasks.push(function(callback){
                v3_1templateHomeUtil.getSecondPageBarMenu(schoolInfo.code, function(err,data){return callback(err,data)});
            });
            // layout 需要使用 常见问题  question ***3
            tasks.push(function(callback){
                v3_1templateHomeUtil.getInfoCatByFAQ(schoolInfo.code,function(err,data){return callback(err,data)});
            });
            // footer 需要使用 页尾友情链接 friendLink ***4
            tasks.push(function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code,schoolInfo.template, "m12",function(err,data){return callback(err,data)});
            });
            tasks.push(function(callback){
                v3_1templateHomeUtil.findContactWay(schoolInfo.code,function(err,data){return callback(err,data)});
                // 页尾 联系方式
            })

            if(contentDetail.specType == 0){
                // 直接渲染文章详情页面
                tasks.push(function(callback){return callback(null,null);}); /*** 5***/
            }else if(contentDetail.specType == 1) {
                // 加入3.1接口请求   请求学校基本信息
                tasks.push(function(callback){ //**** 5
                    v3_1templateHomeUtil.getSchoolInfoByCode(sCode,function(err,data){callback(err,data)});
                });
            }else if(contentDetail.specType == 6){
                // 加入3.3 接口请求  请求专业查询列表
                tasks.push(function(callback){
                    v3_1templateHomeUtil.getMajorList(sCode,false,function(err,data){callback(err,data)});
                }); // **** 5
                // 加入3.4 接口请求  请求专业详情等展示配置
                tasks.push(function(callback){
                    v3_1templateHomeUtil.getMajorConf(sCode,function(err,data){callback(err,data)});
                }); // **** 6
            }else if(contentDetail.specType == 8){
                // 请求招生计划页面
            } else if(contentDetail.specType == 13) {

            } else if(contentDetail.specType == 14){
                // 请求院系列表
                tasks.push(function(callback){
                    v3_1templateHomeUtil.getFrontDepList(sCode,false,function(err,data){callback(err,data)});
                }); // **** 5

            }
            // 向后端发请求  多个请求并发一起发,parallel 并发
            async.parallel(tasks,function(error, results){

                if(error) {
                    console.log("v5template/v5templateHome.js [v5templateDetailPasge] requetErr: " + err);
                    return v3_1templateHomeUtil.ret_json_func(0,'失败',{},res);
                }
                // 渲染信息配置
                var retJson = {};
                retJson.contentInfo = contentDetail;
                retJson.schoolInfo = schoolInfo;    // 学校基本配置信息

                retJson.sidebarData = results[0]; // 串行任务第零个, 固定为侧边栏信息请求
                retJson.SPBMenu = results[1];           // 串行任务第2个.固定为m02导航栏信息请求
                retJson.question = results[2];      // 串行任务第3个.固定为question 首页搜索框常见问题信息请求
                retJson.m12 = results[3];    // 串行任务第4个.固定为friendLink页尾友情链接请求
                retJson.contact = results[4];       // 串行任务第5个.固定为contact 页尾联系方式请求
                // 尝试获取用户登录信息
                var userInfoJson = req.cookies.zndyKey;
                if(userInfoJson && userInfoJson.length > 2) {
                    var userInfo = JSON.parse(userInfoJson || '{}');
                    retJson.userInfo = userInfo;
                    // 点击个人昵称跳转到个人资料这一页面
                    retJson.urlPersonalProfile =  base_sever_url + "/v5users/v5personalProfile";
                }

                if(contentDetail.specType == 0) {
                    retJson.contentInfo = contentDetail;
                } else if(contentDetail.specType == 1) {
                    var school = results[5];
                    retJson.school = school.school;
                    //------ test begin----------
                    //同步读取文件

                    //------ test end -----------
                } else if(contentDetail.specType == 10) {


                } else if(contentDetail.specType == 6){
                    //// 05--专业查询列表
                    var professionalList = results[5];           //  专业查询列表
                    var professionalDetailShow = results[6];     //  专业详情展示配置

                    retJson.professionalList = professionalList;
                    retJson.professionalDetailShow = professionalDetailShow;
                } else if(contentDetail.specType == 13) {

                } else if(contentDetail.specType == 14){
                    var facultyList = results[5];
                    retJson.facultyList = facultyList; //  院系列表
                }
                retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
                retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
                retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
                retJson.sidebarBookImg = retJson.schoolInfo.styleSidebarBook;  // 将二级侧边栏中的右侧书本背景图信息提取至模型根部,便于jade读取
                retJson.title= retJson.schoolInfo.name +retJson.schoolInfo.professor +retJson.contentInfo.title;

                // 浏览量
                retJson.infoId = infoId;
                retJson.parentId = parentId;
                retJson.host = "http://"+req.hostname;
                // 跳转到修改密码页面
                //console.log(JSON.stringify(retJson));
                return res.render('./v3_1template/pages/02_v5templateDetail', retJson);
            });
        });
    });

}
router.get('/v5templateDetailPage',getDetailPage);
router.post('/v5templateDetailPage',getDetailPage);
router.getDetailPage =getDetailPage;
//------------------------------------------------------------------------


//-------------------------二级页面子菜单03----jade页面(常见问题)------------------------
function commonProblemPage(req,res,next){
    //          常见问题请求接口
    var sCode = req.query.sCode || req.body.sCode || 0;


    //参数判断
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }

    var url = API_BASE_URL + '/front/template/faqList/'+ sCode;
    superagent.get(url)
        .end(function (err, res2) {
            if (err) {
                console.log("v5template/v5templateHome.js [v5templateCommonProblem]request api err: " + err);
                return ret_func(0, '常见问题列表请求错误', res, {});
            }

            var retJson = JSON.parse(res2.text);
            if (retJson.success == 0) {
                return ret_func(0, retJson.msg, res, {});
            }
            var problem = {};
            problem.data= retJson;
            // 尝试获取用户登录信息
            var userInfoJson = req.cookies.zndyKey;
            if(userInfoJson && userInfoJson.length > 2) {
                var userInfo = JSON.parse(userInfoJson || '{}');
                retJson.userInfo = userInfo;
                // 点击个人昵称跳转到16个人资料这一页面
                retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
                retJson.urlModifyPassword = base_sever_url + "/v5users/v5modifyPassword";
            }
            retJson.host = "http://"+req.hostname;
            res.render('./v3_1template/pages/03_commonProblem',problem);
        });
}
router.get('/v5templateCommonProblem',commonProblemPage);
router.post('/v5templateCommonProblem',commonProblemPage);
//------------------------------------------------------------------------



//--------------------------二级页面子菜单05-----jade页面(学院&学校  专业列表)----------------------------
function professionalListPage(req,res,next){
    //   获取专业列表请求接口
    var sCode = req.query.sCode || req.body.sCode || 0;
    var needPage = 'false';


    //参数判断
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }

    var url = API_BASE_URL + '/weixin/api/getMajorList?'
        + 'sCode=' + sCode
        + '&needPage=' + needPage;
    superagent.get(url)
        .end(function (err, res2) {
            if (err) {
                console.log("v5template/v5templateHome.js [v5templateProfessionalList]request api err: " + err);
                return ret_func(0, '专业查询列表请求错误', res, {});
            }

            var retJson = JSON.parse(res2.text);
            if (retJson.success == 0) {
                return ret_func(0, retJson.msg, res, {});
            }
            // 请求专业详情配置是否显示信息接口
            var url = API_BASE_URL + '/weixin/api/getMajorConf?'
                + 'scode=' + sCode;
            superagent.get(url)
                .end(function (err, res2) {
                    if (err) {
                        console.log("v5template/v5templateHome.js [/weixin/api/getMajorConf]request api err: " + err);
                        return ret_func(0, '专业详情是否显示配置信息接口显示错误', res, {});
                    }

                    var professionalDetailShow = JSON.parse(res2.text);
                    if (!professionalDetailShow) {
                        return ret_func(0, "失败", res, {});
                    }
                    retJson.professionalDetailShow = professionalDetailShow;
                    // 尝试获取用户登录信息
                    var userInfoJson = req.cookies.zndyKey;
                    if(userInfoJson && userInfoJson.length > 2) {
                        var userInfo = JSON.parse(userInfoJson || '{}');
                        retJson.userInfo = userInfo;
                        // 点击个人昵称跳转到16个人资料这一页面
                        retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
                        retJson.urlModifyPassword = base_sever_url + "/v5users/v5modifyPassword";

                    }

                    retJson.host = "http://"+req.hostname;
                    res.render('./v3_1template/pages/05_professionalList',retJson);

                });
        });

}
router.get('/v5templateProfessionalList',professionalListPage);
router.post('/v5templateProfessionalList',professionalListPage);
//-------------------------------------------------------------------------------------


//--------------------------二级页面子菜单05----ajax请求 根据用户的信息,展示专业列表----------------------------
function professionalListPage_json(req,res,next){
    //   获取专业列表请求接口
    var sCode = req.query.sCode || req.body.sCode || 0;
    var needPage = 'false';
    var name = req.query.name || req.body.name || "";


    //参数判断
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    if (name==""){
        var url = API_BASE_URL + '/weixin/api/getMajorList?'
            + 'sCode=' + sCode
            + '&needPage=' + needPage;
    }else{
        var url = API_BASE_URL + '/weixin/api/getMajorList?'
            + 'sCode=' + sCode
            + '&needPage=' + needPage
            + '&name=' + name;
    }
    url = encodeURI(url);
    superagent.get(url)
        .end(function (err, res2) {
            if (err) {
                console.log("v5template/v5templateHome.js [v5templateProfessionalList]request api err: " + err);
                return ret_func(0, '专业查询列表请求错误', res, {});
            }

            var retJson = JSON.parse(res2.text);
            if (retJson.success == 0) {
                return ret_func(0, retJson.msg, res, {});
            }
            // 请求专业详情配置是否显示信息接口
            var url = API_BASE_URL + '/weixin/api/getMajorConf?'
                + 'scode=' + sCode;
            superagent.get(url)
                .end(function (err, res2) {
                    if (err) {
                        console.log("v5template/v5templateHome.js [/weixin/api/getMajorConf]request api err: " + err);
                        return ret_func(0, '专业详情是否显示配置信息接口显示错误', res, {});
                    }

                    var professionalDetailShow = JSON.parse(res2.text);
                    if (!professionalDetailShow) {
                        return ret_func(0, "失败", res, {});
                    }
                    retJson.professionalDetailShow = professionalDetailShow;

                    // 点击个人昵称跳转到个人资料这一页面
                    retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
                    res.json(retJson);

                });
        });

}
router.get('/v5templateProfessionalList_json',professionalListPage_json);
router.post('/v5templateProfessionalList_json',professionalListPage_json);
//-------------------------------------------------------------------------------------


//--------------------------二级页面子菜单04--jade页面 文章标题列表----------------------------
/**
 * 获取制定分类下的文章／标题列表
 *
 * 参数：sCode 学校唯一标识
 * 参数：catId 分类唯一标识
 * 参数：curPage 当前页
 * 参数：pageSize 页容量
 *
 * 返回结果： {}
 *
 * 测试地址：http://localhost:3000/v5templateHome/v5templateSubList01?sCode=NLGYFE&catId=708&curPage=1&pageSize
 * */
function v5templateSubList01(req,res,next){
    //二级侧边栏请求接口
    var sCode = req.params.sCode|| req.query.sCode || req.body.sCode|| 0;
    var catId = req.params.parentId|| req.query.parentId || req.body.parentId|| req.query.catId || req.body.catId||0;
    //参数判断
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    if (typeof catId == 'undefined' || catId == null || catId.length == 0) {
        console.log('***** 二级分类为空');
        return ret_func(0,'二级分类为空', res,{});
    }
    var curPage = req.query. curPage|| req.body.curPage || 1;
    // 每页数量
    var pageSize = req.query. pageSize|| req.body.pageSize ||10;
    // 向后端发请求 多个请求串形 series 串型,多个请求一个一个发.

    // 获取学校基本配置信息
    v3_1templateHomeUtil.findSchool(sCode, function(findSchoolErr, schoolInfo){
        if(findSchoolErr) {
            console.log("v5templateHome.js [getDetailPage] findSchoolErr: " + findSchoolErr);
            var errMsg = "请求失败";
            errMsg = typeof findSchoolErr == 'string' ? findSchoolErr : errMsg;
            return v3_1templateHomeUtil.ret_json_func(0,errMsg,{},res);
        }
        async.series([
            function(callback) {
                // 获取二级分类信息 **** 0
                v3_1templateHomeUtil.getInfoCatlist(sCode,catId,function(err,data){callback(err,data)});
            },
            function(callback) {
                // 获取列表 **** 1
                v3_1templateHomeUtil.getInfoContentlist(sCode,catId,curPage,pageSize,function(err,data){callback(err,data)});
            },
            function(callback){
                v3_1templateHomeUtil.getSecondPageBarMenu(schoolInfo.code, function(err,data){return callback(err,data)});
            }, // ****3  SPBMenu 导航栏信息 首页导航栏请求全部的一级分类和二级分类
            function(callback){
                v3_1templateHomeUtil.getInfoCatByFAQ(schoolInfo.code,function(err,data){return callback(err,data)});
            }, // ****4     question首页搜索框,[常见问题]
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code,schoolInfo.template, "m12",function(err,data){return callback(err,data)});
            },   // ****5     页尾 友情链接  friendLink
            function(callback){
                v3_1templateHomeUtil.findContactWay(schoolInfo.code,function(err,data){return callback(err,data)});
                // ****6   页尾联系方式
            }

        ],function(err, results){
            if(err) {
                console.log("v5template/v5templateHome.js [v5templateSubList01] requetErr: " + err);
                return v3_1templateHomeUtil.ret_json_func(0,'失败',{},res);
            }
            var catInfo = results[0] || {};
            var contentInfo = results[1] || [];
            var retJson = {
                'sidebarData' : catInfo,
                'contentInfo' : contentInfo,
                'SPBMenu' : results[2],
                'question':results[3],
                'm12':results[4],
                'contact':results[5],
                'schoolInfo' : schoolInfo
            };

            // 尝试获取用户登录信息
            var userInfoJson = req.cookies.zndyKey;
            if(userInfoJson && userInfoJson.length > 2) {
                var userInfo = JSON.parse(userInfoJson || '{}');
                retJson.userInfo = userInfo;
                // 点击个人昵称跳转到个人资料这一页面
                retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            }
            // 计算页码数 传入当前页,总页数
            if (retJson.contentInfo) {
                retJson.contentInfo.bottomPageNum = calculatePageNum(curPage, retJson.contentInfo.totalPage+1);
            }



            retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
            retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
            retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
            retJson.sidebarBookImg = retJson.schoolInfo.styleSidebarBook;  // 将二级侧边栏中的右侧书本背景图信息提取至模型根部,便于jade读取
            retJson.sidebarData.toString = function(){return JSON.stringify(this)};
            retJson.contentInfo.toString = function(){return JSON.stringify(this)};
            retJson.title= retJson.schoolInfo.name+retJson.schoolInfo.professor +retJson.contentInfo.secondCatName;
            //console.log(JSON.stringify(retJson));
            retJson.host = "http://"+req.hostname;
            res.render('./v3_1template/pages/04_subList',retJson);
        });

    });



}
router.get('/v5templateSubList01',v5templateSubList01);
router.post('/v5templateSubList01',v5templateSubList01);
router.v5templateSubList01 =v5templateSubList01;

//设定页脚数组(显示数组, 请求时需减一)
function calculatePageNum(currentPage,totalPageCount) {
    currentPage = Number(currentPage);
    totalPageCount = Number(totalPageCount);
    // 定义数组, 存放页码数组
    var array = [];
    // 定义最大页码个数(最大页码个数应为奇数个, 以保证选中页在底部中间)
    var bottomMax = 5;
    // 总页数小于最大页码个数, 直接返回所有页即可
    if (totalPageCount <= bottomMax){
        for(var i = 1;i < totalPageCount; i++){
            array.push(i);
        }
    }
    // 大于最大页码个数时, 需要判断
    else {

        // 确定范围
        var  halfMargin = (bottomMax - 1)/2;

        // 以当前页为基准, 计算最小的页码数大于0, 最大的页码数小于总页数, 直接数即可
        if(currentPage - halfMargin > 1 && currentPage + halfMargin < totalPageCount) {
            var beginPage = currentPage - halfMargin;
            var endPage = beginPage + bottomMax;
            // 从当前页的前一半做起始页数起, 数到最大限制
            for(var i = beginPage; i < endPage; i ++) {
                array.push(i);
            }
        }
        // 以当前页面为基准, 计算最小页码数小于零, 则最小页码数为0, 往后数到页码个数限制,
        // 一级判断总页数大于5才能进入此处, 所以从0数到最大页码个数限制, 不会超限
        else if(currentPage - halfMargin <= 1) {
            var beginPage = 1;
            for(var i = beginPage; i < beginPage + bottomMax; i ++) {
                array.push(i);
            }
        }
        // 以当前页为基准, 计算最大页码数大于总页数, 则从最大页码数倒数只页码个数限制
        // 一级判断总页数大于页码个数限制才能进入此处, 所以从总页数倒数页码个数限制不会小于零, 故不会超限
        else if(currentPage + halfMargin >= totalPageCount) {
            var endPage = totalPageCount;
            for(var i = endPage - bottomMax; i < endPage; i ++) {
                array.push(i);
            }
        }
    }
    return array;
}



//-------------------------------------------------------------------------------------







//--------------------------二级页面子菜单06 页面(学院&学校  专业详情)----------------------------
function professionalDetailPage(req,res,next){
    //   学院学校专业详情请求接口
    var majorId = req.query.majorId || req.body.majorId || req.params.majorId||"";    // 专业id
    var sCode = req.query.sCode || req.body.sCode || req.params.sCode|| "";
    var catId = req.query.catId || req.body.catId || req.query.parentId || req.body.parentId|| req.params.parentId||null;

    //专业id
    if (typeof majorId == 'undefined' || majorId == null || majorId.length == 0) {
        console.log('***** 专业唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    if (typeof catId == 'undefined' || catId == null || catId.length == 0) {
        console.log('***** 二级分类唯一标识为空');
        return ret_func(0,'二级分类唯一标识错误', res,{});
    }

    // 获取学校基本配置信息
    v3_1templateHomeUtil.findSchool(sCode, function(findSchoolErr, schoolInfo){
        if(findSchoolErr) {
            console.log("v5templateHome.js [getDetailPage] findSchoolErr: " + findSchoolErr);
            var errMsg = "请求失败";
            errMsg = typeof findSchoolErr == 'string' ? findSchoolErr : errMsg;
            return v3_1templateHomeUtil.ret_json_func(0,errMsg,{},res);
        }
        async.series([
            function(callback) {
                // 获取二级分类信息 **** 0
                v3_1templateHomeUtil.getInfoCatlist(sCode,catId,function(err,data){callback(err,data)});
            },
            function(callback) {
                // 获取专业详情信息 **** 1
                v3_1templateHomeUtil.majorDetail(majorId,function(err,data){callback(err,data)});
            },
            function(callback){
                v3_1templateHomeUtil.getSecondPageBarMenu(schoolInfo.code,function(err,data){return callback(err,data)});
            }, // ****3  SPBMenu 导航栏信息****3   二级页面导航栏信息和首页导航栏信息不同，二级页面导航栏请求全部的一级分类和二级分类
            function(callback){
                v3_1templateHomeUtil.getInfoCatByFAQ(schoolInfo.code,function(err,data){return callback(err,data)});
            }, // ****4     question首页搜索框,[常见问题]   ****4
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code,schoolInfo.template, "m12",function(err,data){return callback(err,data)});
            },   // ****5    页尾 友情链接  friendLink   ****5
            function(callback){
                v3_1templateHomeUtil.findContactWay(schoolInfo.code,function(err,data){return callback(err,data)});
                // ****6   页尾联系方式
            }
        ],function(err, results){
            if(err) {
                console.log("v5template/v5templateHome.js [v5templateSubList01] requetErr: " + err);
                return v3_1templateHomeUtil.ret_json_func(0,'失败',{},res);
            }
            var catInfo = results[0] || {};
            var ProfessionalDetail = results[1] || [];
            var retJson = {
                'sidebarData' : catInfo,
                'ProfessionalDetail' : ProfessionalDetail,
                'SPBMenu' : results[2],
                'question':results[3],
                'm12':results[4],
                'contact':results[5],
                'schoolInfo' : schoolInfo,
                'majorId':majorId,
                'catId':catId
            };

            // 尝试获取用户登录信息
            var userInfoJson = req.cookies.zndyKey;
            if(userInfoJson && userInfoJson.length > 2) {
                var userInfo = JSON.parse(userInfoJson || '{}');
                retJson.userInfo = userInfo;
                // 点击个人昵称跳转到个人资料这一页面
                retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            }
            retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
            retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
            retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
            retJson.sidebarBookImg = retJson.schoolInfo.styleSidebarBook;  // 将二级侧边栏中的右侧书本背景图信息提取至模型根部,便于jade读取
            retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;

            retJson.title= retJson.schoolInfo.name+retJson.schoolInfo.professor +"专业详情";
            retJson.host = "http://"+req.hostname;
            res.render('./v3_1template/pages/06_professionalDetail',retJson);
        });

    });
}
router.get('/v5templateProfessionalDetail',professionalDetailPage);
router.post('/v5templateProfessionalDetail',professionalDetailPage);

router.professionalDetailPage =professionalDetailPage;



//-------------------------------------------------------------------------------------

//--------------------------二级页面子菜单(07---视频在线 模块)----------------------------
function videoOnlinePage(req,res,next){
    //          视频在线信息请求接口
    var sCode = req.query.sCode || req.body.sCode || req.params.sCode||0;
    var curPage = req.query.curPage || req.body.curPage || req.params.curPage|| 0;
    var curPage = 1;
    var needPage = 'false';
    //参数判断
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    if (typeof curPage == 'undefined' || curPage == null || curPage.length == 0) {
        console.log('***** 二级分类为空');
        return ret_func(0,'二级分类为空', res,{});
    }


    // 获取学校基本配置信息
    v3_1templateHomeUtil.findSchool(sCode, function(findSchoolErr, schoolInfo){
        if(findSchoolErr) {
            console.log("v5templateHome.js [getDetailPage] findSchoolErr: " + findSchoolErr);
            var errMsg = "请求失败";
            errMsg = typeof findSchoolErr == 'string' ? findSchoolErr : errMsg;
            return v3_1templateHomeUtil.ret_json_func(0,errMsg,{},res);
        }
        async.series([
            function(callback) {
                // 获取二级页面 视频在线信息 **** 0
                v3_1templateHomeUtil.getSchoolVidoList(sCode,curPage,needPage,function(err,data){callback(err,data)});
            },
            function(callback){
                v3_1templateHomeUtil.getSecondPageBarMenu(schoolInfo.code, function(err,data){return callback(err,data)});
            }, // ****2  SPBMenu  二级页面导航栏信息  请求全部的一级分类和二级分类
            function(callback){
                v3_1templateHomeUtil.getInfoCatByFAQ(schoolInfo.code,function(err,data){return callback(err,data)});
            }, // ****3     question首页搜索框,[常见问题]
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code, schoolInfo.template, "m12",function(err,data){return callback(err,data)});
            },   // ****4     页尾 友情链接  friendLink
            function(callback){
                v3_1templateHomeUtil.findContactWay(schoolInfo.code,function(err,data){return callback(err,data)});
                // ****5   页尾联系方式
            }
        ],function(err, results){
            if(err) {
                console.log("v5template/v5templateHome.js [v5templateSubList01] requetErr: " + err);
                return v3_1templateHomeUtil.ret_json_func(0,'失败',{},res);
            }
            var video = results[0] || {};
            var retJson = {
                'video' : video,
                'SPBMenu' : results[1],
                'question':results[2],
                'm12':results[3],
                'contact':results[4],
                'schoolInfo' : schoolInfo
            };
            // 尝试获取用户登录信息
            var userInfoJson = req.cookies.zndyKey;
            if(userInfoJson && userInfoJson.length > 2) {
                var userInfo = JSON.parse(userInfoJson || '{}');
                retJson.userInfo = userInfo;
                retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            }
            retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
            retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
            retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
            retJson.sidebarBookImg = retJson.schoolInfo.styleSidebarBook;  // 将二级侧边栏中的右侧书本背景图信息提取至模型根部,便于jade读取
            retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            retJson.title= retJson.schoolInfo.name+retJson.schoolInfo.professor +"视频在线";
            retJson.host = "http://"+req.hostname;
            res.render('./v3_1template/pages/07_videoOnline',retJson);
        });

    });

}
router.get('/v5templateVideoOnline',videoOnlinePage);
router.post('/v5templateVideoOnline',videoOnlinePage);

router.videoOnlinePage =videoOnlinePage;

//-------------------------------------------------------------------------------------

//--------------------------二级页面子菜单(招生计划)----------------------------
function enrollmentPlanPage(req,res,next){
    var retJson = {};
    retJson.host = "http://"+req.hostname;
    res.render('./v3_1template/pages/08_enrollmentPlan',retJson);
}
router.get('/v5templateEnrollmentPlan',enrollmentPlanPage);
router.post('/v5templateEnrollmentPlan',enrollmentPlanPage);
//-------------------------------------------------------------------------------------


//--------------------------二级页面子菜单(学校基本信息)  jade页面渲染----------------------------
function schoolProfilePage(req,res,next){

    //          学校基本信息请求接口
    var scode = req.query.sCode || req.body.sCode || 0;


    //参数判断
    if (typeof scode == 'undefined' || scode == null || scode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }

    var url = API_BASE_URL + '/weixin/api/getSchoolInfoByCode?'
        + 'scode='+scode;
    superagent.get(url)
        .end(function (err, res2) {
            if (err) {
                console.log("v5templateHome.js request api err: " + err);
                return ret_func(0,'学校基本请求错误', res,{});
            }

            var retJson = JSON.parse(res2.text);
            //retJson.title = JSON.stringify(retJson.dat);
            if (retJson.success == 0) {
                return ret_func(0,retJson.msg, res,{});
            }
            retJson.host = "http://"+req.hostname;
            res.render('./v3_1template/pages/09_schoolProfile',retJson);

        });
}
router.get('/v5templateSchoolProfile',schoolProfilePage);
router.post('/v5templateSchoolProfile',schoolProfilePage);
//-------------------------------------------------------------------------------------

//----------09学校基本信息页面  师资实力，学生规模ajax 请求接口-----------------------------------------
function studentInformation(req,res,next){

    //          学校基本信息请求接口
    var sCode = req.query.sCode || req.body.sCode || 0;


    //参数判断
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }

    var url = API_BASE_URL + '/front/info/schoolInfoForm?'
        + 'sCode='+sCode;
    superagent.get(url)
        .end(function (err, res2) {
            if (err) {
                console.log("v5templateHome.js [studentInformation_json]request api err: " + err);
                return ret_func(0,'学生规模信息请求错误', res,{});
            }

            var retJson = JSON.parse(res2.text);
            if (retJson.success == 0) {
                return ret_func(0,retJson.msg, res,{});
            }
            res.set('Content-Type', 'application/json');
            res.json(retJson);
        });
}
router.get('/studentInformation_json',studentInformation);
router.post('/studentInformation_json',studentInformation);
//-------------------------------------------------------------------------------------



//----------17 搜索页面 jade 渲染-----------------------------------------
function searchPage(req,res,next){

    //二级侧边栏请求接口
    var sCode = req.query.sCode || req.body.sCode || req.params.sCode|| null;
    var catId = req.query.catId || req.body.catId || req.query.parentId || req.body.parentId||req.params.parentId||null;
    var question = req.query.question || req.body.question ||req.params.question|| "";

    var userInfoJson = req.cookies.zndyKey;
    if(userInfoJson && userInfoJson.length > 2){
        var userId = userInfoJson.id;
    }else{
        var userId ="";
    }
    // 当前页
    var curPage = req.query. curPage|| req.body.curPage || 1;
    // 每页数量
    var pageSize = req.query. pageSize|| req.body.pageSize ||10;
    //参数判断
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    if (typeof catId == 'undefined' || catId == null || catId.length == 0) {
        console.log('***** 二级分类为空');
        return ret_func(0,'二级分类为空', res,{});
    }
    if (typeof question == 'undefined' || question == null || question.length == 0) {
        console.log('***** 提问问题为空');
        return ret_func(0,'提问问题为空', res,{});
    }

    // 向后端发请求 多个请求串形 series 串型,多个请求一个一个发.

    // 获取学校基本配置信息
    v3_1templateHomeUtil.findSchool(sCode, function(findSchoolErr, schoolInfo){
        if(findSchoolErr) {
            console.log("v5templateHome.js [getDetailPage] findSchoolErr: " + findSchoolErr);
            var errMsg = "请求失败";
            errMsg = typeof findSchoolErr == 'string' ? findSchoolErr : errMsg;
            return v3_1templateHomeUtil.ret_json_func(0,errMsg,{},res);
        }
        async.series([
            function(callback) {
                // 获取二级分类信息 **** 0
                v3_1templateHomeUtil.getInfoCatlist(sCode,catId,function(err,data){callback(err,data)});
            },
            function(callback) {
                // 获取搜索列表 **** 1
                v3_1templateHomeUtil.findByKeyWordNew(curPage,pageSize,question,sCode,function(err,data){callback(err,data)});
            },
            function(callback){
                v3_1templateHomeUtil.getSecondPageBarMenu(schoolInfo.code,function(err,data){return callback(err,data)});
            }, // ****3  SPBMenu 导航栏信息
            function(callback){
                v3_1templateHomeUtil.getInfoCatByFAQ(schoolInfo.code,function(err,data){return callback(err,data)});

            },   // ******4请求常见问题 返回父类id
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code,schoolInfo.template, "m12",function(err,data){return callback(err,data)});

            },   // ********5  页尾友情链接
            function(callback){
                v3_1templateHomeUtil.findContactWay(schoolInfo.code,function(err,data){return callback(err,data)});
                // ****6   页尾联系方式
            }
        ],function(err, results){
            if(err) {
                console.log("v5template/v5templateHome.js [v5templateSubList01] requetErr: " + err);
                return v3_1templateHomeUtil.ret_json_func(0,'失败',{},res);
            }
            var catInfo = results[0] || {};
            var reasch = results[1] || [];
            var retJson = {
                'sidebarData' : catInfo,
                'reasch' : reasch,
                'SPBMenu' : results[2],
                'question':results[3],
                'schoolInfo' : schoolInfo,
                'm12': results[4],
                'contact':results[5]
            };
            // 尝试获取用户登录信息
            var userInfoJson = req.cookies.zndyKey;
            if(userInfoJson && userInfoJson.length > 2) {
                var userInfo = JSON.parse(userInfoJson || '{}');
                retJson.userInfo = userInfo;
                retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            }
            // 计算页码数 传入当前页,总页数
            if (retJson.reasch) {
                retJson.reasch.bottomPageNum = calculatePageNum(retJson.reasch.curPage, retJson.reasch.totalPage+1);
            }
            retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            retJson.sidebarData.toString = function(){return JSON.stringify(this)};
            retJson.question.toString = function(){return JSON.stringify(this)};
            retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
            retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
            retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
            retJson.sidebarBookImg = retJson.schoolInfo.styleSidebarBook;  // 将二级侧边栏中的右侧书本背景图信息提取至模型根部,便于jade读取
            retJson.title= retJson.schoolInfo.name+retJson.schoolInfo.professor +"搜索结果页面";
            retJson.question01 = question;
            retJson.host = "http://"+req.hostname;
            res.render('./v3_1template/pages/17_searchPage',retJson);
        });

    });
}
router.get('/v5searchPage',searchPage);
router.post('/v5searchPage',searchPage);

router.searchPage =searchPage;


//-------------------------------------------------------------------------------------



//--------------------18---校园风采页面-----------------------------------------
function photoPage(req,res,next){
    var sCode = req.query.sCode || req.body.sCode ||req.params.sCode|| 0;
    //参数判断
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    // 获取学校基本配置信息
    v3_1templateHomeUtil.findSchool(sCode, function(findSchoolErr, schoolInfo){
        if(findSchoolErr) {
            console.log("v5templateHome.js [getDetailPage] findSchoolErr: " + findSchoolErr);
            var errMsg = "请求失败";
            errMsg = typeof findSchoolErr == 'string' ? findSchoolErr : errMsg;
            return v3_1templateHomeUtil.ret_json_func(0,errMsg,{},res);
        }
        async.series([
            function(callback) {
                // 获取二级页面 校园风采  相册信息 **** 0
                v3_1templateHomeUtil.scenery(sCode,function(err,data){callback(err,data)});
            },
            function(callback){
                v3_1templateHomeUtil.getSecondPageBarMenu(schoolInfo.code,function(err,data){return callback(err,data)});
            }, // ****2  SPBMenu 导航栏信息
            function(callback){
                v3_1templateHomeUtil.getInfoCatByFAQ(schoolInfo.code,function(err,data){return callback(err,data)});
            }, // ****3     question首页搜索框,[常见问题]
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code,schoolInfo.template, "m12",function(err,data){return callback(err,data)});
            },   // ****4     页尾 友情链接  friendLink
            function(callback){
                v3_1templateHomeUtil.findContactWay(schoolInfo.code,function(err,data){return callback(err,data)});
                // ****5   页尾联系方式
            }
        ],function(err, results){
            if(err) {
                console.log("v5template/v5templateHome.js [v5templateSubList01] requetErr: " + err);
                return v3_1templateHomeUtil.ret_json_func(0,'失败',{},res);
            }
            var photo = results[0] || {};
            var retJson = {
                'photo' : photo,
                'SPBMenu' : results[1],
                'question':results[2],
                'm12':results[3],
                'contact':results[4],
                'schoolInfo' : schoolInfo
            };
            // 尝试获取用户登录信息
            var userInfoJson = req.cookies.zndyKey;
            if(userInfoJson && userInfoJson.length > 2) {
                var userInfo = JSON.parse(userInfoJson || '{}');
                retJson.userInfo = userInfo;
                retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
                retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
                retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
                retJson.sidebarBookImg = retJson.schoolInfo.styleSidebarBook;  // 将二级侧边栏中的右侧书本背景图信息提取至模型根部,便于jade读取
            }
            retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
            retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
            retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
            retJson.sidebarBookImg = retJson.schoolInfo.styleSidebarBook;  // 将二级侧边栏中的右侧书本背景图信息提取至模型根部,便于jade读取
            retJson.title= retJson.schoolInfo.name+retJson.schoolInfo.professor +"校园风采";
            retJson.host = "http://"+req.hostname;
            res.render('./v3_1template/pages/18_photoPage',retJson);
        });

    });
}
router.get('/photoPage',photoPage);
router.post('/photoPage',photoPage);
router.photoPage =photoPage;
//------------------------------------------------------------------------


//--------------------18    院系列表-----------------------------------------
function facultyList(req,res,next){
    var retJson = {};
    retJson.host = "http://"+req.hostname;
    res.render('./v3_1template/pages/19_facultyList',retJson);

    requestAgent(res, req, next, url, retJson);
}
router.get('/facultyList',facultyList);
router.post('/facultyList',facultyList);
//------------------------------------------------------------------------




//----------------------------------------------------------


















//--------------------20    院系详情-----------------------------------
function facultyDetail(req,res,next){
    //   学院学校专业详情请求接口
    var departmentId = req.query.departmentId || req.body.departmentId || req.params.departmentId||"";    // 专业id
    var sCode = req.query.sCode || req.body.sCode || req.params.sCode||"";
    var catId = req.query.catId || req.body.catId || req.query.parentId || req.body.parentId||req.params.parentId||null;

    //专业id
    if (typeof departmentId == 'undefined' || departmentId == null || departmentId.length == 0) {
        console.log('***** 专业唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    if (typeof catId == 'undefined' || catId == null || catId.length == 0) {
        console.log('***** 二级分类唯一标识为空');
        return ret_func(0,'二级分类唯一标识错误', res,{});
    }

    // 获取学校基本配置信息
    v3_1templateHomeUtil.findSchool(sCode, function(findSchoolErr, schoolInfo){
        if(findSchoolErr) {
            console.log("v5templateHome.js [getDetailPage] findSchoolErr: " + findSchoolErr);
            var errMsg = "请求失败";
            errMsg = typeof findSchoolErr == 'string' ? findSchoolErr : errMsg;
            return v3_1templateHomeUtil.ret_json_func(0,errMsg,{},res);
        }
        async.series([
            function(callback) {
                // 获取二级分类信息 **** 0
                v3_1templateHomeUtil.getInfoCatlist(sCode,catId,function(err,data){callback(err,data)});
            },
            function(callback) {
                // 获取院系详情信息 **** 1
                v3_1templateHomeUtil.findDepartmentDetail(departmentId,function(err,data){callback(err,data)});
            },
            function(callback){
                v3_1templateHomeUtil.getSecondPageBarMenu(schoolInfo.code, function(err,data){return callback(err,data)});
            }, // ****3  SPBMenu  二级页面 导航栏信息 请求全部的一级分类信息和二级分类信息
            function(callback){
                v3_1templateHomeUtil.getInfoCatByFAQ(schoolInfo.code,function(err,data){return callback(err,data)});
            }, // ****4     question首页搜索框,[常见问题]   ****4
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code,schoolInfo.template, "m12", function(err,data){return callback(err,data)});
            },   // ****5    页尾 友情链接  friendLink   ****5
            function(callback){
                v3_1templateHomeUtil.findContactWay(schoolInfo.code,function(err,data){return callback(err,data)});
                // ****6   页尾联系方式
            }
        ],function(err, results){
            if(err) {
                console.log("v5template/v5templateHome.js [v5templateSubList01] requetErr: " + err);
                return v3_1templateHomeUtil.ret_json_func(0,'失败',{},res);
            }
            var catInfo = results[0] || {};
            var facultyDetail = results[1] || [];
            var retJson = {
                'sidebarData' : catInfo,
                'facultyDetail' : facultyDetail,
                'SPBMenu' : results[2],
                'question':results[3],
                'm12':results[4],
                'contact':results[5],
                'schoolInfo' : schoolInfo
            };
            // 尝试获取用户登录信息
            var userInfoJson = req.cookies.zndyKey;
            if(userInfoJson && userInfoJson.length > 2) {
                var userInfo = JSON.parse(userInfoJson || '{}');
                retJson.userInfo = userInfo;
                retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
                retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
                retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
                retJson.sidebarBookImg = retJson.schoolInfo.styleSidebarBook;  // 将二级侧边栏中的右侧书本背景图信息提取至模型根部,便于jade读取
            }
            retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
            retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
            retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
            retJson.sidebarBookImg = retJson.schoolInfo.styleSidebarBook;  // 将二级侧边栏中的右侧书本背景图信息提取至模型根部,便于jade读取
            retJson.title= retJson.schoolInfo.name + retJson.schoolInfo.professor +"院系详情";
            retJson.host = "http://"+req.hostname;
            res.render('./v3_1template/pages/20_facultyDetail',retJson);
        });

    });
}
router.get('/facultyDetail',facultyDetail);
router.post('/facultyDetail',facultyDetail);
router.facultyDetail = facultyDetail;
//------------------------------------------------------------------------


//--------------------------二级页面子菜单05----ajax请求 根据用户的信息,展示专业列表----------------------------
function facultyListPage_json(req,res,next){
    //   获取专业列表请求接口
    var sCode = req.query.sCode || req.body.sCode || 0;
    var needPage = 'false';
    var name = req.query.name || req.body.name || "";


    //参数判断
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    if (name==""){
        var url = API_BASE_URL + '/front/info/getFrontDepList?'
            + 'sCode=' + sCode
            + '&needPage=' + needPage;
    }else{
        var url = API_BASE_URL + '/front/info/getFrontDepList?'
            + 'sCode=' + sCode
            + '&needPage=' + needPage
            + '&departmentName=' + name;
    }
    url = encodeURI(url);
    superagent.get(url)
        .end(function (err, res2) {
            if (err) {
                console.log("v5template/v5templateHome.js [facultyListPage_json]request api err: " + err);
                return ret_func(0, '院系列表查询列表请求错误', res, {});
            }

            var retJson = JSON.parse(res2.text);
            if (retJson.success == 0) {
                return ret_func(0, retJson.msg, res, {});
            }
            // 点击个人昵称跳转到个人资料这一页面
            retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            res.json(retJson);
        });

}
router.get('/facultyListPage_json',facultyListPage_json);
router.post('/facultyListPage_json',facultyListPage_json);
//-------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------


//----------21 招生计划单个页面 jade 渲染(招生列表后面)-----------------------------------------
function enrollmentPlanPage(req,res,next){

    //二级侧边栏请求接口
    var sCode = req.query.sCode || req.body.sCode || req.params.sCode|| 0;
    var catId = req.query.catId || req.body.catId ||req.query.parentId || req.body.parentId|| req.params.parentId|| 0;

    //参数判断
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    if (typeof catId == 'undefined' || catId == null || catId.length == 0) {
        console.log('***** 二级分类为空');
        return ret_func(0,'二级分类为空', res,{});
    }


    // 向后端发请求 多个请求串形 series 串型,多个请求一个一个发.

    // 获取学校基本配置信息
    v3_1templateHomeUtil.findSchool(sCode, function(findSchoolErr, schoolInfo){
        if(findSchoolErr) {
            console.log("v5templateHome.js [getDetailPage] findSchoolErr: " + findSchoolErr);
            var errMsg = "请求失败";
            errMsg = typeof findSchoolErr == 'string' ? findSchoolErr : errMsg;
            return v3_1templateHomeUtil.ret_json_func(0,errMsg,{},res);
        }
        async.series([
            function(callback) {
                // 获取二级分类信息 **** 0
                v3_1templateHomeUtil.getInfoCatlist(sCode,catId,function(err,data){callback(err,data)});
            },
            function(callback){
                v3_1templateHomeUtil.getSecondPageBarMenu(schoolInfo.code, function(err,data){return callback(err,data)});
            }, // ****  2  SPBMenu  二级页面导航栏信息  请求全部的一级分类信息和二级分类信息
            function(callback){
                v3_1templateHomeUtil.getInfoCatByFAQ(schoolInfo.code,function(err,data){return callback(err,data)});

            },   // ******  3     请求常见问题 返回父类id
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code,schoolInfo.template, "m12", function(err,data){return callback(err,data)});

            },   // ******** 4     页尾友情链接
            function(callback){
                v3_1templateHomeUtil.findContactWay(schoolInfo.code,function(err,data){return callback(err,data)});
                // ****5   页尾联系方式
            }
        ],function(err, results){
            if(err) {
                console.log("v5template/v5templateHome.js [enrollmentPlanPage] requetErr: " + err);
                return v3_1templateHomeUtil.ret_json_func(0,'失败',{},res);
            }
            var catInfo = results[0] || {};
            var retJson = {
                'sidebarData' : catInfo,
                'SPBMenu' : results[1],
                'question':results[2],
                'schoolInfo' : schoolInfo,
                'm12': results[3],
                'contact':results[4]
            };
            // 尝试获取用户登录信息
            var userInfoJson = req.cookies.zndyKey;
            if(userInfoJson && userInfoJson.length > 2) {
                var userInfo = JSON.parse(userInfoJson || '{}');
                retJson.userInfo = userInfo;
                retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            }
            retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            retJson.sidebarData.toString = function(){return JSON.stringify(this)};
            retJson.question.toString = function(){return JSON.stringify(this)};
            retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
            retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
            retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
            retJson.sidebarBookImg = retJson.schoolInfo.styleSidebarBook;  // 将二级侧边栏中的右侧书本背景图信息提取至模型根部,便于jade读取
            retJson.title= retJson.schoolInfo.name+retJson.schoolInfo.professor +"招生计划页面";
            retJson.host = "http://"+req.hostname;
            res.render('./v3_1template/pages/21_enrollmentPlan',retJson);
        });

    });
}
router.get('/enrollmentPlanPage',enrollmentPlanPage);
router.post('/enrollmentPlanPage',enrollmentPlanPage);
router.enrollmentPlanPage = enrollmentPlanPage;


//---------------------------------------------------------------------------------

//----------21 招生计划单个页面 jade 渲染(招生列表后面)-----------------------------------------
function admissionHistoryPage(req,res,next){

    //二级侧边栏请求接口
    var sCode = req.query.sCode || req.body.sCode ||req.params.sCode|| 0;
    var catId = req.query.catId || req.body.catId || req.query.parentId || req.body.parentId||req.params.parentId||0;

    //参数判断
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    if (typeof catId == 'undefined' || catId == null || catId.length == 0) {
        console.log('***** 二级分类为空');
        return ret_func(0,'二级分类为空', res,{});
    }


    // 向后端发请求 多个请求串形 series 串型,多个请求一个一个发.

    // 获取学校基本配置信息
    v3_1templateHomeUtil.findSchool(sCode, function(findSchoolErr, schoolInfo){
        if(findSchoolErr) {
            console.log("v5templateHome.js [getDetailPage] findSchoolErr: " + findSchoolErr);
            var errMsg = "请求失败";
            errMsg = typeof findSchoolErr == 'string' ? findSchoolErr : errMsg;
            return v3_1templateHomeUtil.ret_json_func(0,errMsg,{},res);
        }
        async.series([
            function(callback) {
                // 获取二级分类信息 **** 0
                v3_1templateHomeUtil.getInfoCatlist(sCode,catId,function(err,data){callback(err,data)});
            },
            function(callback){
                v3_1templateHomeUtil.getSecondPageBarMenu(schoolInfo.code,function(err,data){return callback(err,data)});
            }, // ****  2  SPBMenu    二级页面导航栏信息  请求全部的一级分类信息和二级分类
            function(callback){
                v3_1templateHomeUtil.getInfoCatByFAQ(schoolInfo.code,function(err,data){return callback(err,data)});

            },   // ******  3     请求常见问题 返回父类id
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code,schoolInfo.template, "m12",function(err,data){return callback(err,data)});

            },   // ******** 4     页尾友情链接
            function(callback){
                v3_1templateHomeUtil.findContactWay(schoolInfo.code,function(err,data){return callback(err,data)});
                // ****5    联系方式
            }
        ],function(err, results){
            if(err) {
                console.log("v5template/v5templateHome.js [enrollmentPlanPage] requetErr: " + err);
                return v3_1templateHomeUtil.ret_json_func(0,'失败',{},res);
            }
            var catInfo = results[0] || {};
            var retJson = {
                'sidebarData' : catInfo,
                'SPBMenu' : results[1],
                'question':results[2],
                'schoolInfo' : schoolInfo,
                'm12': results[3],
                'contact':results[4]
            };
            // 尝试获取用户登录信息
            var userInfoJson = req.cookies.zndyKey;
            if(userInfoJson && userInfoJson.length > 2) {
                var userInfo = JSON.parse(userInfoJson || '{}');
                retJson.userInfo = userInfo;
                retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            }
            retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            retJson.sidebarData.toString = function(){return JSON.stringify(this)};
            retJson.question.toString = function(){return JSON.stringify(this)};
            retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
            retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
            retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
            retJson.sidebarBookImg = retJson.schoolInfo.styleSidebarBook;  // 将二级侧边栏中的右侧书本背景图信息提取至模型根部,便于jade读取
            retJson.title= retJson.schoolInfo.name+retJson.schoolInfo.professor +"历史录取页面";
            retJson.host = "http://"+req.hostname;
            res.render('./v3_1template/pages/22_admissionHistory',retJson);
        });

    });
}
router.get('/admissionHistoryPage',admissionHistoryPage);
router.post('/admissionHistoryPage',admissionHistoryPage);
router.admissionHistoryPage = admissionHistoryPage;


//---------------------------------------------------------------------------------

//----------------报考指南点击之后,出现的专业详解----------------------------------------------------------------------
function researchDirectionDetail(req,res,next){

    //二级侧边栏请求接口
    var sCode = req.query.sCode || req.body.sCode || req.params.sCode||0;
    var catId = req.query.parentId || req.body.parentId || req.params.parentId||0 ;
    var majorResearchId = req.query.majorResearchId || req.body.majorResearchId || req.params.majorResearchId||0;
    //参数判断
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    if (typeof catId == 'undefined' || catId == null || catId.length == 0) {
        console.log('***** 二级分类为空');
        return ret_func(0,'二级分类为空', res,{});
    }
    if (typeof majorResearchId == 'undefined' || majorResearchId == null || majorResearchId.length == 0) {
        console.log('***** 二级分类为空');
        return ret_func(0,'二级分类为空', res,{});
    }


    // 向后端发请求 多个请求串形 series 串型,多个请求一个一个发.

    // 获取学校基本配置信息
    v3_1templateHomeUtil.findSchool(sCode, function(findSchoolErr, schoolInfo){
        if(findSchoolErr) {
            console.log("v5templateHome.js [getDetailPage] findSchoolErr: " + findSchoolErr);
            var errMsg = "请求失败";
            errMsg = typeof findSchoolErr == 'string' ? findSchoolErr : errMsg;
            return v3_1templateHomeUtil.ret_json_func(0,errMsg,{},res);
        }
        async.series([
            function(callback) {
                // 获取二级分类信息 **** 0
                v3_1templateHomeUtil.getInfoCatlist(sCode,catId,function(err,data){callback(err,data)});
            },
            function(callback){
                v3_1templateHomeUtil.getSecondPageBarMenu(schoolInfo.code, function(err,data){return callback(err,data)});
            }, // ****  2  SPBMenu   二级页面导航栏信息  请求全部的一级分类信息和二级分类信息
            function(callback){
                v3_1templateHomeUtil.getInfoCatByFAQ(schoolInfo.code,function(err,data){return callback(err,data)});

            },   // ******  3     请求常见问题 返回父类id
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code,schoolInfo.template, "m12",function(err,data){return callback(err,data)});

            },   // ******** 4     页尾友情链接
            function(callback){
                v3_1templateHomeUtil.getMajorResearchDetail(majorResearchId,function(err,data){return callback(err,data)});

            },   // ******** 5     请求研究方向页面中,报考指南,点击专业查看,出现专业详情页面
            function(callback){
                v3_1templateHomeUtil.findContactWay(schoolInfo.code,function(err,data){return callback(err,data)});
                // ****6    联系方式
            }
        ],function(err, results){
            if(err) {
                console.log("v5template/v5templateHome.js [enrollmentPlanPage] requetErr: " + err);
                return v3_1templateHomeUtil.ret_json_func(0,'失败',{},res);
            }
            var catInfo = results[0] || {};
            var retJson = {
                'sidebarData' : catInfo,
                'SPBMenu' : results[1],
                'question':results[2],
                'schoolInfo' : schoolInfo,
                'm12': results[3],
                'MajorResearchDetail': results[4],
                'contact': results[5]
            };
            // 尝试获取用户登录信息
            var userInfoJson = req.cookies.zndyKey;
            if(userInfoJson && userInfoJson.length > 2) {
                var userInfo = JSON.parse(userInfoJson || '{}');
                retJson.userInfo = userInfo;
                retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            }
            retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            retJson.sidebarData.toString = function(){return JSON.stringify(this)};
            retJson.question.toString = function(){return JSON.stringify(this)};
            retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
            retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
            retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
            retJson.sidebarBookImg = retJson.schoolInfo.styleSidebarBook;  // 将二级侧边栏中的右侧书本背景图信息提取至模型根部,便于jade读取
            retJson.title= retJson.schoolInfo.name+retJson.schoolInfo.professor +"专业介绍";
            retJson.host = "http://"+req.hostname;
            //console.log(JSON.stringify(retJson));
            res.render('./v3_1template/pages/23_ResearchDirectionDetail',retJson);
        });

    });
}
router.get('/researchDirectionDetail',researchDirectionDetail);
router.post('/researchDirectionDetail',researchDirectionDetail);
router.researchDirectionDetail = researchDirectionDetail;


//--------------------------二级页面子菜单04--jade页面 招录公告 文章标题列表----------------------------
/**
 * 获取制定分类下的文章／标题列表
 *
 * 参数：sCode 学校唯一标识
 * 参数：curPage 当前页
 * 参数：pageSize 页容量
 *
 * 返回结果： {}
 *
 * 测试地址：http://localhost:3000/v5templateHome/v5templateSubList01?sCode=NLGYFE&catId=708&curPage=1&pageSize
 * */
function recruitment(req,res,next){
    //二级侧边栏请求接口
    var sCode = req.query.sCode || req.body.sCode ||req.params.sCode|| 0;
    var isNotice = 0;
    //参数判断
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    if (typeof isNotice == 'undefined' || isNotice == null || isNotice.length == 0) {
        console.log('***** 二级分类为空');
        return ret_func(0,'二级分类为空', res,{});
    }
    // 当前页
    var curPage = req.query. curPage|| req.body.curPage ||1;
    // 每页数量
    var pageSize = req.query. pageSize|| req.body.pageSize ||10;
    // 向后端发请求 多个请求串形 series 串型,多个请求一个一个发.

    // 获取学校基本配置信息
    v3_1templateHomeUtil.findSchool(sCode, function(findSchoolErr, schoolInfo){
        if(findSchoolErr) {
            console.log("v5templateHome.js [getDetailPage] findSchoolErr: " + findSchoolErr);
            var errMsg = "请求失败";
            errMsg = typeof findSchoolErr == 'string' ? findSchoolErr : errMsg;
            return v3_1templateHomeUtil.ret_json_func(0,errMsg,{},res);
        }
        async.series([
            function(callback) {
                // 获取列表 **** 1
                v3_1templateHomeUtil.recruitmentPage(sCode,isNotice,curPage,pageSize,function(err,data){callback(err,data)});
            },
            function(callback){
                v3_1templateHomeUtil.getSecondPageBarMenu(schoolInfo.code, function(err,data){return callback(err,data)});
            }, // ****3  SPBMenu 导航栏信息 首页导航栏请求全部的一级分类和二级分类
            function(callback){
                v3_1templateHomeUtil.getInfoCatByFAQ(schoolInfo.code,function(err,data){return callback(err,data)});
            }, // ****4     question首页搜索框,[常见问题]
            function(callback){
                v3_1templateHomeUtil.getMainPageModuleInfo(schoolInfo.code,schoolInfo.template, "m12",function(err,data){return callback(err,data)});
            },   // ****5     页尾 友情链接  m12
            function(callback){
                v3_1templateHomeUtil.findContactWay(schoolInfo.code,function(err,data){return callback(err,data)});
                // ****6   页尾联系方式
            }

        ],function(err, results){
            if(err) {
                console.log("v5template/v5templateHome.js [v5templateSubList01] requetErr: " + err);
                return v3_1templateHomeUtil.ret_json_func(0,'失败',{},res);
            }
            var contentInfo = results[0] || [];
            var retJson = {
                'contentInfo' : contentInfo,
                'SPBMenu' : results[1],
                'question':results[2],
                'm12':results[3],
                'contact':results[4],
                'schoolInfo' : schoolInfo
            };

            // 尝试获取用户登录信息
            var userInfoJson = req.cookies.zndyKey;
            if(userInfoJson && userInfoJson.length > 2) {
                var userInfo = JSON.parse(userInfoJson || '{}');
                retJson.userInfo = userInfo;
                // 点击个人昵称跳转到个人资料这一页面
                retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            }
            // 计算页码数 传入当前页,总页数
            if (retJson.contentInfo) {
                retJson.contentInfo.bottomPageNum = calculatePageNum(curPage, retJson.contentInfo.totalPage+1);
            }



            retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
            retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
            retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
            retJson.sidebarBookImg = retJson.schoolInfo.styleSidebarBook;  // 将二级侧边栏中的右侧书本背景图信息提取至模型根部,便于jade读取
            retJson.contentInfo.toString = function(){return JSON.stringify(this)};
            retJson.title= retJson.schoolInfo.name+retJson.schoolInfo.professor +retJson.contentInfo.secondCatName;
            //console.log(JSON.stringify(retJson));
            retJson.host = "http://" + req.hostname;
            res.render('./v3_1template/pages/24_noticeList',retJson);
        });

    });



}
router.get('/recruitment',recruitment);
router.post('/recruitment',recruitment);
router.recruitment =recruitment;





module.exports = router;