var config = require('../../config.js'),
    util = require('../util'),
    getOpenidByCode =require('./get-openid-by-code'),
    getUserSchoolsByOpenid =require('./get-user-schools-by-openid');

// 供微信调用的callback接口
var callbackRedirect = function (req, res) {
	var code = req.query.code,
		state = req.query.state,
		redirect = req.query.redirect; // redirect 存储的是来源页
	
	if(!code){
		res.send('wechat auth failed, code is null');
		return;
	};

	if(!redirect){
		res.send('wechat auth failed, redirect is null');
		return;
	};
	
	try{
		redirect = util.atob(redirect);
	}catch(e){
		redirect = '';
	};

    // 取openid
	getOpenidByCode(code, function(err, openid){
		
		if(err || !openid){
			util.log(err || 'get openid error');
			res.send(err || 'get openid error');
			return;
		};
		
		req.session.openid = openid;
		
		// 取用户和学校信息
		getUserSchoolsByOpenid(openid, function(error, user, schools){

			if(error || !user){
				res.send(error || 'not found userinfo');
				return;
			};

			// 存入session中: userid, openid, user
			req.session.user = user;
			req.session.userid = user.id;

			// 跳回来源页
			res.redirect(req.baseUrl + redirect);
		});

	});

}

module.exports = callbackRedirect;