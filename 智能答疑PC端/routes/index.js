var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var CONFIG = require('../config');
var API_BASE_URL =  CONFIG.API_SERVER_FULL_URL;
var useragent = require('express-useragent');

var base_sever_url = 'http://'+CONFIG.HOME_SERVER_DOMAIN_FOR_HOME;
// 移动端的配置

var MOBILE_BASE_URL = CONFIG.MOBILE_SERVER_FULL_URL;
var async = require('async');
//var v5templateHomeUtil = require('/util/v5templateHomeUtil');
var fs = require('fs');
var jade = require('jade');


// v5.0地大研招模版
var v5templateHome = require('./v5template/v5templateHome');
var v5users = require('./v5template/v5users');


// 二级页面公用文件接口
var secondPage= require('./secondPage.js');

// 模板二级页面 短链接跳转
var page = require('./page');

// v4.1 版本模版
var v4_1Home = require('./v4_1template/v4_1Home');

// v4.0 版本模版
var v4templateHome=require('./v4template/index');

//v3.2版本模板
var v3_2templateHome=require('./v3_2template/index')

// v3_1模版
var v3_1home = require('./v3_1template/v3_1home');
/* GET users listing. */


/* GET home page. */
router.get('/', function(req, res, next) {

  var url =API_BASE_URL ;
  res.redirect(url);

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

/**
 * 短链跳转首页入口
 *
 * */
router.brifeEntity = function(req, res, next) {
    var host = req.headers.host;
    var sCode = req.query.sCode || req.body.sCode || '';
    // 宣传检测系统用户 spreadToken
    var spreadToken = req.query.spreadToken || req.body.spreadToken || '';
    var hostName = req.hostname;
    if (hostName!=null&&hostName.indexOf('front.zhinengdayi')>-1){
        return res.redirect(base_sever_url+'/'+sCode);
    }
    // 参数有误不予处理, 继续404
    if (sCode.length == 0) {
        return next();
    }
    // 微信登录用户的唯一表示 userToken
    var userToken = req.query.userToken || req.body.userToken;
    // 尝试登录
    tryLoginWithUserToken(userToken,function(tryLoginErr,userInfo){
        if(tryLoginErr){
            // 登录失败,进入登录页
            console.log(tryLoginErr);
        }
        if(userInfo){
            // 缓存用户登录信息到cookie中去
            res.cookie('zndyKey', JSON.stringify(userInfo), { maxAge: 1296000/**15天*/, httpOnly: true});
            if(req.cookies) {
                req.cookies.zndyKey = JSON.stringify(userInfo);
            }
        }
        var url = API_BASE_URL + '/front/template/findSchool/'
            +sCode;
        superagent.get(url)
            .end(function (err, res2) {
                if (err) {
                    console.log("v5templateHome.js request api err: " + err);
                    return v5users.errorPage(req,res,next);
                }
                if(res2.text =="{}") {
                    return v5users.cutOffPage(req, res, next);
                }
                // 后台返回数据错误, 直接继续404 // 返回空字符串。屏蔽网站
                if(res2.text.length < 2) {
                    return v5users.errorPage(req, res, next);
                }
                var retJson = JSON.parse(res2.text);

                var templateKey = retJson.template;
                var sCode = retJson.code;
                var identify = retJson.identify;
                var userAgent = req.headers['user-agent'];
                var ua = useragent.parse(userAgent?userAgent:'');
                // 判断访问来源 浏览器内核
                var refUrl = req.headers['referer'];
                var isWeixin = userAgent.indexOf('MicroMessenger') > -1;
                // 移动端和pc端识别 处理
                if(ua.isiPhone || ua.isiPad || ua.isiPod||ua.isAndroid || ua.isAndroidTablet){
                    var url = '';
                    if(!isWeixin) {
                        url = MOBILE_BASE_URL +'/build/index.html?scode='+sCode+'#/?';
                    }else {
                        url = MOBILE_BASE_URL +'/weixin/index?scode='+sCode;
                    }
                    if(spreadToken) {
                        url += '&spreadToken='+spreadToken;
                    }
                    if(refUrl) {
                        url += '&viewSourceUrl='+refUrl;
                    }
                    return res.redirect(url);
                }else{
                    req.query.sCode = sCode;



                    if(templateKey=="v5.0"){
                        v5templateHome.getHomePage(req,res,next);
                    } else if(templateKey == 'v4.0') {
                        v4templateHome.getHomePage(req, res ,next);
                    } else if(templateKey == 'v4.1'){
                        v4_1Home.getHomePage(req, res ,next);
                    } else if(templateKey == 'v3.0'){
                        var identify = retJson.identify;
                        var url = API_BASE_URL+'/'+identify;
                        res.redirect(url)
                    } else if(templateKey == 'v3.1'){
                        v3_1home.getHomePage(req, res ,next)
                        // v3_2templateHome.getHomePage(req, res ,next);

                    } else if(templateKey=='v3.2'){
                        v3_2templateHome.getHomePage(req, res ,next);

                    }else{
                        return v5users.errorPage(req, res, next);
                    }

                }

            });
    });

    /*** 尝试登录
     * @param  userToken 三方登录唯一标识, 可以为null 若为null则直接回调
     * @param  callback 尝试登录回调,若未传递userToken 则立即回调,否则则发起登录结束后回调(错误,成功)
     *           err: 登录错误,若尝试登录出错,出错原因
     *           userInfo : 用户信息,若userToken 为空,则userInfo 必然为空,若登录失败,userToken 也为空
     *
     * */

    function tryLoginWithUserToken(userToken,callback){
        if(!userToken) return callback(null,null);
        var url = API_BASE_URL +"/front/template/getFrontUserByUserToken?userToken="+userToken;
        superagent.get(url)
            .end(function (err, res) {
                if (err) {
                    return callback(err, null);
                }
                // 后台返回数据错误, 直接继续404
                if (res.text.length < 2) {
                    return callback("后台返回数据错误", null);
                }

                var result = JSON.parse(res.text);
                if(result.code == "000000"){
                    return callback(null, result.data);
                }else{
                    return callback("登录失败", null);
                }
            })
    }


}

module.exports = router;
