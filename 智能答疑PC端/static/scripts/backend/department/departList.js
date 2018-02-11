/**
 * Created by luqq on 16/4/10.
 */
var departFacade = {
    detailsGrid: null, // 数据详情
    url : '/department/getDepartList',
    query : function() {
        var queryString = departFacade.getParams();
        if(!queryString) {
            return false;
        }
        $('#data-list').show();
        // 加载详情
        departFacade.loadDetails(queryString);
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
                url : departFacade.url+'?'+params,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : departFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID', '院系名称','排序', '修改时间', '修改人','操作'],
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
                    name : 'name',
                    width : 200
                }, {
                    name : 'sortNum',
                    width : 200
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
                        retVal += '<button class="btn btn-xs btn-info" onclick="showCommonEditDialog(\'/department/toEdit?id='+rowObject.id+'\',\'编辑院系\',825,580);"> ' +
                            '<i class="ace-icon fa fa-pencil bigger-120"></i>编辑</button>' +
                            '<button class="btn btn-xs btn-info" onclick="$.showCommonEditDialog(\'/department/toMajorList?id='+rowObject.id+'\',\'院系专业信息\',600,400);"> ' +
                        '<i class="ace-icon fa fa-list bigger-120"></i>查看专业</button>' +
                            '<button class="btn btn-xs btn-danger" onclick="deleteDepartment('+rowObject.id+')"> <i class="ace-icon fa fa-trash-o bigger-120"></i> </button> </div>';
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
    }
}

function deleteDepartment(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/department/delete",
                data: "id="+id
            }).done(function (data) {
                if (data.retCode == 0) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    departFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.message, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}

function addDepartment(){
	showCommonEditDialog("/department/toEdit","新增院系",825,580);
}
var editDialog;
function showCommonEditDialog(url, title, width, height){
    editDialog = $.dialog({
        id : 'editDept',
        lock: true,
        title : title,
        content : "url:"+url,
        width: width,
        height: height,
        drag: true,
        resize: true,
        icon: 'alert.gif'
    });
}
$(function() {
    departFacade.query();
    $("#searchBtn").click(departFacade.query);

    $("#addBtn").click(function(){
        addDepartment();
    });
});