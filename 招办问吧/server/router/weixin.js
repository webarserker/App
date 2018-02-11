var express = require('express'),
    request = require('request'),
    waterfall = require('async/waterfall'),
    config = require('../../config'),
    db = require('../util/db.js'),
    util = require('../util'),
    proxy = require('../util/http-proxy'),
    callbackRedirect =require('../weixin/callback-redirect'),
    getOpenidUidOrRedirect =require('../weixin/get-openid-uid-or-redirect'),
    getUserSchoolsByOpenid =require('../weixin/get-user-schools-by-openid'),
    router = express.Router();

// 消息和事件接口转发
router.all('/interface', proxy({
    host: config.api.host,
    port: config.api.port,
    url: function(req){
        return req.baseUrl + req.url;
    }
}));

// 供微信调用的callback接口
router.all('/callback', callbackRedirect);

// 获取用户信息后跳转
router.get('/auth', function(req, res){
    getOpenidUidOrRedirect(req, res, req.url, function(err, openid, uid){
        var url = '';
        try{
            url = util.atob(req.query.redirect);
        }catch(e){};
        res.redirect(url || '/user-info.html');
    });
});

// 首页
// 1. 取openid
// 2. 取关注的学校列表
// 3. 如果有且只有一个关注学校，直接去学校首页；否则去关注的学校列表
router.get('/index', function(req, res){
    var scode = req.query.scode;
    waterfall([
        // 1.
        function(callback){
            getOpenidUidOrRedirect(req, res, req.url, function(err, openid, uid){
                callback(err, openid);
            });
        },
        // 2.
        getUserSchoolsByOpenid
    ], function(err, user, schools){
        // 3.
        var uid = (user || {}).id;
        //
        if(scode)
            res.redirect('/build/index.html?scode=' + scode+'#?uid='+uid);
        else
            res.redirect('/user-school.html?uid='+uid);
    });

});

// 关注院校
router.get('/user/school', function(req, res){
    getOpenidUidOrRedirect(req, res, req.url, function(err, openid, uid){
        res.redirect('/user-school.html?uid='+uid);
    });
});

// 用户资料
router.get('/user/info', function(req, res){
    getOpenidUidOrRedirect(req, res, req.url, function(err, openid, uid){
        res.redirect('/user-info.html');
    });
});

// 用户消息
router.get('/user/msg', function(req, res){
    getOpenidUidOrRedirect(req, res, req.url, function(err, openid, uid){
        res.redirect('/user-msg.html');
    });
});

// robot
router.get('/robot', function(req, res){
    var scode = req.query.scode;
    getOpenidUidOrRedirect(req, res, req.url, function(err, openid, uid){
        res.redirect('/robot.html?scode=' + scode);
    });
});

// get school favicon
router.get('/school/favicon', function(req, res, next){
    var scode = req.query.scode;
    db.getRow({
        table: 't_sys_school',
        fields: ['yr_scholar'],
        where: {
            code: scode
        },
        success: function(row){
            if(row && row.yr_scholar){
                //res.send(config.api.path(row.yr_scholar));
                req.query = {};
                proxy({
                    host: config.api.host,
                    port: config.api.port,
                    url: row.yr_scholar,
                    encoding: null
                })(req, res, next);
            }else{
                res.status(404).send('');
            }
        },
        error: function(rows){
            res.status(404).send('');
        }
    });
});

// login
router.all('/login', proxy(
        {
            host: config.api.host,
            port: config.api.port,
            url: function(req){
                return '/weixin/api/login';
            }
        },
        function(req, res){
            var json, user;

            // to json
            try{
                json = JSON.parse(this.body || '{}');
                user = json && json.data;
            }catch(e){};

            // 更新session用户信息
            if(user && user.id){
                req.session.user = user;
                req.session.userid = user.id;
                console.info(req.session)
            };

            // 返回
            res.set(this.headers);
            res.status(this.statusCode).send(this.body);
        }
    )
);

// get user id
router.get('/uid', function(req, res){
    var uid = req.session.userid;
    if(typeof uid === 'undefined'){
        res.send({
            success: false,
            msg: '请登录',
            expired: true
        });
    }else{
        res.send(uid+'');
    };
});

// get user
router.get('/user', function(req, res){
    res.send(req.session.user || {
        success: false,
        msg: '请登录',
        expired: true
    });
});

// 设置UID
// 测试方法，请及时删除
router.get('/setuid/:userid', function(req, res){
    req.session.userid = req.params.userid;
    console.info('set session userid = ' + req.session.userid);
    res.send(true);
});

module.exports = router;