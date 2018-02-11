var argv = require('yargs').argv;
var config = require('./config.js');
var log = require('./server/util').log;
var exec = require('./server/util/exec');
var git = require('./server/util/git');
var git_time = argv.g ? parseFloat(argv.g) : '';
var port = argv.p ? ('-p ' + argv.p) : '';
var server, compiler;

// 显示一个空行
console.log('');

// 服务器子进程
server = exec('node server ' + port);

// 前端代码打包
if(argv.w){
    log('webpack');
    compiler = require('webpack')(require('./webpack.config'));
    if(argv.w === 'watch'){
        compiler.watch({
            aggregateTimeout: 300,
            poll: true
        }, function(err, stats){
            if(err){
                log(err);
            }
        });
    }else{
        compiler.run(function(err, stats){
            if(err){
                log(err);
            }
        });
    }
};

// 定时git拉取
if(git_time && typeof git_time === 'number'){
    log('每' + git_time + '分钟 git pull')
    git.watch(function(err, changes, reboot){
        // if(reboot && config.git.restart){
        //     log('服务器重启');
        //     server.kill('SIGINT');
        //     server = exec('node server');
        // };
    }, git_time);
};