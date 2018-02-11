import { sub, query, queryAll, css } from '../lib/util';

var ajaxExpired = function(data){
    if(data && data.expired){
        if(os.wechat){
            location.href = '/weixin/auth?redirect=' + btoa(location.href);
        }else{
            location.href = '/login.html?redirect=' + btoa(location.href);
        }
    };
}

var showPage = function(callback){
    // 显示白色背景和loading图标至少500毫秒
    // loading图标立即隐藏，显示页面内容
    // 白色背景逐渐淡出（800毫秒）
    setTimeout(function(){
        css('#page-loading .page-loading-icon', 'display', 'none');
        css('#body', 'display', '');
        fadeOut('#page-loading', 800, callback);
    }, 500);
}

// 隐藏loading
var fadeOut = function(tag, time, callback){

    var second = time/1000;
    
    css(tag, {
        visibility: 'hidden',
        opacity: '0',
        transition: 'visibility 0s ' + second + 
            's, opacity ' + second + 's linear',
    });

    setTimeout(function(){
        css(tag, 'display', 'none');
        callback && callback();
    }, time);
}

// 据说主流浏览器都支持 navigator.platform
var os = (function(p, ua){
    var win = !!p.match(/^Win/),
        mac = !!p.match(/^Mac/),
        linux = p === 'X11' || !!p.match(/^Linux/),
        mobile = !(win || mac || linux),
        wechat = !!ua.match(/micromessenger/);
    
    return {
        win: win,
        mac: mac,
        linux: linux,
        mobile: mobile,
        wechat: wechat
    };
}(
    navigator.platform, 
    navigator.userAgent.toLowerCase()
));

export {
    ajaxExpired,
    showPage,
    os
}