define(['intelliRobot'], function() {
    var util = require("util");

    return {
        getContactWays : function(){
            var params = {};
            params['sCode'] = $('#sCode').val();
            $.ajax({
                type:"POST",
                url: '/front/getContactWays',
                data: params,
                dataType: "json",
                success: function(data){
                    if(data && data.success){
                        if(data.data && data.data.length > 0){
                            var contactWays = data.data;
                            for(var key in contactWays){
                                var contactWay = contactWays[key];
                                if(contactWay.contactType == 1){
                                    if(contactWay.isShow == 1){
                                        var mobileArray = contactWay.contact.split(/，|,/);
                                        var mobile = mobileArray[0];
                                        var moreMobile = '';
                                        for(var mKey in  mobileArray){
                                             moreMobile += mobileArray[mKey]+'<br>';
                                        }
                                        $('#mobileAppointment').attr("title", moreMobile);
                                        //$('#moreHotline').attr("title", moreMobile);
                                    }else{
                                        $('#contactDiv_1').hide();
                                    }
                                }else if(contactWay.contactType == 2){
                                    if(contactWay.isShow == 1){
                                        $('#messageEmail').html(contactWay.contact);
                                        $("#email_btn").attr('href', 'mailto:' + contactWay.contact);
                                    }else{
                                        $('#contactDiv_2').hide();
                                    }
                                }
                            }
                        }
                    }


                },
                error: function(data){
                    //alert("服务器发生错误");
                }
            });

            $('#mobileAppointment').click(function(){
                var mobile = $(this).attr("title");
                util.popup({
                    id:'mbReservePop',
                    width:'420px',
                    til: '电话预约',
                    beforeShow: function() {
                        if(mobile != '' && mobile != undefined){
                            $('#mbReserveCon').html(mobile);
                        } else {
                            $('#mbReserveCon').html('暂无预约电话');
                        }
                    }
                });
            });
            /*$('#moreHotline').click(function(){
                var moreMobile = $(this).attr("title");
                util.popup({
                    id:'moreHotLinePop',
                    width:'420px',
                    til: '更多热线',
                    beforeShow: function() {
                        if(moreMobile != '' && moreMobile != undefined){
                            var mbArr = moreMobile.split(/，|,/);
                            var str = [];

                            for(var i = 0; i < mbArr.length; i++) {
                                str.push(mbArr[i]);
                            }
                            $('#hotline-list').html(str.join('，'));
                        } else {
                            $('#hotline-list').html('没有更多热线');
                        }
                    }
                });
            });*/
        }
    }

});

function toSelfServiceList(categoryId){
    var sCode = $('#sCode').val();
    window.location.href = contextPath + "/front/info/route/2/"+categoryId;
}
