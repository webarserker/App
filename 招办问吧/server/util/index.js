const SUBREGEX = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g;

var util = {

    // 返回时间字符串
    time: function(dt){
        dt = dt || new Date();
        return dt.toLocaleTimeString();
    },

    // 输出日志
    // 如果有2个参数， 第一个为title，第二个为message
    log: function(){
        var title = util.time(), msg, args = arguments;
        
        if(args.length === 1){
            msg = args[0];
        }else if(args.length > 1){
            title = title + ' ' + args[0];
            msg = args[1];
        };

        if(typeof msg !== 'string'){
            msg = JSON.stringify(msg);
        };

        console.log('\x1b[32m' + title + '\x1b[0m ' + msg);
    },

    // 
    responseFormat: function (obj) {

        var temp;

        // 如果是数组或者对象，遍历处理
        if (typeof obj === 'object') {

            _.forEach(obj, function(n, key) {
                obj[key] = responseFormat(n);
            }.bind(this));

            // 字符型
        } else if (typeof obj === 'string') {

            // 如果是符合日期格式的字符串
            if (obj.match(/^\d{4}\-\d{2}\-\d{2}/)) {
                temp = moment(obj);
                if (temp.isValid()) {
                    return temp.format('YYYY-MM-DD HH:mm:ss');
                };
            };

        };

        // 如果是日期对象
        // 转换成年月日时分秒
        if (moment.isDate(obj)) {
            return moment(obj).format('YYYY-MM-DD HH:mm:ss');
        };

        return obj;
    },

    //
    sub: function(s, o) {
        return s.replace ? s.replace(SUBREGEX, function (match, key) {
            return typeof o[key] === 'undefined' ? match : o[key];
        }) : s;
    },

    atob: function(str){
        return new Buffer(str, 'base64').toString('binary');
    },

    btoa: function(str){
        var buffer;

        if (str instanceof Buffer) {
          buffer = str;
        } else {
          buffer = new Buffer(str.toString(), 'binary');
        }

        return buffer.toString('base64');
    }
};

module.exports = util;