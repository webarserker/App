/**
 * Created by luqq on 16/08/01.
 */
var userViewSourceConfigFacade = {
    detailsGrid: null, // 数据详情
    url : '/userViewSourceConfig/findPage',
    query : function() {
        var queryString = userViewSourceConfigFacade.getParams();
        if(!queryString) {
            return false;
        }
        // 加载详情
        userViewSourceConfigFacade.loadDetails(queryString);
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
                url : userViewSourceConfigFacade.url+'?'+params,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : userViewSourceConfigFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID', '来源类型', '来源域名', '高校名称', '创建时间', '创建人','操作'],
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
                    name : 'sourceName',
                    width : 100
                }, {
                    name : 'sourceDomain',
                    width : 200
                }, {
                    name : 'schoolName',
                    align:'center',
                    width : 150
                }, {
                    name : 'createTime',
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(cellvalue,"yyyy-MM-dd hh:mm:ss")
                    },
                    align:'center'
                }, {
                    name : 'creator',
                    align :'center'
                }, {
                    name : "id",
                    align :'center',
                    width :100,
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = '<div class="hidden-sm hidden-xs btn-group">';
                        retVal += '<button class="btn btn-xs btn-info" onclick="$.showCommonEditDialog(\'/userViewSourceConfig/toEdit?id='+rowObject.id+'\',\'编辑\',500,250);"> ' +
                            '<i class="ace-icon fa fa-pencil bigger-120"></i> </button>' +
                            '<button class="btn btn-xs btn-danger" onclick="deleteSource('+rowObject.id+')"> <i class="ace-icon fa fa-trash-o bigger-120"></i> </button> </div>';
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

function deleteSource(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/userViewSourceConfig/delete",
                data: "id="+id
            }).done(function (data) {
                if (data.code == '000000') {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    userViewSourceConfigFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.message, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}

function addSource(){
    $.showCommonEditDialog("/userViewSourceConfig/toEdit","新增来源",500,250);
}

$(function() {
    userViewSourceConfigFacade.query();
    $("#searchBtn").click(userViewSourceConfigFacade.query);

    $("#addBtn").click(function(){
        addSource();
    });

    $('#sourceType').change(function () {
        if($(this).val() == '2'){
            $('#sCode').parent().show();
        }else{
            $('#sCode').parent().hide();
            $('#sCode').val('');
        }
    });
});