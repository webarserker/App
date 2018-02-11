$(function () {

    if (window.addEventListener) {
        window.addEventListener('message', handMessage, false);
    } else {
        window.attachEvent('onmessage', handMessage);
    }

    function handMessage(event) {
        event = event || window.event;
        if (!event || !event.data)
            return;
        // 消息结构体：{type: 'toggleWindowMaximum', 'data':{}}
        var msg = event.data;
        switch (msg.type) {
            case 'new_tab': // 对话框-打开
                toPage(msg.data.url, msg.data.name, msg.data.index);
                break;
            /*case 'close_tab': // 对话框-关闭
                tabFrameUtil.closeById(msg.data.url);
                break;*/
            default:
        }
    }
});