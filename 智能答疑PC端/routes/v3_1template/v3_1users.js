/**
 * created by abby 2017/7/18
 */
var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var CONFIG = require('../../config');
var API_BASE_URL =  CONFIG.API_SERVER_FULL_URL;
var base_sever_url = CONFIG.HOME_SERVER_FULL_URL;
var async = require('async');
var v3_1templateHomeUtil = require('../util/v3_1templateHomeUtil');
var fs = require('fs');
var jade = require('jade');
var moment = require('moment');
var v3_1home = require('./v3_1home');




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

//--------------------404错误页面-----------------------------------------
function errorPage(req,res,next){
    var retJson = {};
    retJson.host = "http://"+req.hostname;
    res.render('./error',retJson);
}
router.get('/errorPage',errorPage);
router.post('/errorPage',errorPage);
router.errorPage =errorPage;
//------------------------------------------------------------------------

//-------------------系统提示维护页面-----------------------------------------
function cutOffPage(req,res,next){
    var retJson = {};
    retJson.host = "http://"+req.hostname;
    res.render('./cutOff',retJson);
}
router.get('/cutOffPage',cutOffPage);
router.post('/cutOffPage',cutOffPage);
router.cutOffPage =cutOffPage;
//------------------------------------------------------------------------









//---------------------地大研招10-注册jade页面-----------------------------------------
function registerPage(req,res,next){
    var sCode = req.query.sCode || req.body.sCode ||req.params.sCode||"";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    var needOpen = req.query.needOpen || req.body.needOpen ||"";
    var hoster = req.query.hoster || req.body.hoster ||"";
    // 发请求
    v3_1templateHomeUtil.findSchool(sCode,function(err,schoolInfo){

        if(err) {
            console.log("v5templateHome.js [getDetailPage] findSchoolErr: " + err);
            var errMsg = "请求失败";
            errMsg = typeof err == 'string' ? err : errMsg;
            return v3_1templateHomeUtil.ret_json_func(0,errMsg,{},res);
        }
        async.series([
            function(callback){
                v3_1templateHomeUtil.getInfoCatByFAQ(schoolInfo.code,function(err,data){return callback(err,data)});
            } // ****0     question首页搜索框,[常见问题]

        ],function(err, results){
            if(err) {
                console.log("v5template/v5templateHome.js [v5templateSubList01] requetErr: " + err);
                return v3_1templateHomeUtil.ret_json_func(0,'失败',{},res);
            }
            var retJson = {
                'question':results[0],
                'schoolInfo' : schoolInfo,
                'needOpen':needOpen,
                'hoster':hoster
            };
            // 忘记密码
            retJson.urlForgetPassword= base_sever_url + "/v5users/v5forgetPassword";
            // 免费注册
            retJson.urlRegisterPage= base_sever_url + "/secondPage/secondPageLogin?"+sCode;
            retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
            retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
            retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
            console.log(JSON.stringify(retJson));
            retJson.title= retJson.schoolInfo.name+"-"+retJson.schoolInfo.professor +"-"+"注册";
            retJson.host = "http://"+req.hostname;
            res.render('./v3_1template/pages/10_register',retJson);

        });
    });
}
router.get('/v5registerPage',registerPage);
router.post('/v5registerPage',registerPage);
router.registerPage=registerPage;
//------------------------------------------------------------------------



//-------------发送短信验证码ajax 请求-----------------------------------------------------

/* 获取主页数据.
 * 方式:      GET
 * 参数:      邮箱
 * 返回：     json对象
 * 测试地址：
 * */
function sendVerCode(req, res, next) {

    var toEmail= req.body.email || req.query.email ;
    var codeType= req.body.codeType || req.query.codeType ;

    var quickly = false;
    if(quickly){
        var retJson = {data: {},msg:'您发送验证码太过频繁！',success:0}
        res.set('Content-Type', 'application/json');
        res.json(retJson);
        return;
    }

    var url = API_BASE_URL+'/front/user/sendEmailValiCode?'
        + 'toEmail='+toEmail
        + '&codeType='+codeType;
    superagent.get(url)
        .end(function(err, res2){
            if (err) {
                console.log("v5user.js request api err: " + err);
                return ret_func(0,'发送验证码请求错误', res,{});
            }

            console.log('res2.text=\n'+res2.text);
            var retJson = JSON.parse(res2.text);
            res.json(retJson);
        });


}

router.post('/v5sendVerCode', sendVerCode);//
router.get('/v5sendVerCode', sendVerCode);

//-------------------------------------------------------------------------------------
//-------------修改密码界面---发送短信验证码ajax 请求-----------------------------------------------------

/* 获取主页数据.
 * 方式:      GET
 * 参数:      邮箱
 * 返回：     json对象
 * 测试地址：
 * */
function v5sendVerCodeModify(req, res, next) {

    var toEmail= req.body.email || req.query.email ;
    var codeType= req.body.codeType || req.query.codeType ;
    // 从cookie 中获取用户userId
    var userInfoJson = req.cookies.zndyKey;
    if(!userInfoJson || userInfoJson.length <= 0) {
        // 用户未登录
    }
    var userInfo = JSON.parse(userInfoJson);
    var userToken = userInfo.userToken;

    var quickly = false;
    if(quickly){
        var retJson = {data: {},msg:'您发送验证码太过频繁！',success:0}
        res.set('Content-Type', 'application/json');
        res.json(retJson);
        return;
    }

    var url = API_BASE_URL+'/front/user/sendEmailValiCode?'
        + 'toEmail='+toEmail
        + '&codeType='+codeType
        + '&userToken='+userToken;
    superagent.get(url)
        .end(function(err, res2){
            if (err) {
                console.log("v5user.js request api err: " + err);
                return ret_func(0,'发送验证码请求错误', res,{});
            }

            console.log('res2.text=\n'+res2.text);
            var retJson = JSON.parse(res2.text);
            res.json(retJson);
        });


}

