var enrollMajorFacade = {
    detailsGrid: null, // 数据详情
    url : '/enroll/findPage',
    uploadUrl : '/enroll/uploadPage?isNew=0',
    uploadNewUrl : '/enroll/uploadPage?isNew=1',
    deleteUrl : '/enroll/deleteByIds',
    editUrl : '/enroll/updatePage',
    query : function() {
        var queryString = enrollMajorFacade.getParams();
        if(!queryString) {
        	return false;
        }
        // 加载详情
        enrollMajorFacade.loadDetails(queryString);
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
                url : enrollMajorFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : enrollMajorFacade.url+'?'+params,
                datatype : 'json',
                multiselect:true,
                colNames : ['招生类型', '生源地', '科类', '专业', '年度','批次','计划招生','最高分','最低分','平均分','备注', '操作'],
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
                    width : 100
                }, {
                    name : 'cityName',
                    width : 100
                }, {
                    name : 'scienceClass',
                    width : 100
                }, {
                    name : 'majorName',
                    align:'right',
                    width : 160
                }, {
                    name : 'year',
                    align:'right',
                    width : 80
                }, {
                    name : 'batch',
                    align:'right',
                    width : 120
                }, {
                    name : 'enrollPlan',
                    align:'right',
                    width : 100
                }, {
                    name : 'hightScore',
                    align:'right',
                    formatter : function(value, row, options) {
                        return value ? parseInt(value) : '-';
                    }
                }, {
                    name : 'lowScore',
                    align:'right',
                    formatter : function(value, row, options) {
                        return value ? parseInt(value) : '-';
                    }
                }, {
                    name : 'avgScore',
                    align:'right',
                    formatter : function(value, row, options) {
                        return value ? parseInt(value) : '-';
                    }
                }, {
                    name : 'remark',
                }, {
                    name : 'id',
                    align:'center',
                    formatter : function(value, row, options) {
                    	return '<a class="btn btn-default btn-xs" href="javascript:enrollMajorFacade.editRow('+value+')">编辑</a>';
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
    openImport: function() {
        $.showCommonEditDialog(enrollMajorFacade.uploadUrl, '上传录取信息', 500, 340);
    },
    openNewImport: function() {
        $.showCommonEditDialog(enrollMajorFacade.uploadNewUrl, '上传录取信息', 500, 340);
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
            	$.post(enrollMajorFacade.deleteUrl, idsParam, function(data){
            		if(data.success) {
            			$.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
            			enrollMajorFacade.query();
            		}else {
            			$.dialog({title: '提示', content: data.msg, icon: 'error.gif',lock:true, ok: '确定'});
            		}
            	}, 'json');
            }
        });
    },
    editRow : function(id) {
    	$.showCommonEditDialog(enrollMajorFacade.editUrl+"?id="+id, '编辑', 420, 440);
    },
    add : function() {
    	$.showCommonEditDialog(enrollMajorFacade.editUrl, '新增', 420, 530);
    }
}

$(function() {
    enrollMajorFacade.query();
    $("#searchBtn").click(enrollMajorFacade.query);
    $("#addBtn").click(enrollMajorFacade.add);
    $("#importBtn").click(enrollMajorFacade.openImport);
    $("#importNewBtn").click(enrollMajorFacade.openNewImport);
    $("#batchDeleteBtn").click(enrollMajorFacade.deleteRows);
});