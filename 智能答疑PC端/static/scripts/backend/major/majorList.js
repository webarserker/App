/**
 * Created by luqq on 16/4/10.
 */
var majorFacade = {
    detailsGrid: null, // 数据详情
    url : '/major/getMajorList',
    uploadUrl : '/major/uploadPage',
    deleteUrl : '/major/deleteMajorByIds',
    query : function() {
        var queryString = majorFacade.getParams();
        if(!queryString) {
            return false;
        }
        $('#data-list').show();
        // 加载详情
        majorFacade.loadDetails(queryString);
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
                url : majorFacade.url+'?'+params,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : majorFacade.url+'?'+params,
                datatype : 'json',
                multiselect:true,
                colNames : ['ID', '专业名称', '所属院系', '学制' , '授予学位', '学费标准','排序','修改时间', '修改人','操作'],
                jsonReader : {
                    root: "data",
                    page: "curPage",
                    total: "totalPage",
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'id',
                    align :'center',
                    width : 50
                }, {
                    name : 'name'
                },{
                    name : 'departName'
                }, {
                    name : 'schoolYear',
                    align :'center'
                }, {
                    name : 'degree',
                    align :'center'
                },{
                    name : 'tuitionStandard',
                    align :'center'
                },{
                    name : 'sortNum',
                    align :'center'
                }, {
                    name : 'modifyTime',
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(cellvalue,"yyyy-MM-dd hh:mm:ss")
                    },
                    align:'center'
                }, {
                    name : 'modifier',
                    align :'center'
                }, {
                    name : "id",
                    align :'center',
                    width :150,
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = '<div class="hidden-sm hidden-xs btn-group">';
                        retVal += '<button class="btn btn-xs btn-info" onclick="$.showCommonEditDialog(\'/major/toEdit?id='+rowObject.id+'\',\'编辑专业\',950,630);"> ' +
                            '<i class="ace-icon fa fa-pencil bigger-120"></i> </button>' +
                            '<button class="btn btn-xs btn-danger" onclick="majorFacade.deleteMajor('+rowObject.id+')"> <i class="ace-icon fa fa-trash-o bigger-120"></i> </button> </div>';
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

    deleteMajor : function(id){
        bootbox.confirm("您确定删除该记录?", function(result) {
            if(result) {
                $.ajax({
                    type: "POST",
                    url: "/major/delete",
                    data: "id="+id
                }).done(function (data) {
                    if (data.retCode == 0) {
                        $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                        majorFacade.query();
                    } else {
                        $.dialog({title: '提示', content: data.message, icon: 'error.gif',lock:true, ok: '确定'});
                    }
                }).always(function () {
                    //$("#submitBtn").removeClass("disabled");
                });
            }
        });
    },

    addMajor : function(){
        $.showCommonEditDialog("/major/toEdit","新增专业",900,630);
    },

    openImport: function() {
        bootbox.confirm("导入专业前请确认是否已在“院系信息管理”中编辑好院系信息!", function(result) {
            if(result) {
                $.showCommonEditDialog(majorFacade.uploadUrl, '上传专业信息', 400, 200);
            }
        });
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
                $.post(majorFacade.deleteUrl, idsParam, function(data){
                    if(data.success) {
                        $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                        majorFacade.query();
                    }else {
                        $.dialog({title: '提示', content: data.msg, icon: 'error.gif',lock:true, ok: '确定'});
                    }
                }, 'json');
            }
        });
    },
}

$(function() {
    majorFacade.query();
    $("#searchBtn").click(majorFacade.query);

    $("#addBtn").click(function(){
        majorFacade.addMajor();
    });
    $("#importBtn").click(function(){
        majorFacade.openImport();
    });
    $("#batchDeleteBtn").click(function(){
        majorFacade.deleteRows();
    });
});