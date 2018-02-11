var schoolVidoFacade = {
    detailsGrid: null, // 数据详情
    url : '/schoolVido/queryList',
    query : function() {
        var queryString = schoolVidoFacade.getParams();
        if(!queryString) {
        	return false;
        }
        // 加载详情
        schoolVidoFacade.loadDetails(queryString);
    },
    getParams : function() {
        return $("form").serialize();
    },
    // 加载数据详情
    loadDetails : function(params) {
		params['sCode'] = $('#sCode').val();
		params['contentType'] = 1;
		$.ajax({
			type:"POST",
            url: '/schoolVido/queryList',
            data: params,
            dataType: "json",
            success: function(data){
            	var _html = '';
            	if(data && data.success){
            		if(data.data && data.data.length > 0){
            			var schoolScenerys = data.data;
            			for(var key = 0; key < schoolScenerys.length; key++){
            				_html += '<li>';
            				_html += '<span>'+schoolScenerys[key].title+'</span>';
            				_html += '<a target="_blank" href="'+$("#imgServer").val() + schoolScenerys[key].vidoUrl+'" data-rel="colorbox" class="cboxElement">';
            				_html += '<img width="150" height="150" alt="'+ schoolScenerys[key].title +'" src="'+$("#imgServer").val() + schoolScenerys[key].imgUrl+'">';
            				_html += '<div class="text">';
            				var desc = '';
            				if(schoolScenerys[key].desc) {
            				    desc = schoolScenerys[key].desc.substring(0,schoolScenerys[key].desc.length > 10 ? 10 : schoolScenerys[key].desc.length);
                            }
            				_html += '<div class="inner">'+ desc +'...</div>';
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
                url: "/schoolVido/delete",
                data: "id="+id
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    schoolVidoFacade.query();
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
    $.showCommonEditDialog("/schoolVido/addOrUpdate?id="+id,"新增",600,450);
}
$(function() {
    $("#searchBtn").click(schoolVidoFacade.query);
    $('#searchBtn').click();
});