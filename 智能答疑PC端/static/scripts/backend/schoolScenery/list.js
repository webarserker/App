var schoolSceneryFacade = {
    detailsGrid: null, // 数据详情
    url : '/schoolScenery/queryList',
    query : function() {
        var queryString = schoolSceneryFacade.getParams();
        if(!queryString) {
        	return false;
        }
        // 加载详情
        schoolSceneryFacade.loadDetails(queryString);
    },
    getParams : function() {
        return $("form").serialize();
    },
    // 加载数据详情
    loadDetails : function(params) {
    	var params = {};
		params['sCode'] = $('#sCode').val();
		params['contentType'] = 1;
		$.ajax({
			type:"POST",
            url: '/schoolScenery/queryList',
            data: params,
            dataType: "json",
            success: function(data){
            	var _html = '';
            	if(data && data.success){
            		if(data.data && data.data.length > 0){
            			var schoolScenerys = data.data;
            			for(var key in schoolScenerys){
            				if(schoolScenerys[key].imgUrl){
            					_html += '<li>';
            					_html += '<a href="'+$("#imgServer").val() + schoolScenerys[key].imgUrl+'" data-rel="colorbox" class="cboxElement">';
            					_html += '<img width="150" height="150" alt="'+ schoolScenerys[key].title +'" src="'+$("#imgServer").val() + schoolScenerys[key].imgUrl+'">';
            					_html += '<div class="text">';
            					_html += '<div class="inner">'+ schoolScenerys[key].title +'</div>';
            					_html += '</div>';
            					_html += '</a>';
            					_html += '<div class="tools tools-bottom">';
            					_html += '<a href="javascript:editSchoolScenery(\''+ schoolScenerys[key].id +'\')">';
            					_html += '<i class="ace-icon fa fa-pencil" id="iEdit"></i>';
            					_html += '<a href="javascript:deleteSchoolScenery(\''+ schoolScenerys[key].id +'\')">';
            					_html += '<i class="ace-icon fa fa-times red" id="iDelete"></i>';
            					_html += '</a>';
            					_html += '</div>';
            					_html += '</li>';
            				}
            			}
            		}
            	}
            	
                $('#school_img_box').html(_html);
            },
            error: function(e){
                debugger;
                alert("服务器发生错误");
            }
        });
    }
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
                    schoolSceneryFacade.query();
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
    $("#searchBtn").click(schoolSceneryFacade.query);
    $('#searchBtn').click();
});