router.post('/v5sendVerCodeModify', v5sendVerCodeModify);//
router.get('/v5sendVerCodeModify', v5sendVerCodeModify);

//-----------修改密码界面------发送验证码请求 需要传一个userId--------------------------------------------------------------------


//---------------------地大研招10页面-注册按钮ajax请求接口-----------------------------------------
function v5register_json(req,res,next){
    // 注册按钮ajax请求接口
    var sCode = req.query.sCode || req.body.sCode || 0;
    // 账号
    var account = req.query. account|| req.body.account || 0;
    // 用户名 昵称
    var nickName = req.query. nickName|| req.body.nickName || 0;
    // 邮箱
    var email = req.query. email|| req.body.email || 0;
    // 邮箱验证码
    var valiCode = req.query. valiCode|| req.body.valiCode || 0;
    // 邮箱验证码
    var emailValicode = req.query. emailValicode|| req.body.emailValicode || 0;
    // 省份id
    var provinceId = req.query. provinceId|| req.body.provinceId || 0;
    // 省份名称
    var provinceName = req.query. provinceName|| req.body.provinceName || 0;
    // 密码
    var password = req.query. password|| req.body.password || 0;

    //参数判断
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识为空', res,{});
    }
    if (typeof account == 'undefined' || account == null || account.length == 0) {
        console.log('***** 用户账号为空');
        return ret_func(0,'用户账号为空', res,{});
    }
    if (typeof nickName == 'undefined' || nickName == null || nickName.length == 0) {
        console.log('***** 用户昵称为空');
        return ret_func(0,'用户昵称为空', res,{});
    }
    if (typeof email == 'undefined' || email == null || email.length == 0) {
        console.log('***** 邮箱为空');
        return ret_func(0,'邮箱为空', res,{});
    }
    if (typeof valiCode == 'undefined' || valiCode == null || valiCode.length == 0) {
        console.log('***** 邮箱验证码为空');
        return ret_func(0,'邮箱验证码为空', res,{});
    }
    if (typeof provinceId == 'undefined' || provinceId == null || provinceId.length == 0) {
        console.log('***** 省份id为空');
        return ret_func(0,'省份id为空', res,{});
    }
    if (typeof provinceName == 'undefined' || provinceName == null || provinceName.length == 0) {
        console.log('***** 省份名称为空');
        return ret_func(0,'省份名称为空', res,{});
    }
    if (typeof password == 'undefined' || password == null || password.length == 0) {
        console.log('***** 密码为空');
        return ret_func(0,'密码为空', res,{});
    }

    //// 请求接口
    //var url = API_BASE_URL + '/front/user/register';
    //var para ={
    //    account : account,
    //    nickName : nickName,
    //    email:email,
    //    emailValicode : emailValicode,
    //    schoolCode : sCode,
    //    valiCode : valiCode,
    //    provinceId : provinceId,
    //    provinceName : provinceName,
    //    password : password
    //}
    var url = API_BASE_URL + '/front/user/register?'
        + 'schoolCode='+sCode
        + '&account='+account
        + '&nickName='+nickName
        + '&email='+email
        + '&emailValicode='+emailValicode
        + '&valiCode='+valiCode
        + '&provinceId='+provinceId
        + '&provinceName='+provinceName
        + '&password='+password;
    url = encodeURI(url);

    superagent.get(url)
        .end(function (err, res2) {
            if (err) {
                console.log("v5templateHome.js request api err: " + err);
                return;
            }

            var retJson = JSON.parse(res2.text);
            if (retJson.success == 0) {
                return ret_func(0,retJson.msg, res,{});
            }
            // 登录
            retJson.urlLoginPage= base_sever_url + "/secondPage/secondPageLogin?"+sCode;
            res.set('Content-Type', 'application/json');
            res.json(retJson);

        });
}
router.get('/v5register_json',v5register_json);
router.post('/v5register_json',v5register_json);
//------------------------------------------------------------------------













//----------10注册页面 获取生源地省份信息 ajax 请求接口-----------------------------------------
function origin_json(req,res,next){

    var url = API_BASE_URL + '/front/template/findProvinceList';
    superagent.get(url)
        .end(function (err, res2) {
            if (err) {
                console.log("v5templateHome.js request api err: " + err);
                return ret_func(0,'生源地省份请求错误', res,{});
            }

            var retJson = JSON.parse(res2.text);
            if (retJson.success == 0) {
                return ret_func(0,retJson.msg, res,{});
            }
            res.set('Content-Type', 'application/json');
            res.json(retJson);
        });
}
router.get('/origin_json',origin_json);
router.post('/origin_json',origin_json);
//-------------------------------------------------------------------------------------







