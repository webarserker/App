/*
配置引入的js库的路径
*/
require.config({
	paths:{
		"jquery": "libs/jquery-1.10.2.min",
		"unslider": "libs/unslider-min",
        "slide": "libs/slide/slide",
        "resize": "libs/resize",
		"util": "common/util",
		"common": "common/common",
		"validate": "libs/validate",
		"selfService" : "page/selfService",
		"modelIntelEnter" : "page/model-intelenter",
		"customerContent" : "page/customerContent",
		"schoolScenery" : "page/schoolScenery",
		"schoolVido" : "page/schoolVido",
		"login" : "loginReg/login",
		"register" : "loginReg/register",
		"userInfo" : "loginReg/userInfo",
		"subpage": "page/subpage",
		"intelliRobot" : "page/intelliRobot",
		"getNoticeNum": "page/getNoticeNum",
		"qrcode": "../jquery.qrcode.min",
		"nicescroll": "../jquery/jquery.nicescroll.min"
	},
	shim:{
		"unslider":{
            deps: ["jquery"],
            exports:"unslider"
		},
        "slide":{
            deps: ["jquery"],
            exports:"slide"
        },
        "resize":{
            deps: ["jquery"],
            exports:"resize"
        },
		"qrcode":{
			deps: ["jquery"],
			exports:"qrcode"
		},
		"util":{
			deps: ["jquery"],
			exports:"util"
		},
		"common":{
			deps: ["jquery"],
			exports:"common"
		},
		"validate":{
			deps: ["jquery"],
			exports:"validate"
		},
		"selfService":{
			deps: ["jquery"],
			exports:"selfService"
		},
		"customerContent":{
			deps: ["jquery"],
			exports:"customerContent"
		},
		"schoolScenery":{
			deps: ["jquery"],
			exports:"schoolScenery"
		},
		"login":{
			deps: ["jquery"],
			exports:"loign"
		},
		"register":{
			deps: ["jquery"],
			exports:"register"
		},
		"userInfo":{
			deps: ["jquery"],
			exports:"userInfo"
		},
		"subpage":{
			deps: ["jquery"],
			exports:"subpage"
		},
		"intelliRobot":{
			deps: ["jquery"],
			exports:"intelliRobot"
		},
		"getNoticeNum":{
			deps: ["jquery"],
			exports:"getNoticeNum"
		}
	}
});
