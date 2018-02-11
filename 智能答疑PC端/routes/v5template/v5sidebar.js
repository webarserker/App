/**
 * created by abby 2017/7/18
 */
var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//---------------------地大研招10-注册jade页面-----------------------------------------
function registerPage(req,res,next){
    var retJson = {};
    retJson.host = "http://"+req.hostname;
    res.render('./v5template/pages/10_register',retJson);
}
router.get('/v5registerPage',registerPage);
router.post('/v5registerPage',registerPage);
//------------------------------------------------------------------------


//---------------------地大研招11-登录jade页面-----------------------------------------
function loginPage(req,res,next){
    var retJson = {};
    retJson.host = "http://"+req.hostname;
    res.render('./v5template/pages/11_login',retJson);
}
router.get('/v5loginPage',loginPage);
router.post('/v5loginPage',loginPage);
//------------------------------------------------------------------------

//---------------------地大研招12-忘记密码jade页面-----------------------------------------
function forgetPasswordPage(req,res,next){
    var retJson = {};
    retJson.host = "http://"+req.hostname;
    res.render('./v5template/pages/12_forgetPassword',retJson);
}
router.get('/v5forgetPassword',forgetPasswordPage);
router.post('/v5forgetPassword',forgetPasswordPage);
//------------------------------------------------------------------------


//---------------------地大研招13-修改密码jade页面-----------------------------------------
function modifyPasswordPage(req,res,next){
    var retJson = {};
    retJson.host = "http://"+req.hostname;
    res.render('./v5template/pages/13_modifyPassword',retJson);
}
router.get('/v5modifyPassword',modifyPasswordPage);
router.post('/v5modifyPassword',modifyPasswordPage);
//------------------------------------------------------------------------

//---------------------地大研招14-在线留言jade页面-----------------------------------------
function onlineMessagePage(req,res,next){
    var retJson = {};
    retJson.host = "http://"+req.hostname;
    res.render('./v5template/pages/14_onlineMessage',retJson);
}
router.get('/v5onlineMessage',onlineMessagePage);
router.post('/v5onlineMessage',onlineMessagePage);
//------------------------------------------------------------------------
//---------------------地大研招15-消息列表jade页面-----------------------------------------
function messageListPage(req,res,next){
    var retJson = {};
    retJson.host = "http://"+req.hostname;
    res.render('./v5template/pages/15_messageList',retJson);
}
router.get('/v5messageList',messageListPage);
router.post('/v5messageList',messageListPage);
//------------------------------------------------------------------------


//---------------------地大研招16-个人资料jade页面-----------------------------------------
function personalProfilePage(req,res,next){
    var retJson = {};
    retJson.host = "http://"+req.hostname;
    res.render('./v5template/pages/16_personalProfile',retJson);
}
router.get('/v5personalProfile',personalProfilePage);
router.post('/v5personalProfile',personalProfilePage);
//------------------------------------------------------------------------



module.exports = router;