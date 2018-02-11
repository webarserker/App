var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var argv = require('yargs').argv;
var config = require('../config');
var util = require('./util');
var rawBodyParser = require('./util/raw-body-parser');
var serveStatic = require('./util/serve-static');
var port = argv.p || config.port || 3000;
var app = express();
var MINUTE = 1000*60;

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", " * ")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  res.header("X-Powered-By", ' 3.2.1')
  next()
})

// session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    maxAge: MINUTE*30
}));

// raw body
app.use(rawBodyParser());

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// for parsing application/json
app.use(bodyParser.json());
app.use(bodyParser.raw());
//app.use(bodyParser.text({type:['text/xml','application/xml']}));


// http log
app.use(function timeLog(req, res, next) {
    util.log(req.method, req.url);
    next();
});

// 加载router中的路由文件
mount('./router');

// 主题文件
function shadeBlend(p,c0,c1) {
  var n=p<0?p*-1:p,u=Math.round,w=parseInt;
  if(c0.length>7){
    var f=c0.split(","),t=(c1?c1:p<0?"rgb(0,0,0)":"rgb(255,255,255)").split(","),R=w(f[0].slice(4)),G=w(f[1]),B=w(f[2]);
    return "rgb("+(u((w(t[0].slice(4))-R)*n)+R)+","+(u((w(t[1])-G)*n)+G)+","+(u((w(t[2])-B)*n)+B)+")"
  }else{
    var f=w(c0.slice(1),16),t=w((c1?c1:p<0?"#000000":"#FFFFFF").slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF;
    return (0x1000000+(u(((t>>16)-R1)*n)+R1)*0x10000+(u(((t>>8&0x00FF)-G1)*n)+G1)*0x100+(u(((t&0x0000FF)-B1)*n)+B1)).toString(16).slice(1)
  }
}

app.use('/theme/:style', function (req, res){

  var color = req.params.style,
    stleTmp = [
      '@charset "UTF-8";',
      '.w3-theme-l5 {color:#000 !important; background-color:{{color+0.9}} !important}',
      '.w3-theme-l4 {color:#000 !important; background-color:{{color+0.8}} !important}',
      '.w3-theme-l3 {color:#000 !important; background-color:{{color+0.6}} !important}',
      '.w3-theme-l2 {color:#000 !important; background-color:{{color+0.4}} !important}',
      '.w3-theme-l1 {color:#fff !important; background-color:{{color+0.1}} !important}',
      '.w3-theme-d1 {color:#fff !important; background-color:{{color-0.1}} !important}',
      '.w3-theme-d2 {color:#fff !important; background-color:{{color-0.2}} !important}',
      '.w3-theme-d3 {color:#fff !important; background-color:{{color-0.3}} !important}',
      '.w3-theme-d4 {color:#fff !important; background-color:{{color-0.4}} !important}',
      '.w3-theme-d5 {color:#fff !important; background-color:{{color-0.5}} !important}',
      '.w3-theme-light {color:#000 !important; background-color:{{color+0.9}} !important}',
      '.w3-theme-dark {color:#fff !important; background-color:{{color-0.5}} !important}',
      '.w3-theme-action {color:#fff !important; background-color:{{color-0.5}} !important}',
      '.w3-theme {color:#fff !important; background-color:{{color}} !important}',
      '.w3-text-theme {color:{{color}} !important}',
      '.w3-theme-border {border-color:{{color}} !important}',
      '.w3-hover-theme:hover {color:#fff !important; background-color:{{color}} !important}'
    ].join('');

  var style = stleTmp.replace(/\{\{color([+-.0-9]*)?\}\}/g, function (word, match, index){
    var colorTmp = color;

    if(match){
      colorTmp = shadeBlend(match, '#' + colorTmp);
    }

    return '#' + colorTmp;
  });

  res.set('Content-Type', 'text/css; charset=UTF-8')
    .status(200)
    .end(style);

});

// 静态文件服务器
app.all('*', require('./util/html-serve.js'));

// 静态文件
app.use(serveStatic(__dirname + '/../client/'));

// 404
app.all('*', function(req, res){
    console.log("app path>>"+req.path);
    res.redirect( '/404.html');
});

// 开始监听端口
app.listen(port, function(){
    util.log('服务器启动', 'http://localhost:' + port);
});

//
function mount(dir){
	// 遍历api目录，读取每一个文件
	// 遍历文件中定义的每一个路由，以 /api/文件名/路由名 为路径加载路由
	fs.readdirSync(__dirname + '/' + dir).forEach(function(file, index) {
		var filename = file.substr(0, file.indexOf('.'));
		if (filename !== '') {
            app.use('/' + filename, require(dir + '/' + filename));
        };
	});
};
