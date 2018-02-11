var config = require('../../config.js'),
    request = require('request');

function getOpenid(code, callback){

	var url = config.weixin.access_token + 
			'?appid=' + config.weixin.appid + '&secret=' + config.weixin.appsecret + 
			'&code=' + code + '&grant_type=authorization_code',
        opts = {
            url: url
        };
	
    request(opts, function (error, response, body) {
		var data;
		if(!error && body){
			try{
				data = JSON.parse(body);
			}catch(e){}
		};

		if(data && data.openid){
			callback(null, data.openid);
		}else{
			callback('get openid error');
		};
    });
}

module.exports = getOpenid;