//---------------------地大研招11-登录jade页面-----------------------------------------
function loginPage(req,res,next){
    var sCode = req.query.sCode || req.body.sCode ||req.params.sCode||"";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    var needOpen = req.query.needOpen || req.body.needOpen || "";
    var hoster = req.query.hoster || req.body.hoster || "";
    // 发请求
    v3_1templateHomeUtil.findSchool(sCode,function(err,schoolInfo){

        if(err) {
            console.log("v5templateHome.js [getDetailPage] findSchoolErr: " + err);
            var errMsg = "请求失败";
            errMsg = typeof err == 'string' ? err : errMsg;
            return v3_1templateHomeUtil.ret_json_func(0,errMsg,{},res);
        }
        async.series([
            function(callback){
                v3_1templateHomeUtil.getInfoCatByFAQ(schoolInfo.code,function(err,data){return callback(err,data)});
            } // ****0     question首页搜索框,[常见问题]

        ],function(err, results){
            if(err) {
                console.log("v5template/v5templateHome.js [v5templateSubList01] requetErr: " + err);
                return v3_1templateHomeUtil.ret_json_func(0,'失败',{},res);
            }
            var retJson = {
                'question':results[0],
                'schoolInfo' : schoolInfo,
                'needOpen':needOpen,
                'hoster':hoster
            };
            // 忘记密码
            retJson.urlForgetPassword= base_sever_url + "/v3_1users/v5forgetPassword";
            // 免费注册
            retJson.urlRegisterPage= base_sever_url + "/v3_1users/v5registerPage";
            // 首页
            retJson.urlHomePage = base_sever_url+ "/v3_1home/getHomePage";
            retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
            retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
            retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
            console.log(JSON.stringify(retJson));
            retJson.title= retJson.schoolInfo.name+"-"+retJson.schoolInfo.professor +"-"+"登录";
            retJson.host = "http://"+req.hostname;
            res.render('./v3_1template/pages/11_login',retJson);
        });
    });
}
router.get('/v5loginPage',loginPage);
router.post('/v5loginPage',loginPage);
router.loginPage = loginPage;
//------------------------------------------------------------------------


//---------------------地大研招11-登录按钮ajax请求接口-----------------------------------------
function loginPage_json(req,res,next){
    // 登录ajax请求接口
    res.header("Access-Control-Allow-Origin", "*");   //设置跨域访问
    var sCode = req.query.sCode || req.body.sCode || 0;
    // 账户
    var account = req.query. account|| req.body.account || 0;
    // 密码
    var password = req.query. password|| req.body.password || 0;
    var identify = req.query. identify|| req.body.identify || 0;


    //参数判断
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识为空', res,{});
    }
    if (typeof account == 'undefined' || account == null || account.length == 0) {
        console.log('***** 用户账户为空');
        return ret_func(0,'用户账户为空', res,{});
    }
    if (typeof password == 'undefined' || password == null || password.length == 0) {
        console.log('***** 用户密码为空');
        return ret_func(0,'用户密码为空', res,{});
    }
    if (typeof identify == 'undefined' || identify == null || identify.length == 0) {
        console.log('***** 用户密码为空');
        return ret_func(0,'用户密码为空', res,{});
    }

    var url = API_BASE_URL + '/front/user/login?'
        + 'sCode='+sCode
        + '&account='+account
        + '&password='+password;
    superagent.get(url)
        .end(function (err, res2) {
            if (err) {
                console.log("v5templateHome.js request api err: " + err);
                return ret_func(0,'登录接口ajax请求错误', res,{});
            }

            var retJson = JSON.parse(res2.text);
            if (retJson && retJson.retCode == "0") {
                // 缓存用户登录信息到cookie中去
                res.cookie('zndyKey', JSON.stringify(retJson.data), { maxAge: 12960000/**15天*/, httpOnly: true});

                // 首页
                retJson.urlHomePage = base_sever_url+ "/" + identify;
                res.set('Content-Type', 'application/json');
                res.json(retJson);
            }else{
                res.set('Content-Type', 'application/json');
                res.json(retJson);
            }


        });
}
router.get('/loginPage_json',loginPage_json);
router.post('/loginPage_json',loginPage_json);
//------------------------------------------------------------------------

//---------------检验验证码的正确性----------------------------------------------------------
function checkCode_json(req,res,next){
    // 账户
    var validateCode= req.body.validateCode || req.query.validateCode ;
    var account= req.body.account || req.query.account ;
    var codeType= req.body.codeType || req.query.codeType ;

    //参数判断
    if (typeof codeType == 'undefined' || codeType == null || codeType.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识为空', res,{});
    }
    if (typeof account == 'undefined' || account == null || account.length == 0) {
        console.log('***** 用户账户为空');
        return ret_func(0,'用户账户为空', res,{});
    }
    if (typeof validateCode == 'undefined' || validateCode == null || validateCode.length == 0) {
        console.log('***** 用户密码为空');
        return ret_func(0,'用户密码为空', res,{});
    }
    var url = API_BASE_URL + '/front/user/checkValidateCode?'
        + 'validateCode='+validateCode
        + '&account='+account
        + '&codeType='+codeType;
    superagent.get(url)
        .end(function (err, res2) {
            if (err) {
                console.log("v5templateHome.js request api err: " + err);
                return ret_func(0,'检查验证码正确性的接口ajax请求错误', res,{});
            }

            var retJson = JSON.parse(res2.text);
            if (retJson.success == 0) {
                return ret_func(0,retJson.msg, res,{});
            }
            res.set('Content-Type', 'application/json');
            res.json(retJson);

        });
}
router.get('/checkCode_json',checkCode_json);
router.post('/checkCode_json',checkCode_json);
//------------------------------------------------------------------------









