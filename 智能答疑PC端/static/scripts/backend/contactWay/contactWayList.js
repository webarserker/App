/**
 * Created by luqq on 16/4/10.
 */
var contactWayFacade = {
    detailsGrid: null, // 数据详情
    url : '/contactWay/getContactWayList',
    query : function() {
        var queryString = '';
        /*if(!queryString) {
            return false;
        }*/
        $('#data-list').show();
        // 加载详情
        contactWayFacade.loadDetails(queryString);
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
                url : contactWayFacade.url+'?'+params,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : contactWayFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID', '名称', '显示', '联系方式', '修改时间', '修改人','操作'],
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
                    name : 'contactTypeStr',
                    width : 200
                }, {
                    name : 'isShow',
                    formatter : function(cellvalue, options, rowObject) {
                        var isShow = '';
                        if(cellvalue == 1){
                            isShow = '是';
                        }else if(cellvalue == 0){
                            isShow = '否';
                        }
                        return isShow;
                    },
                    align :'center',
                    width : 200
                }, {
                    name : 'contact',
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
                        retVal += '<button class="btn btn-xs btn-info" onclick="$.showCommonEditDialog(\'/contactWay/toEdit?id='+rowObject.id+'\',\'编辑联系方式\',600,300);"> ' +
                            '<i class="ace-icon fa fa-pencil bigger-120"></i> </button>' +
                            '<button class="btn btn-xs btn-danger" onclick="deleteContactWay('+rowObject.id+')"> <i class="ace-icon fa fa-trash-o bigger-120"></i> </button> </div>';
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

function deleteContactWay(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/contactWay/delete",
                data: "id="+id
            }).done(function (data) {
                if (data.retCode == 0) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    contactWayFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.message, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}

function addContactWay(){
    $.showCommonEditDialog("/contactWay/toEdit","新增联系方式",600,300);
}

$(function() {
    contactWayFacade.query();
    $("#searchBtn").click(contactWayFacade.query);

    $("#addBtn").click(function(){
        addContactWay();
    });
});