var express = require('express'),
    request = require('request'),
    _ = require('lodash'),
    config = require('../../config.js'),
    util = require('../util'),
    proxy = require('../util/http-proxy')({
        url: function(req){
            return config.api.agent(req.url);
        }
    }),
    router = express.Router();

// router.all('/findCatInfoList', function(req, res, next){
//     var data = {"id":349,"level":2,"name":"专业目录","parentId":null,"specType":null,"contentType":1,"imgUrl":null,"icon":"icon-33","subMenu":[{"id":744,"level":3,"name":"美  学010106","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":745,"level":3,"name":"金融学 020204","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":746,"level":3,"name":"国际贸易学 020206","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":747,"level":3,"name":"国际文化贸易 0202J1","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":748,"level":3,"name":"文艺学050101","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":749,"level":3,"name":"语言学及应用语言学 050102","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":750,"level":3,"name":"汉语言文字学   050103","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":751,"level":3,"name":"中国古代文学050105","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":752,"level":3,"name":"中国现当代文学 050106","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":753,"level":3,"name":"比较文学与世界文学050108","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":754,"level":3,"name":"英语语言文学 050201","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":755,"level":3,"name":"国际文化贸易 0502J1","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":756,"level":3,"name":"俄语语言文学 050202","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":757,"level":3,"name":"法语语言文学  050203","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":758,"level":3,"name":"德语语言文学 050204","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":759,"level":3,"name":"日语语言文学050205","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":760,"level":3,"name":"西班牙语语言文学 050207","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":761,"level":3,"name":"阿拉伯语语言文学 050208","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":762,"level":3,"name":"亚非语言文学（韩国语） 050210","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":763,"level":3,"name":"外国语言学及应用语言学 050211","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":764,"level":3,"name":"会计学 120201","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":765,"level":3,"name":"企业管理120202","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":766,"level":3,"name":"旅游管理 120203","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":767,"level":3,"name":"饭店管理 1202Z1","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":768,"level":3,"name":"会展管理 1202Z2","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":769,"level":3,"name":"国际商务 025400","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":778,"level":3,"name":"汉语国际教育硕士 045300","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":777,"level":3,"name":"翻译硕士 0551","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1},{"id":779,"level":3,"name":"工商管理125100/旅游管理125400","parentId":349,"specType":0,"contentType":1,"imgUrl":null,"icon":null,"subMenu":null,"type":1}],"type":2};
//     //data.subMenu = data.subMenu.slice(0, 10);
//     res.send(data);
// });

// API接口转发
// 消息和事件接口转发
router.all('*', function(req, res, next){
    console.log("router path>>"+req.path);
    if(req.session.userid){
        replaceUid(req.query, req.session.userid);
    }else if(needUid(req)){
        return res.send({
            success: false,
            msg: '请登录',
            expired: true
        });
    };

    return proxy(req, res, next);
});

// 
function needUid(req){
    var need = false;
    _.forEach(req.query || {}, function(val, key){
        need = need || (val === '{uid}');
    });
    return need;
};

// 
function replaceUid(obj, uid){
    _.forEach(obj || {}, function(val, key){
        if(val === '{uid}'){
            obj[key] = uid;
        }
    });
};

module.exports = router;