//---------------------地大研招12-忘记密码jade页面-----------------------------------------
function forgetPasswordPage(req,res,next){
    var sCode = req.query.sCode || req.body.sCode ||req.params.sCode||"";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    // 发请求
    v3_1templateHomeUtil.findSchool(sCode,function(err,schoolInfo){

        if(err) {
            console.log("v5templateHome.js [getDetailPage] findSchoolErr: " + err);
            var errMsg = "请求失败";
            errMsg = typeof err == 'string' ? err : errMsg;
            return v3_1templateHomeUtil.ret_json_func(0,errMsg,{},res);
        }
        async.series([
            function(callback){
                v3_1templateHomeUtil.getInfoCatByFAQ(schoolInfo.code,function(err,data){return callback(err,data)});
            } // ****0     question首页搜索框,[常见问题]

        ],function(err, results){
            if(err) {
                console.log("v5template/v5templateHome.js [v5templateSubList01] requetErr: " + err);
                return v3_1templateHomeUtil.ret_json_func(0,'失败',{},res);
            }
            var retJson = {
                'question':results[0],
                'schoolInfo' : schoolInfo
            };
            // 免费注册
            retJson.urlRegisterPage= base_sever_url + "/secondPage/secondPageLogin?"+"sCode="+sCode;
            retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
            retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
            retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
            console.log(JSON.stringify(retJson));
            retJson.title= retJson.schoolInfo.name +"-"+retJson.schoolInfo.professor +"-"+"忘记密码";
            retJson.host = "http://"+req.hostname;
            res.render('./v3_1template/pages/12_forgetPassword',retJson);
        });
    });
}
router.get('/v5forgetPassword',forgetPasswordPage);
router.post('/v5forgetPassword',forgetPasswordPage);
router.forgetPasswordPage=forgetPasswordPage;
//------------------------------------------------------------------------


//--------12-忘记密码页面------忘记密码接口ajax请求----------------------------------------------------------
function forgetPassword_json(req,res,next){
    // 账户
    var email= req.body.email || req.query.email ;
    var valiCode= req.body.valiCode || req.query.valiCode ;
    var password= req.body.password || req.query.password ;

    //参数判断
    if (typeof email == 'undefined' || email == null || email.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识为空', res,{});
    }
    if (typeof valiCode == 'undefined' || valiCode == null || valiCode.length == 0) {
        console.log('***** 用户账户为空');
        return ret_func(0,'用户账户为空', res,{});
    }
    if (typeof password == 'undefined' || password == null || password.length == 0) {
        console.log('***** 用户密码为空');
        return ret_func(0,'用户密码为空', res,{});
    }
    var url = API_BASE_URL + '/front/user/forgetPassword?'
        + 'email='+email
        + '&valiCode='+valiCode
        + '&password='+password;
    superagent.get(url)
        .end(function (err, res2) {
            if (err) {
                console.log("v5templateHome.js request api err: " + err);
                return ret_func(0,'忘记接口ajax请求错误', res,{});
            }

            var retJson = JSON.parse(res2.text);
            if (retJson.success == 0) {
                return ret_func(0,retJson.msg, res,{});
            }
            res.set('Content-Type', 'application/json');
            res.json(retJson);

        });
}
router.get('/forgetPassword_json',forgetPassword_json);
router.post('/forgetPassword_json',forgetPassword_json);
//------------------------------------------------------------------------





















//---------------------地大研招13-修改密码jade页面-----------------------------------------
function modifyPasswordPage(req,res,next){
    var sCode = req.query.sCode || req.body.sCode ||req.params.sCode|| "";
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    // 发请求
    v3_1templateHomeUtil.findSchool(sCode,function(err,schoolInfo){

        if(err) {
            console.log("v5templateHome.js [getDetailPage] findSchoolErr: " + err);
            var errMsg = "请求失败";
            errMsg = typeof err == 'string' ? err : errMsg;
            return v3_1templateHomeUtil.ret_json_func(0,errMsg,{},res);
        }
        async.series([
            function(callback){
                v3_1templateHomeUtil.getInfoCatByFAQ(schoolInfo.code,function(err,data){return callback(err,data)});
            } // ****0     question首页搜索框,[常见问题]

        ],function(err, results){
            if(err) {
                console.log("v5template/v5templateHome.js [v5templateSubList01] requetErr: " + err);
                return v3_1templateHomeUtil.ret_json_func(0,'失败',{},res);
            }
            var retJson = {
                'question':results[0],
                'schoolInfo' : schoolInfo
            };

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
                    console.log(JSON.stringify(retJson));
                    retJson.title= retJson.schoolInfo.name+"-"+retJson.schoolInfo.professor +"-"+"修改密码";
                    retJson.host = "http://"+req.hostname;
                    res.render('./v3_1template/pages/13_modifyPassword',retJson);
                });
            }else{
                retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
                console.log(JSON.stringify(retJson));
                retJson.title= retJson.schoolInfo.name+"-"+retJson.schoolInfo.professor +"-"+"修改密码";
                retJson.host = "http://"+req.hostname;
                res.render('./v3_1template/pages/13_modifyPassword',retJson);
            }
        });
    });
}
router.get('/v5modifyPassword',modifyPasswordPage);
router.post('/v5modifyPassword',modifyPasswordPage);
router.modifyPasswordPage=modifyPasswordPage;
//------------------------------------------------------------------------



function updatePassword_json(req,res,next){
    // 账户
    var password= req.body.password || req.query.password ;
    var valiCode= req.body.valiCode || req.query.valiCode ;   //缺少验证码参数
    var oldPassword= req.body.oldPassword || req.query.oldPassword ;
    // 从cookie 中获取用户userId
    var userInfoJson = req.cookies.zndyKey;
    if(!userInfoJson || userInfoJson.length <= 0) {
        // 用户未登录
    }
    var userInfo = JSON.parse(userInfoJson);
    var userToken = userInfo.userToken;

    //参数判断
    if (typeof oldPassword == 'undefined' || oldPassword == null || oldPassword.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识为空', res,{});
    }
    if (typeof valiCode == 'undefined' || valiCode == null || valiCode.length == 0) {
        console.log('***** 用户账户为空');
        return ret_func(0,'用户账户为空', res,{});
    }
    if (typeof password == 'undefined' || password == null || password.length == 0) {
        console.log('***** 用户密码为空');
        return ret_func(0,'用户密码为空', res,{});
    }
    var url = API_BASE_URL + '/front/user/updatePassword?'
        + 'oldPassword='+oldPassword
        + '&valiCode='+valiCode
        + '&password='+password
        + '&userToken='+userToken;
    superagent.get(url)
        .end(function (err, res2) {
            if (err) {
                console.log("v5templateHome.js request api err: " + err);
                return ret_func(0,'更新密码ajax请求错误', res,{});
            }

            var retJson = JSON.parse(res2.text);
            if (retJson.success == 0) {
                return ret_func(0,retJson.msg, res,{});
            }
            res.set('Content-Type', 'application/json');
            res.json(retJson);

        });
}
router.get('/updatePassword_json',updatePassword_json);
router.post('/updatePassword_json',updatePassword_json);
//------------------------------------------------------------------------












