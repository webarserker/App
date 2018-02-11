//1:保存草稿；2：待审核；3:通过；4:驳回

var workbenchFacade = {
    detailsGrid: null, // 数据详情
    url : '/backend/index/querySummary',
    message_url : '/backend/index/queryMessage',
    read_url : '/backend/index/readMessage',
    query : function() {
        $.post(workbenchFacade.url, {}, function(data){
        	$(".sum_num").html('0');
        	if(data && data.summary && data.summary.length > 0) {
        		$(data.summary).each(function() {
        			$("#status_"+this.status).html(this.num);
        			if(this.num > 0) {
        				$("#status_"+this.status).parent().find('.verifyBtn').html('去查看');
        			}
        		});
        	}
        }, 'json');
    },
    loadMessage : function() {
	    var _this = this;
	    var grid_selector = "#table-data-list-message";
	    var pager_selector = "#table-data-list-message-pager";
	    if(_this.detailsGrid) {
	        // 根据搜索条件，重新加载
	        $(grid_selector).jqGrid('setGridParam',{
	            url : workbenchFacade.message_url,
	            page:1 
	        }).trigger("reloadGrid");
	    } else {
	        // 首次加载
	        _this.detailsGrid = $(grid_selector).jqGrid({
	            url : workbenchFacade.message_url,
	            datatype : 'json',
	            colNames : ['标题', '内容', '状态', '创建时间', '创建人', '操作'],
	            jsonReader : {  
	                root: "data",  
	                page: "curPage",  
	                total: "totalPage",  
	                records: "totalRows"
	            },
	            prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
	            cmTemplate: {sortable:true},
	            colModel : [ 
	            {
//	                name : 'bizType',
//	                align :'center',
//	                width : 120
//	            }, {
	                name : 'title',
	                align:'left',
	                width : '20%',
	                formatter : function(value, options, rowObject) {
	                    return value.length > 12 ? (value.substr(0, 12) + '...') : value;
	                }
	            }, {
	                name : 'content',
	                width : '30%',
	                align:'left',
	                formatter : function(value, options, rowObject) {
	                    return value.length > 45 ? (value.substr(0, 45) + '...') : value;
	                }
	            }, {
	                name : 'isRead',
	                width : '10%',
	                align:'center',
	                formatter : function(value, options, rowObject) {
	                    return value == 0 ? "<font color='red'>未读</font>" : "已读";
	                }
	            }, {
	                name : 'createTime',
	                align:'center',
	                width : '20%',
	                formatter : function(cellvalue, options, rowObject) {
	                    return $.dateFormat(cellvalue, 'yyyy-MM-dd hh:mm:ss');
	                }
	            }, {
	                name : 'creator',
	                align:'center',
	                width : '10%'
	            }, {
	                name : '',
	                align:'center',
	                width : '10%',
	                formatter : function(cellvalue, options, rowObject) {
	                    return '<div class="btn btn-xs btn-default" onclick="workbenchFacade.viewMessage('+rowObject.id+',\''+rowObject.content+'\','+rowObject.isRead+')">查看</div>';
	                }
	            }],
	            rowNum : 30,
	            rowList : [ 10, 30, 50 ],
	            pager : pager_selector,
	            pagerpos : 'left',
	            viewrecords : true,
	            height : 'auto',
                autowidth:true,
	            loadComplete : function() {
	                var table = this;
	                setTimeout(function() {
	                    updatePagerIcons(table);
	            	    // 自适应宽度
	            	    $.resizeGrid(grid_selector);
	                }, 0);
	            }
	        });
	    }
	    // 自适应宽度
	    $.resizeGrid(grid_selector);
    },
    viewMessage : function(id, content, isRead) {
        $.dialog(
        		{	title : '查看消息',
        			'content' : content,
        			width : 400,
        			height : 200,
        			button : {
        				name : '关闭'
        			}
        	});
        if(isRead == 0) {
        	$.post(workbenchFacade.read_url, {'id' : id}, function(data){
        		if(data) {
        			workbenchFacade.loadMessage();
        		}
        	}, 'json');
        }
    }
}

$(function() {
	workbenchFacade.query();
	workbenchFacade.loadMessage();
	$(".messageList").click(function() {
		$("#messageList").addClass("active");
        // 自适应宽度
        $.resizeGrid("#table-data-list-message");
	});
    $("#searchBtn").click(workbenchFacade.query);
    $("#contentType").change(workbenchFacade.getInfoCat);
});

/**
 * 在线答疑开关
 * @param isHandling
 */
function onlineSwitch(){
	var switchHandling = 1 - $('#onlineswitch').attr("key");
	$.post("/backend/index/onlineSwitch", {"handling":switchHandling}, function(data){
    	if(data){
    		if(switchHandling == 1){
                $('#onlineswitch').html("关闭");
			}else{
                $('#onlineswitch').html("打开");
			}
            $('#onlineswitch').attr("key", switchHandling);
    	}else{
    		alert("处理失败，请稍后重试！");
    	}
    }, 'json');
}