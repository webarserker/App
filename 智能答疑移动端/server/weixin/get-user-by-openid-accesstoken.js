var config = require('../../config.js'),
    request = require('request');

function getUserinfo(openid, accessToken, callback){

	var url = config.weixin.userinfo + 
			"?access_token=" + accessToken + "&openid=" + openid + "&lang=zh_CN",
		opts = {
			url: url
		};
	
    request(opts, function (error, response, body) {
		var data = {};
		if(!error && body){
			try{
				data = JSON.parse(body);
			}catch(e){}
		};
        callback(error, data);
    });
}

module.exports = getUserinfo;