//---------------------地大研招14-在线留言jade页面-----------------------------------------
function onlineMessagePage(req,res,next){
    var sCode = req.query.sCode || req.body.sCode || req.params.sCode||0;    // 专业id
    // 从cookie 中获取用户userId
    var userInfoJson = req.cookies.zndyKey;
    if(!userInfoJson || userInfoJson.length <= 0) {
        // 用户未登录
    }
    var userInfo = JSON.parse(userInfoJson);
    var userToken = userInfo.userToken;
    //参数判断
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识为空', res,{});
    }
    if (typeof userToken == 'undefined' || userToken == null || userToken.length == 0) {
        console.log('***** 用户唯一标识为空');
        return ret_func(0,'用户唯一标识为空', res,{});
    }

    async.series([
        function(callback) {
            // 获取学校基本配置信息 **** 0
            v3_1templateHomeUtil.findSchool(sCode,function(err,data){callback(err,data)});
        },
        function(callback){
            v3_1templateHomeUtil.getNoticeNum(sCode,userToken,function(err,data){return callback(err,data)});
        },//****  消息列表总数接口 **** 1
        function(callback){
            v3_1templateHomeUtil.getInfoCatByFAQ(sCode,function(err,data){return callback(err,data)});
        } // ****2     question首页搜索框,[常见问题]
    ],function(err, results){
        if(err) {
            console.log("v5template/v5users.js [v5personalProfile] requetErr: " + err);
            return v3_1templateHomeUtil.ret_json_func(0,'失败',{},res);
        }
        var schoolInfo = results[0] || {};
        var NoticeNum = results[1];
        var retJson = {
            'NoticeNum' : NoticeNum,
            'schoolInfo' : schoolInfo,
            'question' : results[2]
        };
        // 尝试获取用户登录信息
        var userInfoJson = req.cookies.zndyKey;
        if(userInfoJson && userInfoJson.length > 2) {
            var userInfo = JSON.parse(userInfoJson || '{}');
            retJson.userInfo = userInfo;
            // 点击个人昵称跳转到16个人资料这一页面
            retJson.urlPersonalProfile =  base_sever_url + "/secondPage/personalProfilePage?"+"sCode="+sCode;
            retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
            retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
            retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
            retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
            retJson.title= retJson.schoolInfo.name +"-"+retJson.schoolInfo.professor +"-"+"在线留言";
            retJson.host = "http://"+req.hostname;
            res.render('./v3_1template/pages/14_onlineMessage', retJson);



        }
        retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
        retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
        retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
        retJson.title= retJson.schoolInfo.name +"-"+retJson.schoolInfo.professor +"-"+"在线留言";
        retJson.host = "http://"+req.hostname;
        res.render('./v3_1template/pages/14_onlineMessage', retJson);


    });
}
router.get('/v5onlineMessage',onlineMessagePage);
router.post('/v5onlineMessage',onlineMessagePage);

router.onlineMessagePage =onlineMessagePage;
//------------------------------------------------------------------------

//-------------------14-在线留言反馈消息 提交按钮ajax-----------------------------------------------------------------------
function saveQuestion_json(req,res,next){

    var question= req.body.question || req.query.question ;
    var schoolCode= req.body.schoolCode || req.query.schoolCode ;
    // 从cookie 中获取用户userId
    var userInfoJson = req.cookies.zndyKey;
    if(!userInfoJson || userInfoJson.length <= 0) {
        // 用户未登录
        return;
    }
    var userInfo = JSON.parse(userInfoJson);
    var userToken = userInfo.userToken;




    //参数判断
    if (typeof userToken == 'undefined' || userToken == null || userToken.length == 0) {
        console.log('***** 用户唯一标识为空');
        return ret_func(0,'用户唯一标识为空', res,{});
    }
    if (typeof question == 'undefined' || question == null || question.length == 0) {
        console.log('***** 问题为空');
        return ret_func(0,'问题为空', res,{});
    }
    if (typeof schoolCode == 'undefined' || schoolCode == null || schoolCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识为空', res,{});
    }
    var url = API_BASE_URL + '/front/answerOff/save?'
        + 'userToken='+userToken
        + '&question='+question
        + '&schoolCode='+schoolCode;
    url = encodeURI(url);
    superagent.get(url)

        .end(function (err, res2) {
            if (err) {
                console.log("v5templateHome.js request api err: " + err);
                return ret_func(0,'更新密码ajax请求错误', res,{});
            }

            var retJson = JSON.parse(res2.text);
            // 重新刷新一次本页面
            retJson.urlOnlineMessage = base_sever_url + "/v3_1users/v5onlineMessage?"+"schoolCode="+schoolCode;
            res.set('Content-Type', 'application/json');
            res.json(retJson);

        });
}
router.get('/saveQuestion_json',saveQuestion_json);
router.post('/saveQuestion_json',saveQuestion_json);
//------------------------------------------------------------------------


















