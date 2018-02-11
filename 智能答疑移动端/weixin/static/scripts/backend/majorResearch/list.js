var majorResearchFacade = {
    detailsGrid: null, // 数据详情
    url : '/majorResearch/findPage',
    uploadUrl : '/majorResearch/uploadPage',
    deleteUrl : '/majorResearch/deleteMajorByIds',
    query : function() {
        var queryString = majorResearchFacade.getParams();
        if(!queryString) {
        	return false;
        }
        $('#data-list').show();
        // 加载详情
        majorResearchFacade.loadDetails(queryString);
    },
    getParams : function() {
        return $("form").serialize();
    },
    openImport: function() {
        bootbox.confirm("导入前请确认是否已在“专业信息管理”中编辑相应的专业信息!", function(result) {
            if(result) {
                $.showCommonEditDialog(majorResearchFacade.uploadUrl, '上传', 400, 200);
            }
        });
    },
    // 加载数据详情
    loadDetails : function(params) {
        var _this = this;
        var grid_selector = "#table-data-list";
        var pager_selector = "#table-data-list-pager";
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : majorResearchFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : majorResearchFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['专业代码','专业名称','招生院系','研究方向' ,'指导教师' , '类别','操作'],
                jsonReader : {  
                    root: "data",  
                    page: "curPage",  
                    total: "totalPage",  
                    records: "totalRows"
                },
                multiselect:true,
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'majorCode',
                    align :'center',
                    width : 80
                }, {
                    name : 'majorName'
                },{
                    name : 'department'
                },{
                    name : 'name'
                },{
                    name : 'mentors'
                },{
                    name : 'type',
                    formatter : function(val, options, rowObject) {
                        if(val == 1) {
                            return "学术型"
                        }
                        if(val == 2) {
                            return "专业型";
                        }
                        return "";
                    }
                }, {
                    name : "id",
                    align :'left',
                    width : 100,
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = '<div class="hidden-sm hidden-xs btn-group">';
                                        retVal += '<button class="btn btn-xs btn-info" onclick="edit(\''+rowObject.id+'\')">修改 </button>' +
                                       '<button class="btn btn-xs btn-danger" onclick="deleteMajorResearch('+rowObject.id+')"> 删除 </button> '+
                                    '</div>';
                        return retVal;
                    }
                }],
                rowNum : 10,
                rowList : [ 10, 30, 50 ],
                pager : pager_selector,
                pagerpos : 'left',
                viewrecords : true,
                height : 'auto',
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.removeScrollX('#data-list');
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
                $.post(majorResearchFacade.deleteUrl, idsParam, function(data){
                    if(data.success) {
                        $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                        majorResearchFacade.query();
                    }else {
                        $.dialog({title: '提示', content: data.msg, icon: 'error.gif',lock:true, ok: '确定'});
                    }
                }, 'json');
            }
        });
    },
}
function edit(id){
	$.showCommonEditDialog("/majorResearch/toEdit?id=" + id,"编辑研究方向",900,630);
}
function deleteMajorResearch(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/majorResearch/delete",
                data: "id="+id
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    majorResearchFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}

function addSchool(){
    $.showCommonEditDialog("/majorResearch/toEdit","新增研究方向",900,630);
}

$(function() {
    majorResearchFacade.query();
    $("#searchBtn").click(majorResearchFacade.query);

    $("#addBtn").click(function(){
        addSchool()
    });
    $("#importBtn").click(function(){
        majorResearchFacade.openImport();
    });
    $("#batchDelete").click(function(){
        majorResearchFacade.deleteRows();
    });
});