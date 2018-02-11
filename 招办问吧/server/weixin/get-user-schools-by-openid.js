var config = require('../../config.js'),
    request = require('request');

function getUserSchools(openid, callback){

	var opts = {
		url: config.api.agent('/getUserSchool?openId=' + openid)
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