//---------------------地大研招15-消息列表jade 招办回复页面-----------------------------------------
function messageListPage(req,res,next){
    //   学院学校专业详情请求接口
    var sCode = req.query.sCode || req.body.sCode ||req.params.sCode|| 0;    // 专业id
    // 从cookie 中获取用户userId
    var userInfoJson = req.cookies.zndyKey;
    if(!userInfoJson || userInfoJson.length <= 0) {
        // 用户未登录
        return;
    }
    var userInfo = JSON.parse(userInfoJson);
    var userToken = userInfo.userToken;


    // 学校id
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识错误', res,{});
    }
    if (typeof userToken == 'undefined' || userToken == null || userToken.length == 0) {
        console.log('***** 用户唯一标识为空');
        return ret_func(0,'用户唯一标识错误', res,{});
    }
    async.series([
        function(callback) {
            // 获取学校基本配置信息 **** 0
            v3_1templateHomeUtil.findSchool(sCode,function(err,data){callback(err,data)});
        },
        function(callback) {
            // 获取消息列表 **** 1
            v3_1templateHomeUtil.getNoticeList(sCode,userToken,function(err,data){callback(err,data)});
        },
        function(callback){
            v3_1templateHomeUtil.getNoticeNum(sCode,userToken,function(err,data){return callback(err,data)});
        },//****  消息列表总数接口 **** 2
        function(callback){
            v3_1templateHomeUtil.getInfoCatByFAQ(sCode,function(err,data){return callback(err,data)});
        } // ****2     question首页搜索框,[常见问题]
    ],function(err, results){
        if(err) {
            console.log("v5template/v5users.js [v5messageList] requetErr: " + err);
            return v3_1templateHomeUtil.ret_json_func(0,'失败',{},res);
        }
        var schoolInfo = results[0] || {};
        var NoticeList= results[1] || {};
        var NoticeNum = results[2];
        var question = results[3];
        var retJson = {
            'NoticeNum' : NoticeNum,
            'schoolInfo' : schoolInfo,
            'NoticeList':NoticeList,
            'question':question,
        };
        // 尝试获取用户登录信息
        var userInfoJson = req.cookies.zndyKey;
        if(userInfoJson && userInfoJson.length > 2) {
            var userInfo = JSON.parse(userInfoJson || '{}');
            retJson.userInfo = userInfo;
            // 点击个人昵称跳转到16个人资料这一页面
            retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            retJson.urlModifyPassword = base_sever_url + "/v3_1users/v5modifyPassword";
            retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
            retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
            retJson.title= retJson.schoolInfo.name+"-"+retJson.schoolInfo.professor +"-"+"招办回复";
            retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
            // 跳转到修改密码页面
            console.log(JSON.stringify(retJson));
            retJson.host = "http://"+req.hostname;
            res.render('./v3_1template/pages/15_messageList', retJson);

        }
        retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
        retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
        retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
        retJson.title= retJson.schoolInfo.name+"-"+retJson.schoolInfo.professor +"-"+"招办回复";
        // 跳转到修改密码页面
        console.log(JSON.stringify(retJson));
        retJson.host = "http://"+req.hostname;
        res.render('./v3_1template/pages/15_messageList', retJson);


    });
}
router.get('/v5messageList',messageListPage);
router.post('/v5messageList',messageListPage);
router.messageListPage =messageListPage;
//------------------------------------------------------------------------







//------15----消息列表 单个消息点击读取 更新ajax 请求--------------------------------
function updateToRead_json(req,res,next){
    // 账户
    var id= req.body.id || req.query.id ;

    //参数判断
    if (typeof id == 'undefined' || id == null || id.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识为空', res,{});
    }
    var url = API_BASE_URL + '/front/index/updateToRead?'
        + 'id='+id;
    superagent.get(url)

        .end(function (err, res2) {
            if (err) {
                console.log("v5templateHome.js [updateToRead_json]request api err: " + err);
                return ret_func(0,'更新消息列表消息读取请求错误', res,{});
            }

            var retJson = JSON.parse(res2.text);
            if (retJson.success == 0) {
                return ret_func(0,retJson.msg, res,{});
            }
            res.set('Content-Type', 'application/json');
            res.json(retJson);

        });
}
router.get('/updateToRead_json',updateToRead_json);
router.post('/updateToRead_json',updateToRead_json);
//------------------------------------------------------------------------


//---------15----消息列表 消息读取成功后 更新消息总数 ajax 请求----------------------------------------------------------------

function NoticeNum_json(req,res,next){
    // 获取参数,学校唯一标识,和用户id
    var sCode = req.query.sCode || req.body.sCode || 0;    // 专业id
    // 从cookie 中获取用户userId
    var userInfoJson = req.cookies.zndyKey;
    if(!userInfoJson || userInfoJson.length <= 0) {
        // 用户未登录
        return;
    }
    var userInfo = JSON.parse(userInfoJson);
    var userToken = userInfo.userToken;

    //参数判断
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识为空', res,{});
    }
    if (typeof userToken == 'undefined' || userToken == null || userToken.length == 0) {
        console.log('***** 用户唯一标识为空');
        return ret_func(0,'用户唯一标识为空', res,{});
    }
    var url = API_BASE_URL + '/front/index/getNoticeNum?'
        + 'sCode='+sCode
        + '&userToken='+userToken;
    superagent.get(url)

        .end(function (err, res2) {
            if (err) {
                console.log("v5templateHome.js [NoticeNum_json]request api err: " + err);
                return ret_func(0,'更新消息列表消息读取请求错误', res,{});
            }

            var retJson = JSON.parse(res2.text);
            if (retJson.success == 0) {
                return ret_func(0,retJson.msg, res,{});
            }
            res.set('Content-Type', 'application/json');
            res.json(retJson);

        });
}
router.get('/NoticeNum_json',NoticeNum_json);
router.post('/NoticeNum_json',NoticeNum_json);
//--------------------------------------------------------------------------------------

