var weixin = require('./server/weixin/config');
var env = 'test';
var host = {
    test: 'testadmin.zhinengdayi.com',
    local: '127.0.0.1',
    prod: 'weixin.zhinengdayi.com'
}[env];
var config = {
    uglify: true,
    // Web服务器IP端口
    host: 'http://test.rocklee.com.cn',
    port: 80,
    path: function(path){
        return config.host + ':' + config.port + path;
    },
    // API服务器配置
    api: {
        host: 'http://' + host,
        port: 80,
        path: function(path){
            return config.api.host + ':' + config.api.port + path;
        },
        agent: function(path){
            return config.api.path('/weixin/api' + path);
        }
    },
    wenda: {
        host: 'http://101.201.117.231',
        port: 80,
        index: '/build/index.html',
    },
    admin: {
        host: 'http://testwxadmin.zhinengdayi.com',
        port: 80,
        index: '/#/home/entry',
    },
    //
    robot: {
        host: 'http://' + host,
        port: 3000,
        path: function(path){
            return config.robot.host + ':' + config.robot.port + path;
        }
    },
	// 数据库信息
	database: {
		test: {
			"host": host,
			"database": "intelians",
			"user": "root",
			"password": "1qaz!QAZ"
		},
		prod: {
			"host": '10.24.196.113',
			"database": "intelians",
			"user": "root",
			"password": "1qaz!QAZ!@#$"
		},
	}[env],
    // git配置
    git: {
        // 自动拉取代码的时间间隔，单位：分
        pull: 1,
        // 是否自动重启
        restart: true
    },
    // 微信
    weixin: weixin,
    //
    themes: {
        'green': '绿色',
        'indigo': '靛蓝',
        'blue': '蓝色',
        'red': '红色',
        'light-green': '淡绿',
        'orange': '橙色',
        'blue-grey': '灰蓝',
        'brown': '棕色',
        'dark-grey': '灰暗',
        'dark-bule': '深蓝',
        'dark-red': '深红',
        'light-bule': '淡蓝',
    }
};

module.exports = config;
