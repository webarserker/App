define(['util'], function(util) {
    var objWin = null;
    function openAnsDialog(){
        //不需要完善，直接进入对话框
        var host = util.getHost();
        var url = host + ':3000/users?id=' + $("#userId").val() + '&sCode=' + $("#sCode").val() + '&name=' + $("#nickName").val() + '&professor=智能招办' + "&school=" + $("#schoolName").val();
        _paq.push(['trackEvent', $("#identify").val(),'inteli-ans']);
        //判断是否打开
        if (objWin == null || objWin.closed) {
            objWin = window.open(url,
                'newwindow',
                'height=700, width=900, top=20, left=150, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
            if (objWin == null || typeof(objWin)=='undefined'){
                util.popTips({delay:5000, text:"窗口被浏览器阻止打开，请点击允许弹出窗口。", state:"alert"});
            }
        } else {
            objWin.focus();
        }
    };
    function gotoFaq(){
        window.location.href = "/front/info/toFaqCatPage/"+$("#sCode").val();
    };
    function getSelectedList(options) {
        var ipt = options.find('input[name="source"]:checked');
        var selectedTxt = [];
        var selectedVal = [];
        /*根据已选择的项返回相应的text和value*/
        ipt.each(function() {
            selectedTxt.push($(this).parent().text());
            selectedVal.push($(this).val());
        })

        return{
            selectedTxt: selectedTxt.join('，'),
            selectedVal: selectedVal.join(',')
        }
    };
    function perfectUserInfo(callback, checkLogin){
        if(checkLogin != null && checkLogin == false) {
            callback();
        }else {
            if ($("#userId").val() != null && $("#userId").val() != '') {
                $.ajax({
                    type: "POST",
                    url: '/front/user/unionUserLogin',
                    data: {"id": $("#userId").val(), "sCode": $("#sCode").val()},
                    dataType: "json",
                    success: function (data) {
                        if (data.alreadLogin) {
                            //被别人登录，需要重新登录
                            util.popTips({
                                delay: 5000,
                                text: "<div class='loginTip'>您账号已登录,请重新登录<a href='/front/user/toLogin?sCode=" + $("#sCode").val() + "'>登录</a><br/></div>",
                                state: "alert"
                            });
                        } else {
                            if (data.needAddUserInfo) {
                                util.popup({
                                    id: 'editUserInfo',
                                    width: '500px',
                                    height: '500px',
                                    til: '完善信息',
                                    beforeShow: function () {
                                        //将数据插入到对应的框中
                                        //用户生源地
                                        var province = data.province;
                                        var provinceId = data.provinceId;
                                        if (province != null && province != '') {
                                            $("#location").html(province)
                                            $("#location").attr('value', provinceId);
                                        } else {
                                            $("#location").html("不限")
                                        }
                                        $("#userId").val(data.id);
                                        $("#options").empty();
                                        $("#options").append("<li><a href='javascript:;' value=''>不限</a></li>")
                                        var provinces = data.provinces
                                        for (i = 0; i < provinces.length; i++) {
                                            $("#options").append("<li><a href='javascript:;' value='" + provinces[i].id + "'>" + provinces[i].name + "</a></li>")
                                        }
                                        var scienceClass = data.scienceClass;
                                        if (scienceClass != null && scienceClass != '') {
                                            $("#scienceClass").html(scienceClass);
                                            $("#scienceClass").attr('value', scienceClass);
                                        } else {
                                            $("#scienceClass").html("请选择")
                                        }
                                        var sourceTypeText = data.sourceTypeText;
                                        if (sourceTypeText != null && sourceTypeText != '') {
                                            $("#sourceType").html(sourceTypeText)
                                            $("#sourceType").attr('value', sourceTypeText);
                                        } else {
                                            $("#sourceType").html("请选择")
                                        }
                                        $("#sourceTypeUl").empty();
                                        $("#sourceTypeUl").append("<li><a href='javascript:;' value=''>请选择</a></li>")
                                        var sourceTypes = data.sourceTypes
                                        for (i = 0; i < sourceTypes.length; i++) {
                                            $("#sourceTypeUl").append("<li><a href='javascript:;' value=''><input type='checkbox' name='source' class='g-mr-5' value=" + sourceTypes[i].name + " />" + sourceTypes[i].name + "</a></li>")
                                        }
                                        $("#score").val(data.score);
                                        /*下拉框事件*/
                                        $('.g-select').click(function (e) {
                                            var self = $(this);
                                            var options = $(self.find('.options').get(0));

                                            if (!self.attr('readonly')) {
                                                if (options.is(':hidden')) {
                                                    options.show();
                                                } else {
                                                    options.hide();
                                                }
                                            }
                                            $(document).one("click", function () {
                                                $(".g-select .options").hide();
                                            });

                                            e.stopPropagation();
                                        });

                                        /*下拉框option点击事件*/
                                        $('.g-select li').click(function (e) {
                                            var self = $(this);
                                            var multitype = self.parents('.g-select').attr('multiple');
                                            var resultTxt = self.find('a').text();
                                            var resultVal = self.find('a').attr('value');
                                            var resultEle = self.parents('.sleBd').find('.value');
                                            var src = e.target || e.srcElement;

                                            if (multitype == "multiple") {
                                                e.stopPropagation();
                                                if (src.tagName.toLowerCase() != 'input') {

                                                    if (self.find('input').attr('checked') == 'checked') {
                                                        self.find('input').removeAttr('checked');
                                                    } else {
                                                        self.find('input').click();
                                                    }
                                                }
                                                resultTxt = getSelectedList(self.parents('.options')).selectedTxt;
                                                resultVal = getSelectedList(self.parents('.options')).selectedVal;
                                            }

                                            if (resultTxt == '') {
                                                resultTxt = '请选择';
                                                resultVal = '';
                                            }
                                            resultEle.text(resultTxt).attr('value', resultVal);
                                            if (multitype == 'multiple') {
                                                resultEle.attr("title", resultVal);
                                            }
                                        });

                                    },
                                    confirmCallback: function () {
                                        //取到参数值，保存，调整
                                        var params = {};
                                        params['id'] = $('#userId').val();
                                        params['provinceId'] = $('#location').attr("value");
                                        var provinceName = $('#location').html();
                                        if (provinceName == '不限') {
                                            provinceName = '';
                                        }
                                        params['provinceName'] = provinceName;
                                        params['scienceClass'] = $('#scienceClass').attr("value");
                                        params['sourceType'] = $('#sourceType').attr("value");
                                        params['score'] = $('#score').val();
                                        params['schoolCode'] = $('#sCode').val();
                                        $.ajax({
                                            type: "POST",
                                            url: '/front/user/updateUserInfo',
                                            data: params,
                                            dataType: "json",
                                            success: function (data) {
                                                return;
                                                if (data && data.retCode == 0) {
                                                    util.popTips({text: "修改成功", state: "ok"});
                                                } else {
                                                    util.popTips({text: data.message, state: "no"});
                                                }
                                                callback()
                                            },
                                            error: function () {
                                                util.popTips({text: "用户信息修改失败", state: "no"});
                                                callback()
                                            }
                                        });
                                    },
                                    cancleCallback: function () {
                                        callback();
                                    },
                                    closeCallback: function () {
                                        callback();
                                    }
                                });
                            } else {
                                callback();
                            }
                        }
                    }
                });


            } else {
                //alert("您还未登录,请先登录");
                util.popTips({
                    delay: 5000,
                    text: "<div class='loginTip'>您还未登录,请先<a href='/front/user/toLogin?sCode=" + $("#sCode").val() + "'>登录</a><br/><br/>如果还没有账户需要先<a href='/front/user/toRegister?sCode=" + $("#sCode").val() + "'>注册</a>哦 ！</div>",
                    state: "alert"
                });
            }
        }
    }
	return {
        openAnsDialog : openAnsDialog,
        perfectUserInfo: perfectUserInfo,
        gotoFaq: gotoFaq
	}
})
