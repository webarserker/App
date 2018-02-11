var git = require('simple-git')(__dirname + '/../');
var util = require('./index');
var self = {};

// HTTP远程部署
self.pull = pull;

// 定时拉取git代码
self.watch = function(callback, second){
    if(typeof second !== 'number'){
        second = 1;
    };
    // 以分钟单位
    setInterval(function(){
        pull(callback)
    }, second * 1000*60);
}

// 拉取git代码
function pull(callback){
    try{
        git.pull(function (err, update) {
            var changes = update && update.files && update.files.length,
                reboot;
            if(err) {
                callback && callback(err, 0);
            }else if(!changes){
                callback && callback('', 0);
            }else if(changes){
                util.log('更新了' + changes + '个文件', update.files)
                reboot = needReboot(update.files);
                callback && callback('', changes, reboot);
            };
        });
    }catch(e){
        callback && callback('拉取失败');
    }
}

// 判断是否需要重启
function needReboot(files){
    var reboot = false;

    // 遍历所有文件，判断是否有package.json和非client目录的Js
    files.forEach(function(file){
        if(file === 'package.json' || isServerJs(file)){
            reboot = true;
            return false;
        };
    });

    return reboot;
}

// 判断文件是否静态文件（client目录）
function isServerJs(file){
    return !file.match(/^client\//) && file.match(/\.js$/);
}

module.exports = self;