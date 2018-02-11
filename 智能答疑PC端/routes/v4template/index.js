/**
 * Created by liuyang on 2017/7/24.
 */
var express = require('express');
var router = express.Router();
var async = require('async');
var superagent = require('superagent');
var CONFIG = require('../../config');
var API_BASE_URL = CONFIG.API_SERVER_FULL_URL;
var base_sever_url = CONFIG.HOME_SERVER_DOMAIN_FOR_HOME;


var v5templateHomeUtil = require('../util/v5templateHomeUtil');

/* GET home page. 设置子路由以及对应的数据传入 */
router.get('/', function (req, res, next) {

    res.render('./v4template/index');
});


//---------------------4.0首页-----------------------------------------
function getHomePage(req, res, next) {
    //   1.请求学校基本配置接口
    var codeOrIdentify = req.query.sCode || req.body.sCode || 0;    // 专业id
    var userToken=req.query.userToken || req.body.userToken ||'';
    //var codeOrIdentify = 'NLGYFE';
    //学校唯一标识id
    if (typeof codeOrIdentify == 'undefined' || codeOrIdentify == null || codeOrIdentify.length == 0) {
        console.log('***** 学校唯一标识为空');
        return ret_func(0, '学校唯一标识错误', res, {});
    }
    // 1. 学校基础信息
    v5templateHomeUtil.findSchool(codeOrIdentify, function (findSchoolErr, schoolInfo) {
        if (findSchoolErr) {
            console.log("v5templateHome.js [getHomePage] findSchoolErr: " + findSchoolErr);
            var errMsg = "请求失败";
            errMsg = typeof findSchoolErr == 'string' ? findSchoolErr : errMsg;
            return v5templateHomeUtil.ret_json_func(0, errMsg, {}, res);
        }

        var url = API_BASE_URL +"/front/template/getFrontUserByUserToken?userToken="+userToken;
        superagent.get(url)
            .end(function (err, res2) {
                var userInfo2={};
                var result = JSON.parse(res2.text);
                if(result.code == "000000"){
                    userInfo2=result.data;
                }

                var retJson = {};
                retJson.schoolInfo = schoolInfo;

                var userInfoJson = req.cookies.zndyKey;
                if (userInfoJson && userInfoJson.length > 2) {
                    var userInfo = JSON.parse(userInfoJson || '{}');
                    retJson.userInfo = userInfo;
                    // 点击个人昵称跳转到个人资料这一页面
                    retJson.urlPersonalProfile = base_sever_url + "/v5users/v5personalProfile";
                }else{
                    var userInfo = userInfo2;
                    retJson.userInfo = userInfo;
                    // 点击个人昵称跳转到个人资料这一页面
                    retJson.urlPersonalProfile = base_sever_url + "/v5users/v5personalProfile";
                }
                // 快捷登录
                retJson.urlLogin = base_sever_url + "/v5users/v5loginPage";
                // 免费注册
                retJson.urlRegister = base_sever_url + "/v5users/v5registerPage";

                retJson.scode=codeOrIdentify;

                retJson.host = "http://"+req.hostname;
                console.log(JSON.stringify(retJson));
                res.render('./v4template/index', retJson);

            })
    });
}

router.get('/v4', getHomePage);
router.post('/v4', getHomePage);
router.getHomePage = getHomePage;


module.exports = router;
