var config = require('../../config.js'),
    util = require('../util');

// 获取openid和uid，如果获取不到就跳到鉴权页面去
function getOpenidUidOrRedirect(req, res, path, callback){
    var user = req.query.user;
    var uid = req.session.userid;
    var openid = req.session.openid;
    var uid2 = req.query.uid;
    var from = req.query.from;
    console.log('getOpenidUidOrRedirect uid2>>>'+uid2);
    console.log('getOpenidUidOrRedirect uid>>>'+uid);
    console.log('getOpenidUidOrRedirect from>>>'+req.query.from);
    console.log('getOpenidUidOrRedirect openid>>>'+openid);
    if(from && from != 'singlemessage'){
        var redirect = encodeURIComponent(config.host + '/weixin/callback?redirect='+util.btoa(path)+'&from='+req.query.from);
        var auth_url = config.weixin.authorize +
            '?appid=' + config.weixin.appid +
            '&redirect_uri=' + redirect +
            '&response_type=code&scope=snsapi_userinfo&state=' + req.sessionID;
        res.redirect(auth_url);
    }else if(uid && openid){
        callback(null, openid, uid);
    }else {
        var redirect = encodeURIComponent(config.host + '/weixin/callback?redirect='+util.btoa(path));
        var auth_url = config.weixin.authorize +
            '?appid=' + config.weixin.appid +
            '&redirect_uri=' + redirect +
            '&response_type=code&scope=snsapi_userinfo&state=' + req.sessionID;
        res.redirect(auth_url);
    }
};

module.exports = getOpenidUidOrRedirect;