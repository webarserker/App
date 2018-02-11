var config = require('../../config.js'),
    util = require('../util'),
    getOpenidByCode =require('./get-openid-by-code'),
    getUserSchoolsByOpenid =require('./get-user-schools-by-openid');

// 供微信调用的callback接口
var callbackRedirect = function (req, res) {
	var code = req.query.code,
		state = req.query.state,
		from = req.query.from,
		redirect = req.query.redirect; // redirect 存储的是来源页
        console.log('callbackRedirect query>>>'+JSON.stringify(req.query));
		console.log('callbackRedirect query>>>'+req.query);
		console.log('callbackRedirect from>>>'+from);
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
			/*if(from != null && from == 'admin'){
                res.redirect(config.admin.host + ':' + config.admin.port);
            }else{
                res.send(err || 'get openid error');
                return;
			}*/
			return;
		};
		
		req.session.openid = openid;

		// 取用户和学校信息
		getUserSchoolsByOpenid(openid, function(error, user, schools){

            util.log('getOpenidByCode from>>'+from);
            util.log('getOpenidByCode user>>'+user);
			if(error || (!user && from!='admin')){
				res.send(error || 'not found userinfo');
				return;
			};

			util.log('getOpenidByCode>>>'+from);
			// 跳回来源页
			if(from != null && from == 'wenda') {
				// if(redirect) {
                	// res.redirect(config.wenda.host + ':' + config.wenda.port + redirect);
				// }else {
					console.log('getOpenidByCode wenda redirect>>>'+redirect);
                	res.redirect(config.wenda.host + ':' + config.wenda.port + config.wenda.index);
				// }
			}else if(from != null && from == 'admin'){
                res.redirect(config.admin.host + ':' + config.admin.port + config.admin.index + '?userToken=' + user);
            }else {
                req.session.userid = user.id;
                res.redirect(req.baseUrl + redirect);
            }
		}, from);

	});

}

module.exports = callbackRedirect;