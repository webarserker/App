require.config({
    baseUrl:"../../../static/scripts/front/"
});
require(['../../../static/scripts/front/config.js'],function(){
    require(['jquery','util', "common", 'validate',"getNoticeNum"],function($, util,c,validate,getNoticeNum){
        var ansswerOff = {
    		getNoticeNum : function(){
				if($("#userId").val() != null && $("#userId").val() != '') {
					getNoticeNum.queryNum();
				}
			},
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
                //表单验证
                var uf = new Userform([new Field({
                    fid: 'question',
                    val: [new Required_val('咨询问题不能为空'), new Len_val(0, 100, '长度不能超过100个字符')],
                    suc: function() {
                        hideErr('question');
                    },
                    err: function(text) {
                        showErr('question', text);
                    }
                })]);

                uf.set_submit('submit', function() {
                    $('#submit').attr("disabled", "disabled");
                    addAnswerOff();
                });
                function showErr(idstr, tip) {
                    var tipWrap = $('#' + idstr + 'Wp').find('.valErrTip');

                    tipWrap.html('<i class="errorSIcon g-mr-5"></i><span>'+ tip +'</span>').show();
                }
                function hideErr(idstr) {
                    var tipWrap = $('#' + idstr + 'Wp').find('.valErrTip');

                    tipWrap.html('').hide();
                }

                function addAnswerOff(){
                    var params = {};
                    params['forwordUser'] = $('#userId').val();
                    var question = $.trim($('#question').val());
                    params['question'] = question;
                    var schoolCode = $.trim($('#scode').val());
                    params['schoolCode'] = schoolCode;
                    $.ajax({
                        type:"POST",
                        url: '/front/answerOff/save',
                        data: params,
                        dataType: "json",
                        success: function(data){
                            if(data){
                                util.popTips({text:"保存成功", state:"ok",callback:function(){
                                	window.location.reload();
                                }});
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
                me.getNoticeNum();
            }
        }
        ansswerOff.init();
    });
});

