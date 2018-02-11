require.config({
    baseUrl:"../../../static/scripts/front/"
});
require(['../../../static/scripts/front/config.js'],function(){
    require(['jquery','util', "common", 'validate'],function($, util,c){
        var onlineAdvice = {
            /*页面绑定事件*/
            bindEvent: function() {
                var me = this;
                /*头部个人信息下拉框*/
				$('#userPhoto').click(function(e){
					$('#dropDown').toggle();
					$(document).one("click", function(){
				        $('#dropDown').hide();
				    });
				    e.stopPropagation();
				});

                /*生源地下拉框事件*/
                $('#msgTypeSel').click(function(e) {
                    var self = $(this);
                    var options = $(self.find('.options').get(0));

                    if(options.is(':hidden')) {
                        options.show();
                    } else {
                        options.hide();
                    }

                });
                /*下拉框option点击事件*/
                $('#msgTypeSel li').click(function(e) {
                    var self = $(this);
                    var resultTxt = self.find('a').text();
                    var resultVal = self.find('a').attr('value');
                    var resultEle = $('#msgTypeSel').find('.value');

                    resultEle.text(resultTxt).attr('value',resultVal);
                });

                /*表单change事件*/
                $('textarea[name="suggest"],input[name="address"]').keydown(function() {
                    var idstr = $(this).attr('id');
                    hideErr(idstr);
                });
                //表单验证
                var uf = new Userform([new Field({
                    fid: 'suggest',
                    val: [new Required_val('反馈意见不能为空'), new Len_val(0, 300, '昵称长度不能超过300个字符')],
                    suc: function() {
                        hideErr('suggest');
                    },
                    err: function(text) {
                        showErr('suggest', text);
                    }
                }),new Field({
                    fid: 'address',
                    val: [new Required_val('电话号码/邮箱不能为空')],
                    suc: function() {
                        hideErr('address');
                    },
                    err: function(text) {
                        showErr('address', text);
                    }
                })]);

                uf.set_submit('submit', function() {
                    $('#submit').attr("disabled", "disabled");
                    addAdvice();
                });
                function showErr(idstr, tip) {
                    var tipWrap = $('#' + idstr + 'Wp').find('.valErrTip');

                    tipWrap.html('<i class="errorSIcon g-mr-5"></i><span>'+ tip +'</span>').show();
                }
                function hideErr(idstr) {
                    var tipWrap = $('#' + idstr + 'Wp').find('.valErrTip');

                    tipWrap.html('').hide();
                }

                function addAdvice(){
                    var params = {};
                    params['type'] = $('#msgType').attr("value");
                    var content = $.trim($('#suggest').val());
                    var contact = $.trim($('#address').val());
                    params['content'] = content;
                    params['contact'] = contact;

                    $.ajax({
                        type:"POST",
                        url: '/front/userAdvice/save',
                        data: params,
                        dataType: "json",
                        success: function(data){
                            if(data && data.success == true){
                                util.popTips({text:"保存成功", state:"ok"});
                                window.location.reload();
                            }else{
                                $('#submit').removeAttr("disabled");
                                util.popTips({text:"保存失败，请联系运营人员", state:"no"});
                            }
                        },
                        error: function(){
                            $('#submit').removeAttr("disabled");
                            util.popTips({text:"保存失败，请联系运营人员", state:"no"});
                        }


                    });
                }
            },
            initPlaceHolder: function() {
                $(":input[placeholder]").placeholder();
            },
            /*页面初始化入口*/
            init: function() {
                var me = this;

                me.initPlaceHolder();
                me.bindEvent();
            }
        }
        onlineAdvice.init();
    });
});

