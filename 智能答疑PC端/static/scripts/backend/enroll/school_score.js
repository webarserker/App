var enrollSchoolFacade = {
    detailsGrid: null, // 数据详情
    url : '/enroll/findSchoolPage',
    editUrl : '/enroll/updateSchoolPage',
    deleteUrl : '/enroll/deleteSchoolScoreByIds',
    uploadUrl : '/enroll/uploadProScorePage',
    uploadSchoolUrl : '/enroll/uploadSchoolScorePage',
    query : function() {
        var queryString = enrollSchoolFacade.getParams();
        if(!queryString) {
        	return false;
        }
        // 加载详情
        enrollSchoolFacade.loadDetails(queryString);
    },
    getParams : function() {
        return $("form").serialize();
    },
    // 加载数据详情
    loadDetails : function(params) {
        var _this = this;
        var grid_selector = "#table-data-list";
        var pager_selector = "#table-data-list-pager";
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : enrollSchoolFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : enrollSchoolFacade.url+'?'+params,
                datatype : 'json',
                multiselect:true,
                colNames : ['招生类型', '生源地', '科类', '年度','批次','计划招生','省线','最高分','最低分','平均分','操作'],
                jsonReader : {  
                    root: "data",  
                    page: "curPage",  
                    total: "totalPage",  
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'type',
                    align :'center',
                    width : 120
                }, {
                    name : 'cityName',
                    width : 120
                }, {
                    name : 'scienceClass',
                    width : 100
                }, {
                    name : 'year',
                    align:'right'
                }, {
                    name : 'batch',
                    align:'right'
                }, {
                    name : 'enrollNum',
                    align:'right'
                }, {
                    name : 'score',
                    align:'right',
                    width : 60
                }, {
                    name : 'hightScore',
                    align:'right',
                    formatter : function(value, row, options) {
                    	return parseInt(value);
                    }
                }, {
                    name : 'lowScore',
                    align:'right',
                    formatter : function(value, row, options) {
                    	return parseInt(value);
                    }
                }, {
                    name : 'avgScore',
                    align:'right',
                    formatter : function(value, row, options) {
                    	return parseInt(value);
                    }
                }, {
                    name : 'id',
                    align:'center',
                    formatter : function(value, row, options) {
                    	return '<a class="btn btn-default btn-xs" href="javascript:enrollSchoolFacade.editRow('+value+')">编辑</a>';
                    }
                }],
                rowNum : 30,
                rowList : [ 10, 30, 50 ],
                pager : pager_selector,
                pagerpos : 'left',
                viewrecords : true,
                height : 'auto',
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                    }, 0);
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    },
    deleteRows : function() {
    	var rowData = jQuery('#table-data-list').jqGrid('getGridParam','selarrrow');
    	if(!rowData || rowData.length == 0) {
            $.dialog({title: '提示', content: '请选择要删除的行', icon: 'error.gif',lock:true, ok: '确定'});
            return false;
    	}
        bootbox.confirm("您确定删除该记录?", function(result) {
            if(result) {
            	var idsParam = {};
            	for(var i = 0; i < rowData.length; i++) {
            		idsParam['ids[' + i + ']'] = rowData[i];
            	}
            	$.post(enrollSchoolFacade.deleteUrl, idsParam, function(data){
            		if(data.success) {
            			$.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
            			enrollSchoolFacade.query();
            		}else {
            			$.dialog({title: '提示', content: data.msg, icon: 'error.gif',lock:true, ok: '确定'});
            		}
            	}, 'json');
            }
        });
    },
    editRow : function(id) {
    	$.showCommonEditDialog(enrollSchoolFacade.editUrl+"?id="+id, '编辑', 420, 440);
    },
    add : function() {
    	$.showCommonEditDialog(enrollSchoolFacade.editUrl, '新增', 420, 530);
    },
    importSchoolScore : function() {
    	$.showCommonEditDialog(enrollSchoolFacade.uploadSchoolUrl, '上传学校录取数据', 400, 300);
    },
    importProScore : function() {
    	$.showCommonEditDialog(enrollSchoolFacade.uploadUrl, '上传省线数据', 400, 200);
    }
}

$(function() {
    enrollSchoolFacade.query();
    $("#searchBtn").click(enrollSchoolFacade.query);
    $("#addBtn").click(enrollSchoolFacade.add);
    $("#importSchoolBtn").click(enrollSchoolFacade.importSchoolScore);
    $("#importBtn").click(enrollSchoolFacade.importProScore);
    $("#batchDeleteBtn").click(enrollSchoolFacade.deleteRows);
});