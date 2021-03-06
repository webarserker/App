var weixin = {
    appid: 'wx8d1225f74a22e37d',
    appsecret: '798ff93012f9c3732c8c2556cab06970',
    web: {
        appid: 'wx0d92d42bf0a91722',
        appsecret: 'f91ef7c9338cd174044dc2352a7f11f4',
    },
    interface: {
        token: 'intelians'
    },
    authorize: 'https://open.weixin.qq.com/connect/oauth2/authorize',
    access_token: 'https://api.weixin.qq.com/sns/oauth2/access_token',
    userinfo: 'https://api.weixin.qq.com/sns/userinfo',
    //
    access: {
        token: {
            get: 'https://api.weixin.qq.com/cgi-bin/token'
        }
    },
    group: {
        create: 'https://api.weixin.qq.com/cgi-bin/groups/create',
        get: 'https://api.weixin.qq.com/cgi-bin/groups/get',
        getid: 'https://api.weixin.qq.com/cgi-bin/groups/getid',
        update: 'https://api.weixin.qq.com/cgi-bin/groups/update'
    },
    user: {
        group: {
            'mv': 'https://api.weixin.qq.com/cgi-bin/groups/members/update'
        },
        get: 'https://api.weixin.qq.com/cgi-bin/user/get',
        info: 'https://api.weixin.qq.com/cgi-bin/user/info'
    },
    upload: {
        file: 'http://file.api.weixin.qq.com/cgi-bin/media/upload',
        news: 'https://api.weixin.qq.com/cgi-bin/media/uploadnews'
    },
    msg: {
        sendall: 'https://api.weixin.qq.com/cgi-bin/message/mass/sendall',
        send: 'https://api.weixin.qq.com/cgi-bin/message/mass/send'
    },
    menu: {
        get: 'https://api.weixin.qq.com/cgi-bin/menu/get',
        del: 'http://localhost:8080/weixin-server/smsReceiver.jsp',
        create: 'http://localhost:8080/weixin-server/smsReceiver.jsp'
    },
    message: {
        custom: {
            send: 'http://localhost:8080/weixin-server/smsReceiver.jsp'
        }
    }
};

module.exports = weixin;