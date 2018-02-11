define(['util'], function() {
    //获取客户端浏览器的版本信息
    function getBrowserVersion() {
        var osArr={
            ie6: /MSIE 6/i.test(navigator.userAgent),
            ie7: /MSIE 7/i.test(navigator.userAgent),
            ie8: /MSIE 8/i.test(navigator.userAgent),
            ie: /MSIE/i.test(navigator.userAgent),
            firefox: /Firefox/i.test(navigator.userAgent),
            opera: /Opera/i.test(navigator.userAgent),
            webkit: /Webkit/i.test(navigator.userAgent)
        };
        for(var osVersion in osArr){
            if(osArr[osVersion]){
                return osVersion;
                break;
            }
        }
    }
    /**
     * 字符串替换方法
     * @param str 原始字符串
     * @param re 需要被替换的内容，可以是字符串或者对象，如果是对象，每个键值对都是一对（re, tr）
     * @param rt 用它去替换需要被替换的内容
     * @returns 返回成功替换之后的字符串
     */
    function strReplace(str, re, rt) {
        if (rt != undefined) {
            replace(re, rt);
        } else {
            for (var key in re) {
                replace(key, re[key]);
            }
            ;
        }
        function replace(a, b) {
            var arr = str.split(a);
            str = arr.join(b);
        }
        return str;
    }
    /**
     * 弹窗方法
     * @param param
     */
    function popup(param){
        var init = {
            til: '',//弹窗标题
            id: '',//弹窗id
            width: "550px",//弹窗宽度
            height: "500px",//弹窗高度
            showNav: true,//弹窗是否需要标题,true==需要，false==不需要
            beforeShow: null,//弹窗弹出前调用
            closeCallback: null,//关闭弹窗之后的回调函数
            confirmCallback: null,//确认之后的回调函数
            cancleCallback: null,//取消之后的回调函数
            setClass:'g-tanchu-box'//自定义弹窗样式，默认为g-tanchu-box，在popup/popup.css中定义了默认样式
        };
        var initParam = $.extend(init, param || {});
        //弹窗模板
        var htmlStruct = ['<div id="g-tanchu-box" class="{#setClass#}">',
                            '<span style="display:none" id="biaoshi">{#id#}</span>',
                            '<div class="tanchu-bg"></div>',
                            '<div class="tanchu-page-box">',
                                '<div class="tanchu-page-box-sty" style="width:{#width#};height:{#height#}">',
                                    '<div class="tanchu-page-box-nr">',
                                        '<a href="javascript:;" class="close-tanchu set-close-pign"></a>',
                                        '<p class="til setTil" >{#til#}</p>',
                                        '<div id="tanchu-append-obj" class="tanchu-append-obj"></div>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>'].join('');
        var htmlStr = strReplace(htmlStruct, {
            '{#setClass#}' : initParam.setClass,
            '{#id#}' : initParam.id,
            '{#width#}' : initParam.width,
            '{#height#}' : initParam.height,
            '{#til#}' : initParam.til
        });
        
        if(initParam.beforeShow){initParam.beforeShow();}
        
        $('body').append(htmlStr);
        
        $('#' + initParam.id).children().appendTo($('#tanchu-append-obj'));
        
        //计算弹窗的位置
        setPopPosition();
        //是否需要展示标题
        if(!initParam.showNav){
            $('#g-tanchu-box .til').hide();
        }
        //弹窗关闭/取消按钮绑定事件
        $('.close-tanchu').on('click',function(){
            closeFn();
        });
        //确认按钮
        if($('.tanchu-btn-confirm').length != 0) {
            $('.tanchu-btn-confirm').click(function() {
            	closeFn();
                if(initParam.confirmCallback){initParam.confirmCallback();}
            });
        }
        //取消按钮
        if($('.tanchu-btn-cancle').length != 0) {
            $('.tanchu-btn-cancle').click(function() {
                closeFn();
                if(initParam.cancleCallback){initParam.cancleCallback();}
            });
        }
        //背景遮罩随窗口大小变化
        $(window).resize(function() {
            getbgBox();
        });
        $(window).trigger('resize');
        
        //重新获取遮罩的宽高
        function getbgBox(){
            var width = $(document).width();
            var height = $(document).height();
            
            $('#g-tanchu-box').find('.tanchu-bg').css({height: height, width: width});
        }
        //点击关闭/取消按钮
        function closeFn(){
            var k = $('#biaoshi').html();
            if (k) {
                $('#tanchu-append-obj').children().appendTo($('#' + initParam.id));
                $('#g-tanchu-box').remove();
                $('.tanchu-btn-confirm').unbind('click');
                $('.tanchu-btn-cancel').unbind('click');
                if(initParam.closeCallback){initParam.closeCallback();}
            }
        }
        //设置弹窗的位置
        function setPopPosition(){
            var top = Math.ceil(($(window).height()/2) - ($('#g-tanchu-box .tanchu-page-box').height()/2));
            
            $('#g-tanchu-box .tanchu-page-box').css('top',top);
            
            if(getBrowserVersion()=='ie6'){
                $(window).scroll(function(){
                        $('#g-tanchu-box .tanchu-page-box').css('top',$(document).scrollTop() + top);
                });
                $('#g-tanchu-box .tanchu-page-box').css('left',0);
            }
        }
        
        return {
            close: function(){
                $('#g-tanchu-box .close-tanchu').trigger('click');
            }
        };
    };
    /*placeholder 兼容IE*/
    (function($) {
        $.fn.placeholder = function(opts) {
            var $this = $(this);

            var surport = 'placeholder' in document.createElement('input');

            if(!surport) {
                $this.each(function() {
                    var me = $(this);
                    // Get x position
                    var x = me.position().left;
                    // Get y position
                    var y = me.position().top;
                    // Get value
                    var val = me.attr("placeholder");
                    // Get parent element
                    var parent = me.parent();
                    //创建新标签，定位显示
                    var span = $('<span class="place">'+ val +'</span>').css({
                        'position': 'absolute',
                        'left': x,
                        'top': y,
                        'color': '#999',
                        'font-size': '16px',
                        'padding-left': '5px'
                    }).insertBefore($(this));   
                });

                //点击该标签，其对应的表单要获得焦点
                $this.parent().on('click', 'span.place', function() {
                    $(this).parent().find('input').focus();
                });
                //表单改变的时候隐藏该标签
                $this.bind('input propertychange', function() {
                    $(this).parent().find('span.place').hide();
                });
                //表单失去焦点，如果值为空，再次展示提示信息
                $this.blur(function() {
                    if($this.val() == '') {
                        $(this).parent().find('span.place').show();
                    }
                })
            }
        }

    })(jQuery);

    /**
     * loading展示方法
     * @param jqdom 用户展示loading的jq元素
     * @returns 返回3个方法，分别用于展示loading，取消loading，展示出错信息
     */
    function loadObj(jqdom) {
        var loadMsg = [
            '<span style="display:inline-block;padding:0px;width:16px;height:16px;" class="ajaxLoading">',
            '</span>'
            ].join(''),
            timeout = 6000,
            task,
            obj;
        return obj = {
             loading : function() {
                jqdom.html(loadMsg);
                task = setTimeout(function() {
                    obj.error('网络或系统繁忙，请稍后再试...');
                }, timeout);
            },
            loaded : function() {
                jqdom.html('');
                    clearTimeout(task);
            },
            error : function(msg) {
                popTips({
                    text: msg,
                    state: 'no'
                });
                clearTimeout(task);
            }
       }
    };

    /*
     * 弹出tips
     * @param param
     * 
     */
    function popTips(param){
        //param  text:提示信息文本,state:"状态，为ok或者no" callback:提示结束回调函数
        if (!param.text) return
        param.delay = param.delay || 2000;
        param.state = param.state || "alert";
        param.callback =param.callback||""; 
        var _tip = $(".tip_wrap");
        var _dom = document.documentElement;
        var top = _dom.scrollTop + _dom.clientHeight - (_dom.clientHeight / 1.7);
        if (_tip.length === 0) {
            _tip = $(['<div class="tip_wrap">',
                        '<span class="tip-nr">',
                            '<span class="tip-icon"></span>',
                            '<span id="g_tip_con"></span>',
                        '</span>',
                    '</div>'].join(''));

            _tip.find(".tip-nr").addClass("tip-nr-" + param.state);
            _tip.find("#g_tip_con").html(param.text);
            _tip.css({"_top": top});
            $("body").append(_tip);
            _tip.show(0, function() {
                    setTimeout(function(ele) {
                        return function() {
                            $(ele).remove();
                            //debugger;
                            if(param.callback && param.callback.constructor == Function){
                                param.callback();
                            }
                        };
                    } (this), param.delay);
            });
        }

        if(getBrowserVersion()=="ie6"){
                $(".tip_wrap").css("left",0);
        }
    };
    /**
     * 获取客户端浏览器的版本信息
     * @returns
     */
    function getBrowserVersion(){
           var osArr={
               ie6: /MSIE 6/i.test(navigator.userAgent),
               ie7: /MSIE 7/i.test(navigator.userAgent),
               ie8: /MSIE 8/i.test(navigator.userAgent),
               ie: /MSIE/i.test(navigator.userAgent),
               firefox: /Firefox/i.test(navigator.userAgent),
               opera: /Opera/i.test(navigator.userAgent),
               webkit: /Webkit/i.test(navigator.userAgent)
           };
           for(var osVersion in osArr){
               if(osArr[osVersion]){
                   return osVersion;
                   break;
               }
            }
    };
    /**
     * 截取字符串
     */
    function interceptString (str, length) {
        if(!length)
            length = 15;
        if (str) {
            if (str.length > length) {
                str = str.substr(0, length) + "...";
            }
            return str;
        }
        return "";
    };
    /*功能: 日期格式化
     date: 需格式化的日期
     format: 格式字符串
     */
    function formatDate (date, format) {
        var o = {
            "M+": date.getMonth() + 1, //month
            "d+": date.getDate(), //day
            "h+": date.getHours(), //hour
            "m+": date.getMinutes(), //minute
            "s+": date.getSeconds(), //second
            "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
            "S": date.getMilliseconds() //millisecond
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }
    function getHost() {
        var host = window.location + "";
        //截取host
        if(host.indexOf('http://') > -1) {
            host = host.substr(7, host.length-1);
        }

        if(host.indexOf(':') > 0) {
            host = host.substr(0, host.indexOf(':'));
        }
        if(host.indexOf('/') > 0) {
            host = host.substr(0, host.indexOf('/'));
        }
        return 'http://'+host;
    }
    return {
        popup: popup,
        popTips: popTips,
        loadObj: loadObj,
        interceptString: interceptString,
        formatDate: formatDate,
        getHost: getHost
    }
})
