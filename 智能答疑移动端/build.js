var argv = require('yargs').argv;
var config = require('./config.js');
var webpack = require('webpack');
var exec = require('./server/util/exec');
var log = require('./server/util').log;
//var git = require('./server/util/git');
var compiler;

// 显示一个空行
console.log('');

new webpack.ProgressPlugin(function handler(percentage, msg) {
    if (percentage==0) {
        console.log('开始编译');
    }

    if (percentage==1) {
        console.log('结束编译');
        exec('exit');
    }
});

exec('node_modules/.bin/webpack');