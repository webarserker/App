/**
 * Created by abbydu on 17/8/15.
 */
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

/**
 * 模板主题色系表
 * */
var COLOR_MAP = {
    "blackishGreen" : "#006450", // 墨绿
    "brightRed"     : "#c8161d", // 深绯红
    "cobaltBlue"    : "#008fa3", // 钴蓝色
    "deepRed"       : "#c24631", // 深红
    "glazedBlue"    : "#1d50a2", // 琉璃蓝
    "peacockBlue"   : "#00a4c5", // 孔雀蓝
    "skyBlue"       : "#369de4", // 蔚蓝
    "sunOrange"     : "#f18d00", // 太阳橙
    "tenderGreen"   : "#76a32d", // 嫩绿
    "green"         : "#05955d",  // 绿色
    "ChinaRed"      : "#d7000f"   // 中国红
};

/**
 * 模板二级页面侧边栏主题色背景图
* */

var SIDEBAR_BG_MAP = {
    "blackishGreen" : "/images/v5template/6.png ", // 墨绿 6
    "brightRed"     : "/images/v5template/9.png", // 深绯红9
    "cobaltBlue"    : "/images/v5template/4.png", // 钴蓝色8
    "deepRed"       : "/images/v5template/10.png", // 深红10
    "glazedBlue"    : "/images/v5template/7.png", // 琉璃蓝7
    "peacockBlue"   : "/images/v5template/8.png", // 孔雀蓝
    "skyBlue"       : "/images/v5template/5.png", // 蔚蓝
    "sunOrange"     : "/images/v5template/1.png", // 太阳橙
    "tenderGreen"   : "/images/v5template/2.png", // 嫩绿
    "green"         : "/images/v5template/3.png", // 绿色
    "ChinaRed"      : "/images/v5template/11.png" // 中国红
}

/**
 * 模板首页导航栏主题色背景图
 * */
var NAV_BG_MAP = {
    "blackishGreen" : "/images/v5template/nav_004.png ", // 墨绿 6
    "brightRed"     : "/images/v5template/nav_009.png", // 深绯红9
    "cobaltBlue"    : "/images/v5template/nav_001.png", // 钴蓝色8
    "deepRed"       : "/images/v5template/nav_06.png", // 深红10
    "glazedBlue"    : "/images/v5template/nav_03.png", // 琉璃蓝7
    "peacockBlue"   : "/images/v5template/nav_02.png", // 孔雀蓝
    "skyBlue"       : "/images/v5template/nav_07.png", // 蔚蓝
    "sunOrange"     : "/images/v5template/nav_08.png", // 太阳橙
    "tenderGreen"   : "/images/v5template/nav_05.png", // 嫩绿
    "green"         : "/images/v5template/nav_003.png", // 绿色
    "ChinaRed"      : "/images/v5template/nav_010.png" // 中国红
}

/*
*   模版二级页面 右侧模版机器人下面的 固定背景的书本背景图
* */
var SIDEBAR_BOOK_MAP = {
    "blackishGreen" : "/images/v5template/blackishGreenBook.png",      // 墨绿 6
    "brightRed"     : "/images/v5template/brightRedBook.png",           // 深绯红9
    "cobaltBlue"    : "/images/v5template/cobaltBlueBook.png",          // 钴蓝色8
    "deepRed"       : "/images/v5template/deepRedBook.png",             // 深红10
    "glazedBlue"    : "/images/v5template/glazedBlueBook.png",          // 琉璃蓝7
    "peacockBlue"   : "/images/v5template/peacockBlueBook.png",         // 孔雀蓝
    "skyBlue"       : "/images/v5template/skyBlueBook.png",             // 蔚蓝
    "sunOrange"     : "/images/v5template/sunOrangeBook.png",           // 太阳橙
    "tenderGreen"   : "/images/v5template/tenderGreenBook.png",         // 嫩绿
    "green"         : "/images/v5template/greenBook.png",                // 绿色
    "ChinaRed"      : "/images/v5template/ChinaRedBook.png" // 中国红
}




