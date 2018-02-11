$(function(){
    var saveTemplateUrl = '/frontTemplate/saveColor';
    $("#colorValue").change(function() {
        $("#colorIpt").css('background-color', '#'+$('#colorValue').val());
    });
    $("#cancelBtn").click(function(){
        dialog.close();
    });
    $("#colorHexRgb").blur(function(){
    	var selColor = $(this).val();
    	if(!selColor){
    		parent.$.dialog({title: '提示', content: "请填写颜色值", icon: 'alert.gif',lock:true , ok: '确定'});
    		$("#spColor").css('background-color',"#DDD");
    		return false;	
    	}else if(!CheckIsColor(selColor)){
    		parent.$.dialog({title: '提示', content: "颜色值格式为‘1D3F4A’或‘1D3’", icon: 'alert.gif',lock:true , ok: '确定'});
    		return false;
    	}
    	$("#spColor").css('background-color',"#"+selColor);
    });
    $("#saveBtn").click(function(){
        //参数校验
        if(!$("#colorName").val() || $("#colorName").val() == '') {
            parent.$.dialog({title: '提示', content: "请填写颜色名称", icon: 'alert.gif',lock:true , ok: '确定'});
            return false;
        }
        if($("#colorName").val() && $("#colorName").val().length > 10) {
            parent.$.dialog({title: '提示', content: "颜色名称不能超过10个字", icon: 'alert.gif',lock:true , ok: '确定'});
            return false;
        }
        if(!$("#colorValue").val() || $("#colorValue").val() == '') {
            parent.$.dialog({title: '提示', content: "请填写class值", icon: 'alert.gif',lock:true , ok: '确定'});
            return false;
        }
        if(!$("#colorHexRgb").val() || $("#colorHexRgb").val() == '') {
            parent.$.dialog({title: '提示', content: "请填写颜色值", icon: 'alert.gif',lock:true , ok: '确定'});
            return false;
        }else if(!CheckIsColor($("#colorHexRgb").val())){
        	parent.$.dialog({title: '提示', content: "颜色值格式为‘1D3F4A’或‘1D3’", icon: 'alert.gif',lock:true , ok: '确定'});
    		return false;
        }
        // if($("#colorValue").val().length != 3 && $("#colorValue").val().length != 6) {
        //     parent.$.dialog({title: '提示', content: "颜色值格式为‘1D3F4A’或‘6FD’", icon: 'alert.gif',lock:true , ok: '确定'});
        //     return false;
        // }

        $.post(saveTemplateUrl, $('#form').serialize(), function(result){
            if(result.code == '000000') {
                parent.$.dialog({title: '提示', content: "操作成功", icon: 'success.gif',lock:true , ok: '确定'});
                parent.frontTemplateFacade.manageColorDialog.content.frontTemplateColorFacade.query();
                dialog.close();
            }else {
                console.error(result.message);
                parent.$.dialog({title: '提示', content: "操作失败", icon: 'error.gif',lock:true , ok: '确定'});
            }
        },'json');

    });
});
//验证颜色值
function CheckIsColor(colorValue) {  
	var type ="^([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$";  
    var re = new RegExp(type);  
    if (colorValue.match(re) == null)return false;
    return true;
} 