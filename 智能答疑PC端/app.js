var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
// var home = require('./routes/home');


var CONFIG = require('./config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
if (CONFIG.DEBUG === 1) {
 app.use(function (req, res, next) {
   var render = res.render;
   res.render = function (v, obj) {
     obj.host = obj.host + ':' + CONFIG.HOME_SERVER_PORT;
     render.apply(res, arguments)
   };
   next();
 });
}
app.use('/', index);
app.use('/users', users);
// app.use('/home',home);


//v5版本地大研招模版
var v5templateHome = require('./routes/v5template/v5templateHome');
var v5users = require('./routes/v5template/v5users');
var v5sidebar = require('./routes/v5template/v5sidebar');
// 模板二级页面中间跳转
var secondPage = require('./routes/secondPage');
var front = require('./routes/front');
var manage = require('./routes/manage');

// 模板二级页面 短链接跳转
var page = require('./routes/page');





//pc端地大模版5.0
app.use('/v5templateHome',v5templateHome);
app.use('/v5users',v5users);
app.use('/v5sidebar',v5sidebar);


// 模板二级页面中间跳转
app.use('/secondPage',secondPage);
app.use('/front',front);
app.use('/manage',manage);

// 模板二级页面 中间跳转 短链接跳转
app.use('/page',page);






// 刘洋的v4系列配置
var indexV4 = require('./routes/v4template/index');
var articleDetail=require('./routes/v4template/articleDetail')
var home=require('./routes/v4template/home');

app.use('/v4',indexV4);
app.use('/articleDetail',articleDetail)
app.use('/home',home);


// 模版  v3.1的一系列配置
var v3_1home = require('./routes/v3_1template/v3_1home');
app.use('v3_1home',v3_1home);

var v3_1users = require('./routes/v3_1template/v3_1users');
app.use('v3_1users',v3_1users);




//global info
app.locals.global = {};
//
//app.locals.global.app_sever_url = 'http://127.0.0.1:3000';
//app.locals.global.base_sever_url = "http://test.zhinengdayi.com";
//app.locals.global.api_sever_url = "http://testimg.zhinengdayi.com";
//



app.locals.global.testHost = "http://test.zhinengdayi.com/weixin/api";
app.locals.global.baseHost='http://test.zhinengdayi.com';
app.locals.global.imgHost='http://testimg.zhinengdayi.com'


//global info
app.locals.global.app_sever_url = CONFIG.HOME_SERVER_FULL_URL;
app.locals.global.img_sever_url = CONFIG.IMG_SERVER_FULL_URL;

app.locals.global.api_sever_url = CONFIG.API_SERVER_FULL_URL;
// 机器人配置
app.locals.global.robot_sever_url = CONFIG.ROBOT_SERVER_FULL_URL;

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});


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


// catch 404 and forward
app.use(function(req,res,next){
  var uri = req.originalUrl;
  var paths = uri.split('/');
  if(paths.length !=2){
    var err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }
  // 此处check scode ,如果不正确继续报404
  req.query.sCode = paths[1];
  index.brifeEntity(req, res, function(){
    var err = new Error('Not Found');
    err.status = 404;
    return next(err);
  })
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.host = "http://"+req.hostname;
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log("server err: " + err.message);
  // render the error page
  res.status(err.status || 500);

  if(err.status == 404) {
    return v5users.errorPage(req,res,next);
  } else if(err.status == 500) {
    return v5users.errorPage(req,res,next);
  } else {
    return v5users.errorPage(req,res,next);
  }

  return v5users.errorPage()
});







module.exports = app;