//---------------------地大研招16-个人资料jade页面-----------------------------------------
function personalProfilePage(req,res,next){
    var sCode = req.query.sCode || req.body.sCode ||req.params.sCode|| 0;    // 专业id
    // 从cookie 中获取用户userId
    var userInfoJson = req.cookies.zndyKey;
    if(!userInfoJson || userInfoJson.length <= 0) {
        // 用户未登录
        return;
    }
    var userInfo = JSON.parse(userInfoJson);
    var userToken = userInfo.userToken;
    //参数判断
    if (typeof sCode == 'undefined' || sCode == null || sCode.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识为空', res,{});
    }
    if (typeof userToken == 'undefined' || userToken == null || userToken.length == 0) {
        console.log('***** 用户唯一标识为空');
        return ret_func(0,'用户唯一标识为空', res,{});
    }

    async.series([
        function(callback) {
            // 获取学校基本配置信息 **** 0
            v3_1templateHomeUtil.findSchool(sCode,function(err,data){callback(err,data)});
        },
        function(callback){
            v3_1templateHomeUtil.getNoticeNum(sCode,userToken,function(err,data){return callback(err,data)});
        },//****  消息列表总数接口 **** 1
        function(callback){
            v3_1templateHomeUtil.getInfoCatByFAQ(sCode,function(err,data){return callback(err,data)});
        } // ****2     question首页搜索框,[常见问题]

    ],function(err, results){
        if(err) {
            console.log("v5template/v5users.js [v5personalProfile] requetErr: " + err);
            return v3_1templateHomeUtil.ret_json_func(0,'失败',{},res);
        }
        var schoolInfo = results[0] || {};
        var NoticeNum = results[1];
        var question = results[2];
        var retJson = {
            'NoticeNum' : NoticeNum,
            'schoolInfo' : schoolInfo,
            'question': question
        };
        // 尝试获取用户登录信息
        var userInfoJson = req.cookies.zndyKey;
        if(userInfoJson && userInfoJson.length > 2) {
            var userInfo = JSON.parse(userInfoJson || '{}');
            retJson.userInfo = userInfo;
            // 点击个人昵称跳转到个人资料这一页面
            retJson.urlPersonalProfile =  base_sever_url + "/secondPage/secondPagePersonalPage?"+"sCode="+sCode;
            retJson.urlModifyPassword = base_sever_url + "/v3_1users/v5modifyPassword";
            retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
            retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
            retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
            retJson.title= retJson.schoolInfo.name+"-"+retJson.schoolInfo.professor +"-"+"我的资料";
            // 跳转到修改密码页面
            console.log(JSON.stringify(retJson));
            retJson.host = "http://"+req.hostname;
            res.render('./v3_1template/pages/16_personalProfile', retJson);

        }
        retJson.themeColor = retJson.schoolInfo.styleColor; // 将学校信息中的主题色提取至模型根部, 便于 jade 读取
        retJson.sidebarBgImg = retJson.schoolInfo.styleSidebarBg;  // 将二级侧边栏中的信息提取至模型根部,便于jade读取
        retJson.navBgImg = retJson.schoolInfo.styleNavBg;          // 将首页导航栏中的背景主题色提取至模型根部,便于jade读取
        retJson.title= retJson.schoolInfo.name+"-"+retJson.schoolInfo.professor +"-"+"我的资料";
        // 跳转到修改密码页面
        console.log(JSON.stringify(retJson));
        retJson.host = "http://"+req.hostname;
        res.render('./v3_1template/pages/16_personalProfile', retJson);


    });
}
router.get('/v5personalProfile',personalProfilePage);
router.post('/v5personalProfile',personalProfilePage);
router.personalProfilePage =personalProfilePage;
//------------------------------------------------------------------------


//---------16----我的资料页面 获取高校列表 ajax 请求----------------------------------------------------------------

function findUniversity_json(req,res,next){
    // 获取参数,学校唯一标识,和用户id
    //var sCode = req.query.sCode || req.body.sCode || 0;    // 专业id
    //var sCode = 'NLGYFE';
    var province = req.query.province || req.body.province || "";
    var name = req.query.name || req.body.name || "";


    var url = API_BASE_URL + '/common/findUniversity?'
        + 'province='+province
        + '&name='+name;
    url = encodeURI(url);
    console.log("findUniversity_json: " + url);
    superagent.get(url)

        .end(function (err, res2) {
            if (err) {
                console.log("v5templateHome.js [NoticeNum_json]request api err: " + err);
                return ret_func(0,'查询大学高校列表数据请求错误', res,{});
            }

            var retJson = JSON.parse(res2.text);

            res.json(retJson);

        });
}
router.get('/findUniversity_json',findUniversity_json);
router.post('/findUniversity_json',findUniversity_json);
//--------------------------------------------------------------------------------------



//---------16----我的资料页面 获取高中高校列表ajax请求----------------------------------------------------------------

function findHighSchool_json(req,res,next){
    // 获取参数,学校唯一标识,和用户id
    //var sCode = req.query.sCode || req.body.sCode || 0;    // 专业id
    //var sCode = 'NLGYFE';
    var province = req.query.province || req.body.province || "";
    var name = req.query.name || req.body.name || "";


    var url = API_BASE_URL + '/common/findHighSchool?'
        + 'province='+province
        + '&name='+name;
    url = encodeURI(url);
    superagent.get(url)

        .end(function (err, res2) {
            if (err) {
                console.log("v5templateHome.js [findHighSchool_json]request api err: " + err);
                return ret_func(0,'查询高中高校列表数据请求错误', res,{});
            }

            var retJson = JSON.parse(res2.text);

            res.json(retJson);


        });
}
router.get('/findHighSchool_json',findHighSchool_json);
router.post('/findHighSchool_json',findHighSchool_json);
//--------------------------------------------------------------------------------------





