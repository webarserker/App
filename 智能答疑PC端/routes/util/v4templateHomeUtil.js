var superagent = require('superagent');
var moment = require('moment');
var CONFIG = require('../../config');
var API_BASE_URL =  CONFIG.API_SERVER_FULL_URL;
var defaultRequestErr = "请求失败";
var RETCODE = {
    success : '000000', // 成功
    err : '999997', // 发生错误
    paramErr : '999998', // 参数错误
    systemErr  : '999999'  // 系统异常
};


var v4templateHomeUtil={};
v4templateHomeUtil.getInfoContentDetail = function(infoId,parentId,sCode,callback){
    var url = API_BASE_URL + '/weixin/api/infoContent/getInfoContentDetail?'
        + 'infoId='+infoId
        + '&sCode='+sCode
        + '&parentId='+parentId;
    console.log("v5templateHomeUtil.getInfoContentDetail: " + url);
    superagent.get(url)
        .end(function (err, res2) {
            if (err) {
                return callback(err,null);
            }

            var data = JSON.parse(res2.text);
            // 后台接口结构不统一,此处无三段结构, 拿到数据即认为请求成功
            //if (data.code!== RETCODE.success) {
            //    return callback(data.message || defaultRequestErr, null);
            //}
            data.data.toString = function(){return JSON.stringify(this)};
            return callback(err,data.data);
        });
}

module.exports = v4templateHomeUtil;