var v5templateHomeUtil = (function(){

    var v5templateHomeUtil = function(){

    };

    /*
    * 统一返回json结构
    *
    * @param success ： 是否成功 0 失败， 1 成功
    * @param msg ： 请求描述， 若失败则为失败原因
    * @param data ： 核心数据结果
    * @param res： 请求响应句柄
    * */
    v5templateHomeUtil.ret_json_func = function(success, msg, data, res) {
        var obj = {
            success: success,
            msg: msg,
            data: data || {}
        };
        // 返回
        res.set('Content-Type', 'application/json');
        res.json(obj);
    };
    //------------------ v5templateHomeUtil 工具方法 begin---------------------

    /**
     * 根据code和catId获取二级分类数据
     *
     * @param code 学校唯一标识
     * @param catId 二级分类id
     * @param callback 请求结束回调
     *             err： 失败
     *             data： 二级分类信息， 结构示意： {"secondCatId":708,"threeCatId":88,"menu":[{"flag":1,"name":"外语类保送生","catId":214,"children":[]},{"flag":1,"name":"招生计划","catId":83,"children":[]},{"flag":1,"name":"经世学府 寰宇绽放","catId":368,"children":[]},{"flag":1,"name":"历年录取","catId":86,"children":[]},{"flag":0,"name":"招生分类信息","catId":708,"children":[{"name":"自主招生","catId":88,"icon":"usericon-webicon-01","imgUrl":""},{"name":"测试三级分类","catId":1251,"icon":"usericon-webicon-01","imgUrl":""},{"name":"招生计划查询","catId":823,"icon":"usericon-webicon-14","imgUrl":""},{"name":"高水平艺术团","catId":90,"icon":"usericon-webicon-01","imgUrl":""},{"name":"博士研究生招录","catId":336,"icon":"icon-33","imgUrl":""}]}]}
     * */
    v5templateHomeUtil.getInfoCatlist = function(code, catId, callback) {

        var url = API_BASE_URL + '/front/template/getInfoCatlist?'
            + 'sCode='+code
            + '&catId='+catId;
        superagent.get(url)
            .end(function (err, res2) {
                if (err) {
                    return callback(err,null);
                }
                var data = JSON.parse(res2.text);
                if (data.code != RETCODE.success) {
                    console.log("/util/v5templateHomeUtil [getInfoCatlist] + err: " + data.message + " url: " + url);
                    return callback(data.message || defaultRequestErr, null);
                }
                // sidebarData js 中需使用对象, 故, 需要实现toString 方法
                data.data.toString = function(){return JSON.stringify(this)};
                return callback(err, data.data);
            });
    };

    /**
     * 根据二级分类id 获取对应文章标题列表
     *
     *  @param sCode 学校唯一标识
     *  @param catId 二级分类或者三级分类id  两者都是catId
     *  @param curPage 当前页
     *  @param pageSize 每页数量  默认每次请求10个
     *  @param callback 请求结束回调
     *              err: 失败
     *              data: 文章列表标题
     * */
    v5templateHomeUtil.getInfoContentlist = function(sCode,catId,curPage,pageSize,callback){
        var url = API_BASE_URL + '/front/template/getFirstSubCatId?'
            + 'catId='+catId;
        superagent.get(url)
            .end(function (err, res2) {
                if (err) {
                    return callback(err, null);
                }

                var retJson = JSON.parse(res2.text);
                var data = retJson.data
                // 向后端列表项
                var url = API_BASE_URL + '/front/template/getInfoContentlist?'
                    + 'sCode='+sCode
                    + '&catId='+data
                    + '&curPage='+curPage
                    + '&pageSize='+pageSize;
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
                        return callback(err, data);
                    });
            });
    };
    /**
     * 根据文章标题列表.获取文章详情页面接口
     *  @param infoId  单个文章id
     *  @param parentId 点击文章标题获取上级分类id 有可能是三级分类ID 有可能是二级文章ID
     *  @param sCode 学校唯一标识
     *  @param callback  请求结束回调
     *               err:   失败
 *                   data: 文章详情信息
    * */
    v5templateHomeUtil.getInfoContentDetail = function(infoId,parentId,sCode,callback){
        var url = API_BASE_URL + '/front/template/getInfoContentDetail?'
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


    /**
     *根据学校唯一标识,请求学校基本信息.school
     * @param sCode 学校唯一标识
     * @param callback 请求结束回调
     *          err:失败
     *          data:学校基本信息
     *
     */
    v5templateHomeUtil.getSchoolInfoByCode = function(sCode,callback){
        var url = API_BASE_URL + '/front/info/schoolInfoForm?'
            + 'sCode=' + sCode;
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
                return callback(err,data);

            });
    }

    /**根据学校唯一标识,专业名词(可不传,显示全部专业列表信息),以及是否需要分页(传固定false) 等参数请求专业查询列表展示信息
     * @param sCode 学校唯一标识
     * @param needPage 是否需要分页
     * @param callback 请求结束回调
     *          err: 失败
     *          data: 学校专业列表信息
    * */
    v5templateHomeUtil.getMajorList = function(sCode,needPage,callback){
        var url = API_BASE_URL + '/weixin/api/getMajorList?'
            + 'sCode=' + sCode
            + '&needPage=' + needPage;
        superagent.get(url)
            .end(function (err, res2) {
                if (err) {
                    return callback(err,null);
                }
                var data = JSON.parse(res2.text);
                return callback(err,data);

            });
    }
    /**
     * 根据学校唯一标识,请求专业详解列表操作列的展示配置.包括专业详情,招生计划,历史录取信息等展示
     * @param sCode 学校唯一标识  接口中,学校唯一标识,有的接口是scode 有的是sCode,需注意
     * @param callback 请求结束回调
     *          err:失败
     *          data:专业详情,招生计划,历史录取信息等在专业列表中的展示配置
     * */
    v5templateHomeUtil.getMajorConf = function(sCode,callback){
        var url = API_BASE_URL + '/weixin/api/getMajorConf?'
            + 'scode=' + sCode;
        superagent.get(url)
            .end(function (err, res2) {
                if (err) {
                    return callback(err,null);
                }
                var data = JSON.parse(res2.text);
                return callback(err,data);

            });
    }

    /** 首页接口 请求学校基本配置信息
     * 根据学校唯一标识，请求学校基本配置接口,sCode,logo 等基本配置信息
     * @param codeOrIdentify 传过来的学校唯一标识或者身份识别码。
     * @param callback 请求结束回调
     *          err:失败
     *          data:学校基本配置信息， 包括使用哪个模版。学校
     */
    v5templateHomeUtil.findSchool = function(codeOrIdentify,callback){
        var url = API_BASE_URL + '/front/template/findSchool/'
            +codeOrIdentify;
        superagent.get(url)
            .end(function (err, res2) {
                if (err) {
                    console.log("/util/v5templateHomeUtil.js [findSchool] err: " + err + " url: " + url);
                    return callback(err,null);
                }
                var data = JSON.parse(res2.text);
                data.styleColor = COLOR_MAP[data.style];    // 颜色色值处理,如需设置默认色值,只需在后面添加 || "#ffffff"
                data.styleSidebarBg =SIDEBAR_BG_MAP[data.style]; // 二级页面侧边栏头部一级分类背景色处理,
                data.styleNavBg = NAV_BG_MAP[data.style];       //  首页导航栏 背景颜色处理
                data.styleSidebarBook =SIDEBAR_BOOK_MAP[data.style];    // 二级页面侧边栏  右边书本背景图

                return callback(err,data);

            });
    }

    /**首页接口 请求首页轮播图信息
     * */
    v5templateHomeUtil.getBanners = function(sCode,callback){
        var url = API_BASE_URL + '/front/template_02/getBanners?'
            + 'sCode='+sCode;
        superagent.get(url)
            .end(function (err, res2) {
                if (err) {
                    console.log("/util/v5templateHomeUtil.js [getBanners] err: " + err + " url: " + url);
                    return callback(err,null);
                }
                var data = JSON.parse(res2.text);
                return callback(err,data);

            });
    };

    /**
     * 获取学校友情链接信息
     *
     * */
    v5templateHomeUtil.getSchoolFriendLinks = function(sCode, callback) {
        var url = API_BASE_URL + '/front/template_02/friendLink?'
            + 'sCode='+sCode;
        superagent.get(url)
            .end(function (err, res2) {
                if (err) {
                    console.log("v5templateHome.js [/front/template_02/friendLink]request api err: " + err);
                    callback(err, null);
                }
                var data = JSON.parse(res2.text);
                return callback(err,data);
            });
    };

    /**
     * 获取首页各个模块信息
     *
     * @param sCode 学校唯一标示
     * @param templateKey 模板唯一标识
     * @param moduleKey 模块唯一标识, m01 - m11
     * @param callback 回调
     *          err: 请求失败(包括网络连接失败/业务逻辑失败)
     *          data: 数据
     * */
    v5templateHomeUtil.getMainPageModuleInfo = function(sCode, templateKey, moduleKey, callback) {
        var url = API_BASE_URL + '/front/template/'+sCode+'/'+templateKey+'/'+moduleKey;
        superagent.get(url)
            .end(function (err, res2) {
                if (err) {
                    console.log("v5templateHome.js [/front/template]request api err: " + err);
                    callback(err, null);
                }
                var data = JSON.parse(res2.text);

                // m05 m06 m07 m08 时间格式转换 YYYY.MM.DD
                if(moduleKey == 'm05' || moduleKey == 'm06' || moduleKey == 'm07' || moduleKey == 'm08') {

                    if(data.data && data.data.length) {
                        for(var i = 0; i < data.data.length; i++) { // 异常保护 data.data 并遍历 data.data 数据
                            var tmpData = data.data[i];
                            if(tmpData.children && tmpData.children.length) {
                                for(var j = 0; j < tmpData.children.length; j++) { // 异常保护 data.data 中对象的 children 并遍历格式化时间戳
                                    var tmpItem = tmpData.children[j];
                                    tmpItem.date = moment(tmpItem.date).format('YYYY.MM.DD')
                                }
                            }
                        }
                    }
                }
                // m10 时间格式, 前三个格式转换为YYYY.MM.DD 剩下的转换为 MM月DD日
                if(moduleKey == 'm10') {
                    if(data.data && data.data.length) {
                        for(var i = 0; i < data.data.length; i++) { // 异常保护 data.data 并遍历 data.data 数据
                            var tmpData = data.data[i];
                            if(tmpData.children && tmpData.children.length) {
                                for(var j = 0; j < tmpData.children.length; j++) { // 异常保护 data.data 中对象的 children 并遍历格式化时间戳
                                    var tmpItem = tmpData.children[j];
                                    // 前三个格式转换为YYYY.MM.DD 剩下的转换为 MM月DD日
                                    tmpItem.date = j < 3 ? moment(tmpItem.date).format('YYYY.MMDD') : moment(tmpItem.date).format('MM月DD日');
                                }
                            }
                        }
                    }
                }
                data.toString = function(){return JSON.stringify(this)};
                return callback(err,data);
            });
    };

    /**
     * 首页新增接口，返回常见问题 父类id
     * @param sCode 学校唯一标识
     * @param callback 回调
     *          err:请求失败(包括网络链接失败/业务逻辑失败)
     *          data:数据
     *
     * */
    v5templateHomeUtil.getInfoCatByFAQ = function(sCode,callback){
        var url  = API_BASE_URL + '/front/template/getInfoCatByFAQ/'+sCode;
        superagent.get(url)
            .end(function(err,res2){
                if(err){
                    console.log("v5templateHome.js [/front/template]request api err:]"+err);
                    callback(err,null);
                }
                var data = JSON.parse(res2.text);
                return callback(err,data);
            })
    };


    /**
     *  首页点击搜索框,出现搜索结果页面接口
     *  @param question 用户输入的问题
     *  @param userID   可传可不传,主要为记录用户搜索历史
     *  @param sCode   学校唯一标识
     *  @param curPage  当前页
     *  @param pageSize 当前页码数
     *  @param callback   回调
     *          err:请求失败(包括网络链接失败/业务逻辑失败)
     *          data:数据
     * */
    v5templateHomeUtil.findByKeyWordNew = function(curPage,pageSize,question,sCode,callback){
        var url = API_BASE_URL +'/front/search/findByKeyWordNew?'
            + 'question=' + question
            + '&sCode=' + sCode
            + '&curPage=' + curPage
            + '&pageSize=' + pageSize;
        url = encodeURI(url);
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
                return callback(err, data);
            })

    }

    /*
    * 首页页尾学校联系方式接口
    * @param sCode      学校唯一标识
    * @param callback   回调
    *       err:请求失败(包括网络链接失败/业务逻辑失败)
    *       data:数据
    * */
    v5templateHomeUtil.findContactWay = function(sCode,callback){
        var url = API_BASE_URL +'/front/findContactWay?'
            + 'sCode=' + sCode;
        superagent.get(url)
            .end(function (err, res2) {
                if (err) {
                    return callback(err,null);
                }

                var data = JSON.parse(res2.text);
                return callback(err, data);
            })

    }


    /**
     * 视频在线页面接口
     * @param sCode 学校唯一标识
     * @param curPage 当前页
     * @param pageSize 页码大小
     * @param callback 回调
     *          err: 请求失败(包括网络链接失败/业务逻辑失败)
     *          data:数据
     *
     *
     * */
    v5templateHomeUtil.getSchoolVidoList = function(sCode,curPage,needPage,callback){
        var url = API_BASE_URL + '/front/getSchoolVidoList?'
            + 'sCode='+sCode
            + '&curPage='+curPage
            + '&needPage='+needPage;
        superagent.get(url)
            .end(function (err, res2) {
                if (err) {
                    return callback(err,null);
                }

                var data = JSON.parse(res2.text);
                return callback(err, data);

            });
    }


    /**
     * 专业详情接口
     * @param  majorId 专业id
     * @param callback 回调
     *          err: 请求失败(包括网络链接失败/业务逻辑失败)
     *          data: 数据
     * ***/
    v5templateHomeUtil.majorDetail = function(majorId,callback){
        var url = API_BASE_URL + '/weixin/api/majorDetail?'
            + 'majorId='+majorId;
        superagent.get(url)
            .end(function (err, res2) {
                if (err) {
                    return callback(err,null);
                }

                var data = JSON.parse(res2.text);
                data.showConfig = JSON.parse(data.showConfig);
                return callback(err, data);

            });
    }

    /**
     * 请求消息列表总数接口
     * @param sCode 学校唯一标识
     * @param userToken 用户信息唯一标识
     *              err: 请求失败(包括网络链接失败/业务逻辑失败)
     *              data: 数据
     * **/
    v5templateHomeUtil.getNoticeNum = function(scode,userToken,callback){
        // 请求消息列表总数接口
        var url = API_BASE_URL + '/front/index/getNoticeNum?'
            + 'sCode='+scode
            + '&userToken='+userToken;
        superagent.get(url)
            .end(function (err, res2) {
                if (err) {
                    return callback(err,null);
                }

                var data = JSON.parse(res2.text);
                return callback(err, data);

            });
    }

    /*
    * 请求消息列表接口
    * @param sCode 学校唯一标识
    * @param userToken 用户信息 唯一标识
    *               err: 请求失败（包活网络链接失败／业务逻辑失败）
*                   data: 数据
    * */
    v5templateHomeUtil.getNoticeList = function(sCode,userToken,callback){
        // 请求消息列表接口
        var url = API_BASE_URL + '/front/index/getNoticeList?'
            + 'sCode='+sCode
            + '&userToken='+userToken;
        superagent.get(url)
            .end(function (err, res2) {
                if (err) {
                    return callback(err,null);
                }

                var data = JSON.parse(res2.text);
                return callback(err, data);

            });
    }

    /**
     * 请求相册接口
     * @param sCode 学校唯一标识
     *          err: 请求失败（包括网络链接失败／业务逻辑失败）
     *          data: 数据
     */
    v5templateHomeUtil.scenery = function(sCode,callback){
        // 请求相册接口
        var url = API_BASE_URL + '/front/template/scenery/'
            +sCode;
        superagent.get(url)
            .end(function (err, res2) {
                if (err) {
                    return callback(err,null);
                }

                var data = JSON.parse(res2.text);
                return callback(err, data);

            });
    }

    /**
     *  院系列表接口
     *  @param  needPage 是否需要分页  false 为不需要分页
     *  @param  sCode  学校唯一标识
     *          err: 请求失败（包括网络链接失败／业务逻辑失败）
     *          data: 数据
     * */
    v5templateHomeUtil.getFrontDepList = function(sCode,needPage,callback){
        // 请求院系列表
        var url = API_BASE_URL + '/front/info/getFrontDepList?'
            +"needPage="+needPage
            +"&sCode="+sCode;
        superagent.get(url)
            .end(function (err, res2) {
                if (err) {
                    return callback(err,null);
                }
                if(res2.text.length < 2) {
                    return callback("后台出错了", null);
                }
                var data = JSON.parse(res2.text);
                return callback(err, data);

            });

    };


    /**
     * 请求院系详情 接口
     * @param   departmentId 院系id
     *              err: 请求失败（包括网络请求失败／业务逻辑失败）
     *              data: 数据
     *
     * *******/
    v5templateHomeUtil.findDepartmentDetail = function(id,callback){
        // 请求院系详情
        var url = API_BASE_URL + '/weixin/api/department/findDepartmentDetail?'
            +"departmentId="+id;
        superagent.get(url)
            .end(function (err, res2) {
                if (err) {
                    return callback(err,null);
                }

                var data = JSON.parse(res2.text);
                return callback(err, data.data);

            });
    };

    /*
    *  请求研究方向页面中,报考指南,点击专业查看,出现专业详情页面
    *  @param  majorResearchId  专业id
    *           err: 请求失败（包括网络请求失败／业务逻辑失败）
    *           data: 数据
    *
    * */
    v5templateHomeUtil.getMajorResearchDetail = function(majorResearchId,callback){
        // 请求院系详情
        var url = API_BASE_URL + '/front/info/getMajorResearchDetail?'
            +"majorResearchId="+majorResearchId;
        superagent.get(url)
            .end(function (err, res2) {
                if (err) {
                    return callback(err,null);
                }

                var data = JSON.parse(res2.text);
                data.data.showConfig = JSON.parse(data.data.showConfig);
                return callback(err, data.data);

            });
    };

    //二级页面改造  将二级页面导航栏的数据和首页导航栏的数据不同。二级页面导航栏显示全部的一级分类和二级分类
    /*
     *
     *
     * */
    v5templateHomeUtil.getSecondPageBarMenu = function(sCode,callback){
        // 请求全部的一级分类和下属二级分类
        var url = API_BASE_URL + '/front/template/getSecondPageBarMenu?'
            +"&sCode="+sCode;
        superagent.get(url)
            .end(function (err, res2) {
                if (err) {
                    return callback(err,null);
                }

                var data = JSON.parse(res2.text);
                return callback(err, data);

            });
    };













    //------------------ v5templateHomeUtil 工具方法 end---------------------
    return v5templateHomeUtil;


})();

module.exports = v5templateHomeUtil;