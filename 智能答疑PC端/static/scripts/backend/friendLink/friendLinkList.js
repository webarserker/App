/**
 * Created by dev on 17/3/14.
 */
var departFacade = {
    detailsGrid: null, // 数据详情
    url : '/friendLink/getfriendLinkList',
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
                colNames : ['ID', '链接名称', '链接地址','排序','是否显示','修改时间', '修改人','操作'],
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
                    name : 'link',
                    width : 150
                }, {
                    name : 'linkSort',
                    width : 50
                },{
                    name : 'isShow',
                    width : 50,
                    formatter : function(cellvalue, options, rowObject) {
                        return cellvalue == 0 ? '显示' : '隐藏';
                    }
                },{
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
                        retVal += '<button class="btn btn-xs btn-info" onclick="$.showCommonEditDialog(\'/friendLink/toEdit?id='+rowObject.id+'\',\'编辑友情链接\',600,300);"> ' +
                            '<i class="ace-icon fa fa-pencil bigger-120"></i>编辑</button>' +
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
                url: "/friendLink/delete",
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
    $.showCommonEditDialog("/friendLink/toEdit","友情链接新增",600,300);
}

$(function() {
    departFacade.query();
    $("#searchBtn").click(departFacade.query);

    $("#addBtn").click(function(){
        addDepartment();
    });
});