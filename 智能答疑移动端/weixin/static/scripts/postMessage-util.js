//接收消息
window.addEventListener('message', function(e) {
    console.log("location.pathname>>>"+location.pathname);
    console.log('e.data>>>'+e.data);
    debugger;
    // if(e.data.path == location.pathname) {//判断接收消息的页面
        if(e.data.message != null && e.data.message != {}) {
            var messageObj = {title: '提示', content: e.data.message, lock:true ,ok: '确定'};
            if(e.data.success == true) {
                messageObj['icon'] = 'success.gif';
            }else {
                messageObj['icon'] = 'alert.gif';
            }
            $.dialog(messageObj);
        }
        if(e.data.callback) {
            e.data.callback();
        }
    // }
});

var postMessageUtil = {
    //data:{path:'/infoContent/save',action:'alert', message:'操作成功',success:'true', callback: functionName}
    post : function(data, domain){
        debugger;
        window.postMessage(data, domain);
    },
}