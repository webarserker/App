$(function(){
    var saveTemplateModuleUrl = '/frontTemplate/saveModule';
    $("#type").change(function() {
        if($('#type').val() == 1) {
            $(".contentType").show();
            $(".redirectUrl").hide();
        }else {
            $(".contentType").hide();
            $(".redirectUrl").show();
        }
    });
    $("#cancelBtn").click(function(){
        dialog.close();
    });
    $("#saveBtn").click(function(){
        //参数校验
        if(!$("#keyNum").val() || $("#keyNum").val() == '') {
            parent.$.dialog({title: '提示', content: "请填写模块标识", icon: 'alert.gif',lock:true , ok: '确定'});
            return false;
        }
        if(!$("#name").val() || $("#name").val() == '') {
            parent.$.dialog({title: '提示', content: "请填写名称", icon: 'alert.gif',lock:true , ok: '确定'});
            return false;
        }
        if(!$("#moduleImg").val() || $("#moduleImg").val() == '') {
            parent.$.dialog({title: '提示', content: "上传模块样图", icon: 'alert.gif',lock:true , ok: '确定'});
            return false;
        }
        if(!$("#higherLevelNum").val() || $("#higherLevelNum").val() == '') {
            parent.$.dialog({title: '提示', content: "请填写分类限制数量", icon: 'alert.gif',lock:true , ok: '确定'});
            return false;
        }
        if(!$("#lowerLevelNum").val() || $("#lowerLevelNum").val() == '') {
            parent.$.dialog({title: '提示', content: "请填写分类下级限制数量", icon: 'alert.gif',lock:true , ok: '确定'});
            return false;
        }
        if(!$("#lowerLevelNum").val() || $("#lowerLevelNum").val() == '') {
            parent.$.dialog({title: '提示', content: "请填写分类下级限制数量", icon: 'alert.gif',lock:true , ok: '确定'});
            return false;
        }
       /* if($('#type').val() == 1 && ($("#contentType").val() && $("#contentType").val().length > 10)) {
            parent.$.dialog({title: '提示', content: "请填写主题", icon: 'alert.gif',lock:true , ok: '确定'});
            return false;
        }
        if($('#type').val() == 2 && (!$("#redirectUrl").val() || $("#redirectUrl").val() == '')) {
            parent.$.dialog({title: '提示', content: "请填写接口", icon: 'alert.gif',lock:true , ok: '确定'});
            return false;
        }
        if(!$("#screenNum").val() || $("#screenNum").val() == '') {
            parent.$.dialog({title: '提示', content: "请填写第几屏", icon: 'alert.gif',lock:true , ok: '确定'});
            return false;
        }*/

        $.post(saveTemplateModuleUrl, $('#form').serialize(), function(result){
            if(result.code == '000000') {
                parent.$.dialog({title: '提示', content: "操作成功", icon: 'success.gif',lock:true , ok: '确定'});
                parent.frontTemplateFacade.manageModuleDialog.content.frontTemplateModuleFacade.query();
                dialog.close();
            }else {
                console.error(result.message);
                parent.$.dialog({title: '提示', content: "操作失败", icon: 'error.gif',lock:true , ok: '确定'});
            }
        },'json');

    });
});