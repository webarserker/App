var CONFIG ={};
CONFIG.DEBUG=1;// 0 Release,1 本地， 2 测试服务器
CONFIG.HOME_PPT = 0; // home工程：1表示为ppt官网主页域名，0表示www官网主页域名

//------------------------------------------------------------------
// 部分常量定义
CONFIG.CONST={};
CONFIG.CONST.WEB_HOME_SERVER_DOMAIN = 'zhinengdayi.com'; // www官网主页域名
CONFIG.CONST.WEB_HOME_SERVER_DOMAIN_FOR_DEV = 'test.zhinengdayi.com'; // 测试服务器
CONFIG.CONST.INNER_TEST_SERVER_DOMAIN = '127.0.0.1'; // 开发本地调试

//CONFIG.CONST.INNER_TEST_SERVER_IP = '192.168.31.252'; // 内网服务器IP


//---------------------图片阿里云的定义----------------------------
CONFIG.CONST.WEB_IMG_SERVER_DOMAIN = 'img.zhinengdayi.com';             // 本地模式
CONFIG.CONST.WEB_IMG_SERVER_DOMAIN_FOR_DEV = 'testimg.zhinengdayi.com';  // 测试服务器



//---------------------------------------------------------------



// PC端模板化配置
if(CONFIG.DEBUG==1) CONFIG.HOME_SERVER_DOMAIN_FOR_HOME      = CONFIG.CONST.INNER_TEST_SERVER_DOMAIN ;// 开发本地调试
else if(CONFIG.DEBUG==2) CONFIG.HOME_SERVER_DOMAIN_FOR_HOME = CONFIG.CONST.WEB_HOME_SERVER_DOMAIN_FOR_DEV;// 测试服务器
else CONFIG.HOME_SERVER_DOMAIN_FOR_HOME                     = CONFIG.CONST.WEB_HOME_SERVER_DOMAIN; // 外网部署

CONFIG.HOME_SERVER_PORT = 2700;
if(CONFIG.DEBUG==1){
    CONFIG.HOME_SERVER_PORT = 2700
}else{
    CONFIG.HOME_SERVER_PORT = 80
}

CONFIG.HOME_SERVER_FULL_URL =  CONFIG.DEBUG==1?('http://'+ CONFIG.HOME_SERVER_DOMAIN_FOR_HOME+':'+CONFIG.HOME_SERVER_PORT):(
    CONFIG.DEBUG==2?('http://'+ CONFIG.HOME_SERVER_DOMAIN_FOR_HOME+':'+CONFIG.HOME_SERVER_PORT):('http://'+ CONFIG.HOME_SERVER_DOMAIN_FOR_HOME)
);


// api的配置
if(CONFIG.DEBUG==1) CONFIG.API_SERVER_FULL_URL = 'http://testadmin.zhinengdayi.com';        // 开发本地调试
else if(CONFIG.DEBUG==2) CONFIG.API_SERVER_FULL_URL = 'http://testadmin.zhinengdayi.com';   // 测试服务器
else CONFIG.API_SERVER_FULL_URL = 'http://admin.zhinengdayi.com';                            // 外网部署

// 机器人api的配置
if(CONFIG.DEBUG==1) CONFIG.ROBOT_SERVER_FULL_URL = 'http://robot.zhinengdayi.com:3000';        // 开发本地调试
else if(CONFIG.DEBUG==2) CONFIG.ROBOT_SERVER_FULL_URL = 'http://robot.zhinengdayi.com:3000';   // 测试服务器
else CONFIG.ROBOT_SERVER_FULL_URL = 'http://robot.zhinengdayi.com:3000';





// 图片阿里云的定义配置
if(CONFIG.DEBUG==1) CONFIG.IMG_SERVER_DOMAIN_FOR_HOME      = CONFIG.CONST.WEB_IMG_SERVER_DOMAIN_FOR_DEV;// 开发本地调试
else if(CONFIG.DEBUG==2) CONFIG.IMG_SERVER_DOMAIN_FOR_HOME = CONFIG.CONST.WEB_IMG_SERVER_DOMAIN_FOR_DEV;// 测试服务器
else CONFIG.IMG_SERVER_DOMAIN_FOR_HOME                     = CONFIG.CONST.WEB_IMG_SERVER_DOMAIN;        // 外网部署


CONFIG.IMG_SERVER_FULL_URL =  CONFIG.DEBUG==1?('http://'+ CONFIG.IMG_SERVER_DOMAIN_FOR_HOME):(
    CONFIG.DEBUG==2?('http://'+ CONFIG.IMG_SERVER_DOMAIN_FOR_HOME):('http://'+ CONFIG.IMG_SERVER_DOMAIN_FOR_HOME)
);

// 微信移动端跳转的配置
if(CONFIG.DEBUG==1) CONFIG.MOBILE_SERVER_FULL_URL = 'http://test.rocklee.com.cn';        // 开发本地调试
else if(CONFIG.DEBUG==2) CONFIG.MOBILE_SERVER_FULL_URL = 'http://test.rocklee.com.cn';   // 测试服务器
else CONFIG.MOBILE_SERVER_FULL_URL = 'http://weixin.zhinengdayi.com';                   //  外网部署






//---------------PC端模板阿里云图片配置-----------

module.exports = CONFIG;