//-----------16 个人资料页面        点击保存修改按钮    ajax 请求----------------------------------------
function updateUser_json(req,res,next){
    // 获取参数,学校唯一标识,和用户id
    // 昵称
    var nickname = req.query.nickname || req.body.nickname || "";
    // 学校code
    var sCode = req.query.sCode || req.body.sCode || "";
    // 用户
    var email = req.query.email || req.body.email || "";
    // 生源地
    var provinceName = req.query.provinceName || req.body.provinceName || "";
    // 报考类型
    var sourceType = req.query.sourceType || req.body.sourceType || "";
    // 学校id
    var highSchoolId = req.query.highSchoolId || req.body.highSchoolId || "";
    // 高中学校名称
    var highSchoolName = req.query.highSchoolName || req.body.highSchoolName || "";
    // 用户id
    var userInfoJson = req.cookies.zndyKey;
    if(!userInfoJson || userInfoJson.length <= 0) {
        // 用户未登录 todo
        return;
    }
    var userInfo = JSON.parse(userInfoJson);
    var userToken = userInfo.userToken;

    var url = API_BASE_URL + '/front/user/updateUserInfo?'
        + 'userToken='+userToken
        + '&nickName='+nickname
        + '&email='+email
        + '&provinceName='+provinceName
        + '&sourceType='+sourceType
        + '&highSchoolId='+highSchoolId
        + '&sCode='+sCode;
    url = encodeURI(url);
    superagent.get(url)

        .end(function (err, res2) {
            if (err) {
                console.log("v5templateHome.js [updateUser_json]request api err: " + err);
                return ret_func(0,'更新用户资料请求错误', {},res);
            }

            var retJson = JSON.parse(res2.text);
            if(retJson && retJson.retCode == "0"){
                console.log(JSON.stringify(retJson));
                userInfo.nickName = nickname;
                userInfo.provinceName = provinceName;
                userInfo.sourceType = sourceType;
                userInfo.highSchoolName =highSchoolName;
                res.cookie('zndyKey',JSON.stringify(userInfo),{ maxAge:1296000,/*15天*/ httpOnly: true});
                res.set('Content-Type', 'application/json');
                res.json(retJson);
            }else{
                res.set('Content-Type', 'application/json');
                res.json(retJson);
            }

        });
}
router.get('/updateUser_json',updateUser_json);
router.post('/updateUser_json',updateUser_json);
//--------------------------------------------------------------------------------------




//--------------------------------------------------------------------
/* 退出登录的接口.
 * 方式:      GET
 * 参数(可选):      mobile:登录成功后session中存的值
 * 返回：     HTML页面
 * 测试地址：
 * */
function logOut(req, res, next) {
    var identify = req.query.identify || req.body.identify || '';
    var retJson={};

    res.cookie('zndyKey', JSON.stringify(retJson.data),{ maxAge:  -1000000, httpOnly: true});


    var url='/'+identify;
    res.redirect(url);
}

router.post('/logOut', logOut);//
router.get('/logOut', logOut);




//------------------------验证用户邮箱是否注册------------------------------------------------


function checkEmailIsexist_json(req,res,next){
    var email = req.query.email || req.body.email || 0;
    //参数判断
    if (typeof email == 'undefined' || email == null || email.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0,'学校唯一标识为空', res,{});
    }
    var url = API_BASE_URL + '/front/user/checkEmailIsexist?'
        + 'email='+email;
    url = encodeURI(url);
    superagent.get(url)

        .end(function (err, res2) {
            if (err) {
                console.log("v5users.js [checkEmailIsexist_json]request api err: " + err);
                return ret_func(0,'查询高中高校列表数据请求错误', res,{});
            }

            var retJson = JSON.parse(res2.text);

            res.json(retJson);

        });
}
router.get('/checkEmailIsexist_json',checkEmailIsexist_json);
router.post('/checkEmailIsexist_json',checkEmailIsexist_json);
//--------------------------------------------------------------------------------------



//------------------------------------------------------------------
/* 判断用户是否注册
 * (微信号和手机号不能全部为空; 若都不为空,优先判断手机号)
 * POST
 * 参数: mobile : 手机号
 * return   success = 1 该手机已注册
 *          cuccess = 0 该手机未注册
 * */
function checkMobilIsExist(req, res, next) {
    var email = Number(req.query.email || req.body.email || '0');

    chkMobileReg(email, function(success, msg){
        var retJson = {data: {},msg:msg,success:success}
        res.set('Content-Type', 'application/json');
        res.json(retJson);
    });
}
router.get('/checkMobilIsExist', checkMobilIsExist);
router.post('/checkMobilIsExist', checkMobilIsExist);

//=================================== tools ========================

//------------------------------------------------------------------
/* 判断用户是否注册
 * (微信号和手机号不能全部为空; 若都不为空,优先判断手机号)
 * 参数: email :  用户邮箱号
 *
 * return   success = 1 该手机已注册
 *          cuccess = 0 该手机未注册
 * */
function chkMobileReg(mobile, callback) {
    var url = CONFIG.API_SERVER_IP +':'+CONFIG.API_SERVER_PORT+'/users/chkUserReg';
    var para = {
        email : email
    };
    superagent.post(url)
        .send(para)
        .end(function(err, chkRes)
        {
            if(err) {
                return callback(0, "链接失败");
            }
            var data = JSON.parse(chkRes.text);
            return callback(data.success, data.msg);
        });
}
//----------------------------------------------------------------------------------



module.exports = router;
