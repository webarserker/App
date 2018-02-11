define(['selfService'], function() {
	return {
		getSelfServiceTypes : function(){
			var params = {};
			params['sCode'] = $('#sCode').val();
			params['contentType'] = 1;
			params['pageSize'] = 8;
			$.ajax({
				type:"POST",
                url: '/front/getSelfServiceTypes',
                data: params,
                dataType: "json",
                success: function(data){
                	var _html = '';
            		if(data){
            			var parent = data.parent;
            			if(parent){
            				var con = parent.icon;
            				if(con !=null && con != ''){
            					$("#self").addClass(con);
            				}else{
            					$("#self").addClass("icon-dangan");
            				}
            				if(parent.name){
            					$("#self-span-txt").html(parent.name);
            				}
            			}
            			var subCat = data.subCat;
            			if(subCat && subCat.length > 0){
            				var selfServiceTypes = subCat;
                			for(var key in selfServiceTypes){
    							var selfServiceType = selfServiceTypes[key];
    							var icon = selfServiceType.icon;
    							var imgUrl = selfServiceType.imgUrl;
    							if(imgUrl != null && imgUrl != ''){
    								_html += '<li><a href="javascript:toSelfServiceList(\''+ selfServiceType.id +'\');"><img src="'+ imgUrl +'" class="iconImg" /></a><a href="javascript:toSelfServiceList(\''+ selfServiceType.id +'\');">'+ selfServiceType.name +'</a></li>';
    							}else if(icon != null && icon != ''){
    								_html += '<li><a href="javascript:toSelfServiceList(\''+ selfServiceType.id +'\');"><span class="iconfont w3-text-theme '+ icon +'"></span></a><a href="javascript:toSelfServiceList(\''+ selfServiceType.id +'\');">'+ selfServiceType.name +'</a></li>';
    							}else{
    								_html += '<li><a href="javascript:toSelfServiceList(\''+ selfServiceType.id +'\');"><span class="iconfont w3-text-theme icon-11"></span></a><a href="javascript:toSelfServiceList(\''+ selfServiceType.id +'\');">'+ selfServiceType.name +'</a></li>';
    							}
                			}
            			}
            		}
                    $('#selfServices').find('ul').html(_html);
                },
                error: function(data){
                    //alert("服务器发生错误");
                }
            });
		}
	}
	
});

function toSelfServiceList(categoryId){
	var sCode = $('#sCode').val();
	window.location.href = contextPath + "/front/info/route/2/"+categoryId;
}
