var weixin = require('./server/weixin/config');
var env = 'test';
var host = {
        test: 'test.rocklee.com.cn',
        local: '127.0.0.1',
        prod: 'weixin.zhinengdayi.com'
    }[env];

var config = {
    wxHost:'http://slwsfs.imwork.net',
    uglify: false,
    // Web服务器IP端口
    host: 'http://' + host,
    //host: 'http://localhost',
    port: 80,
    path: function(path){
        return config.host + ':' + config.port + path;
    },
    // API服务器配置
    api: {
        host: 'http://' + host,
        port: 8080,
        path: function(path){
            return config.api.host + ':' + config.api.port + path;
        },
        agent: function(path){
            return config.api.path('/weixin/api' + path);
        }
    },
    //
    robot: {
        host: 'http://123.56.177.92',
        port: 3000,
        path: function(path){
            return config.robot.host + ':' + config.robot.port + path;
        }
    },
	// 数据库信息
	database: {
        test: {
            "host": '123.56.177.92',
            "database": "intelians",
            "user": "root",
            "password": "Test%sql2017"
        },
        local: {
            "host": '123.56.177.92',
            "database": "intelians",
            "user": "root",
            "password": "Test%sql2017"
        },
		prod: {
			"host": host,
			"database": "intelians",
			"user": "root",
			"password": "1qaz!QAZ"
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
        'light-blue': '淡蓝',
        "pink": "粉色",
        "purple": "紫色",
        "deep-purple": "深紫",
        "cyan": "蓝绿",
        "aqua": "浅绿",
        "teal": "teal",
        "lime": "lime",
        "sand": "sand",
        "khaki": "卡其",
        "yellow": "黄色",
        "amber": "琥珀色",
        "deep-orange": "深橙",
        "light-grey": "灰白",
        "grey": "灰色",
        "black": "黑色",
        "pale-red": "淡红",
        "pale-yellow": "淡黄",
        "pale-green": "淡绿",
        "pale-blue": "淡蓝"
    }
};

module.exports = config;