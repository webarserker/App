define(['common'], function() {
    var util = require('util');
    
    (function() {
        //退出系统
        $('#loginOut').click(function() {
            //弹出确认提示框aaa
            util.popup({
                id:'logoutPop',
                width:'420px',
                til:'提示',
                confirmCallback: function() {
                    window.location = '/front/user/loginOut';
                }
            });
        });

        //底部友情链接
        $.ajax({
            type:"GET",
            url: '/front/template_02/friendLink',
            dataType: "json",
            success: function(data){
                var result = [];
                var cur;
                for(var i = 0; i < data.length; i++) {
                    cur = data[i];
                    result.push('<li><a href="'+ cur.link +'" title="'+ cur.name +'" target="_blank">' + cur.name + '</a></li>');
                }
                $('#links').html(result.join(''));
            },
            error: function(e){
                debugger;
                alert("服务器发生错误");
            }
        });

    })();
})
