/**
 * Created by luqq on 16/4/10.
 */
var preTalkFacade = {
    detailsGrid: null, // 数据详情
    url : '/preTalk/getPreTalkList',
    uploadUrl : '/preTalk/uploadPage',
    query : function() {
        var queryString = preTalkFacade.getParams();
        if(!queryString) {
            return false;
        }
        $('#data-list').show();
        // 加载详情
        preTalkFacade.loadDetails(queryString);
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
                url : preTalkFacade.url+'?'+params,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : preTalkFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID', '预置话术关键字', '修改时间', '修改人','操作'],
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
                    name : 'talkKey',
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
                        retVal += '<button class="btn btn-xs btn-info" onclick="$.showCommonEditDialog(\'/preTalk/toEdit?id='+rowObject.id+'\',\'编辑预置话术\',800,500);"> ' +
                            '<i class="ace-icon fa fa-pencil bigger-120"></i>编辑</button>' +
                            '<button class="btn btn-xs btn-danger" onclick="deletePreTalk('+rowObject.id+')"> <i class="ace-icon fa fa-trash-o bigger-120"></i> </button> </div>';
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

    openImport: function() {
        $.showCommonEditDialog(preTalkFacade.uploadUrl, '上传预置话术信息', 400, 200);
    },

    /**
     * 物料批量导出
     */
    export : function () {
        var url = '/preTalk/export?'
            + $("form").serialize();
        if ($("#downloadIfm").attr('src')) {
            $("#downloadIfm").attr('src', '');
        }
        $("#downloadIfm").attr('src', url);
    }
}

function deletePreTalk(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/preTalk/delete",
                data: "id="+id
            }).done(function (data) {
                if (data.retCode == 0) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    preTalkFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.message, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}

function addPreTalk(){
    $.showCommonEditDialog("/preTalk/toEdit","新增预置话术",800,500);
}

$(function() {
    preTalkFacade.query();
    $("#searchBtn").click(preTalkFacade.query);

    $("#addBtn").click(function(){
        addPreTalk();
    });
    $("#importBtn").click(function(){
        preTalkFacade.openImport();
    });
    $("#exportBtn").click(function(){
        preTalkFacade.export();
    });
});