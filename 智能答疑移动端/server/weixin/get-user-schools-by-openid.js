var config = require('../../config.js'),
    request = require('request');

function getUserSchools(openid, callback, from){

	var apiUrl = '';
	if(from == 'admin') {
		apiUrl = config.api.agent('/getSysUserInfo?openId=' + openid);
	}else {
		apiUrl = config.api.agent('/getUserSchool?openId=' + openid);
	}

	var opts = {
		url: apiUrl
	};

    request(opts, function (error, response, body) {
		var data = {};
		if(!error && body){
			try{
				data = JSON.parse(body);
			}catch(e){}
		};
        callback(error, data.user, data.school);
    });
}

module.exports = getUserSchools;