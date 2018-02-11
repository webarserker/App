var config = require('../../config.js'),
    util = require('../util');

// 获取openid和uid，如果获取不到就跳到鉴权页面去
function getOpenidUidOrRedirect(req, res, path, callback){
    var user = req.session.user;
    var openid = req.session.openid;
    var uid = req.session.userid;

    if(uid && openid){
        callback(null, openid, uid);
    }else{
        var redirect = encodeURIComponent(config.host + '/weixin/callback?redirect='+util.btoa(path));
		var auth_url = config.weixin.authorize + 
			'?appid=' + config.weixin.appid + 
			'&redirect_uri=' + redirect + 
			'&response_type=code&scope=snsapi_userinfo&state=' + req.sessionID;
		res.redirect(auth_url);
    };
};

module.exports = getOpenidUidOrRedirect;