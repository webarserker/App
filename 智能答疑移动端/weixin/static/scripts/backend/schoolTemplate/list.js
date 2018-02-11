var schoolTemplateFacade = {
    detailsGrid: null, // 数据详情
    url : '/schoolScenery/queryList',
    query : function() {
        var queryString = schoolTemplateFacade.getParams();
        if(!queryString) {
        	return false;
        }
        // 加载详情
        schoolTemplateFacade.loadDetails(queryString);
    },
    getParams : function() {
        return $("form").serialize();
    },
    // 加载数据详情
    loadDetails : function(params) {
		$.ajax({
			type:"POST",
            url: '/schoolTemplate/manage/queryList',
            data: params,
            dataType: "json",
            success: function(data){
            	var _html = '';
            	if(data && data.success){
            		if(data.data && data.data.length > 0){
            			var template = data.data;
            			for(var i=0;i< template.length;i++){
            				if(template[i].templateImg){
            					var flag=template[i].isInuse == 1;
            					var curr = flag?'当前使用模板：':'';
            					var d = template[i].templateId == 1 ;
            					var cstyle=flag?'btn-success li-shadow':'none';
            					_html += '<li class="g-box-shadow '+cstyle+'">';
            					_html += '<a style="width:356px;height:406px"  rel="prettyPhoto[]">';
            					_html += '<img  alt="'+ template[i].templateName +'" src="'+$("#imgServer").val() + template[i].templateImg+'?x-oss-process=image/resize,w_400">';
            					_html += '</a>';
            					_html += '<p class="g-mtb-15">'+ curr+template[i].templateName+"</p>";
                                _html += '<button style="float:right;padding:3px;" id="changeColor" class="btn-warning" type="button" onclick="changeColor('+template[i].id+','+template[i].templateId+',' + flag + ')">切换颜色</button>';
            					_html += '<button onclick="updateTemplateId('+template[i].id+','+template[i].templateId+',' + flag + ')" class="btn-primary" style="float:right;padding:3px;" type="button">' + (flag ? '切换模板' : '使用模板')+ ' </button>';
            					if(!d){
                                    _html += '<button style="float:right;padding:3px;"  id="cancelBtn" class="btn-warning" type="button"  onclick="toTemplateSketch(' + template[i].templateId + ')">内容维护</button>';
                                }
            					_html += '</li>';
            				}
            			}
            		}
            	}

                $('#school_img_box').html(_html);
              //  $(".sub-photo a[rel^='prettyPhoto']").prettyPhoto({ animation_speed: 'fast', slideshow: 5000, hideflash: true });
            },
            error: function(e){
                debugger;
                alert("服务器发生错误");
            }
        });
    }
}
//进入模板编辑页面
function toTemplateSketch(templateId){
	$.get("/schoolTemplate/manage/checkTemplateSketch",{templateId:templateId},function(data){
		  if (data&&data.code=='000000') {
			  parent.window.toPage("/schoolTemplate/manage/toTemplateSketch?templateId="+templateId,'模板内容维护',templateId);
		  } else {
              $.dialog({title: '提示', content: data.message, icon: 'error.gif',lock:true, ok: '确定'});
          }
	})
	
}
//切换颜色
function changeColor(id,templateId){
    if(!id){
        $.dialog({title: '提示', content: "切换模板颜色需要维护模板内容", icon: 'error.gif',lock:true ,ok: '确定'});
        return ;
    }
    bootbox.confirm("您确定切换模板颜色吗？",function(){
        $.dialog({
            id : 'editTemplateColor',
            lock: true,
            title : "切换模板颜色",
            content : "url:/schoolTemplate/manage/toTemplateColor?id="+id+"&templateId="+templateId,
            width: 300,
            height: 300,
            drag: true,
            resize: true
        });
    })
}
//切换模板
function updateTemplateId(id,templateId,flag){
	if(flag){
	 $("li[class*=none]").removeClass("none");	return ;
	}
	if(!id){
        $.dialog({title: '提示', content: "切换模板需要维护模板内容", icon: 'error.gif',lock:true ,ok: '确定'});
        return ;
    }
    bootbox.confirm("您确定切换该模板?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/schoolTemplate/manage/updateTemplateId",
                data: {id:id,templateId:templateId}
            }).done(function (data) {
                if (data&&data.code=='000000') {
                    $.dialog({title: '提示', content: "切换成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    schoolTemplateFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.message, icon: 'error.gif',lock:true, ok: '确定'});
                }
                
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}
function deleteSchoolScenery(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/schoolScenery/delete",
                data: "id="+id
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    schoolTemplateFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}
function editSchoolScenery(id){
    $.showCommonEditDialog("/schoolScenery/addOrUpdate?id="+id,"新增",600,300);
}
$(function() {
    $("#searchBtn").click(schoolTemplateFacade.query);
    $('#searchBtn').click();
});