var enrollRuleFacade = {
    detailsGrid: null, // 数据详情
    url : '/enrollPlan/findList',
    query : function() {
        var queryString = enrollRuleFacade.getParams();
        if(!queryString) {
            return false;
        }
        $('#data-list').show();
        // 加载详情
        enrollRuleFacade.loadDetails(queryString);
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
                url : enrollRuleFacade.url+'?'+params,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : enrollRuleFacade.url+'?'+params,
                datatype : 'json',
                colNames : [ '年度','招生类型', '生源地', '科类','招生批次','专业','计划招生数','备注', '操作'],
                jsonReader : {
                    root: "data",
                    page: "curPage",
                    total: "totalPage",
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'year'
                },  {
                    name : 'enrollType'
                }, {
                    name : 'cityName'
                }, {
                    name : 'science'
                }, {
                    name : 'batch'
                },  {
                    name : 'majorName'
                }, {
                    name : 'enrollNum'
                }, {
                    name : 'remark'
                }, {
                    name : "id",
                    align :'center',
                    width :100,
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = '<div class="hidden-sm hidden-xs btn-group">';
                        retVal += '<button class="btn btn-xs btn-info" onclick="$.showCommonEditDialog(\'/enrollPlan/toSave?id='+rowObject.id+'\',\'修改计划招生数\',500,400);"> ' +
                            '<i class="ace-icon fa fa-pencil bigger-120"></i> </button>' +
                            '<button class="btn btn-xs btn-danger" onclick="deleteElement('+rowObject.id+')"> <i class="ace-icon fa fa-trash-o bigger-120"></i> </button> </div>';
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

function deleteElement(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/enrollPlan/delete",
                data: "id="+id
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    enrollRuleFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}

function batchDelete(){
    var params = $("form").serialize();
    bootbox.confirm("确定根据所选条件全部删除?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/enrollPlan/batchDelete",
                data: params
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    enrollRuleFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
            });
        }
    });
}

function add(){
    $.showCommonEditDialog("/enrollPlan/toSave","新增招生计划",500,400);
}

function importBtn(){
    $.showCommonEditDialog("/enrollPlan/toUpload","导入招生计划",350,250);
}

$(function() {
    enrollRuleFacade.query();
    $("#searchBtn").click(enrollRuleFacade.query);

    $("#addBtn").click(function(){
        add()
    });

    $("#importBtn").click(function(){
        importBtn()
    });

    $("#batchDel").click(function(){
        batchDelete()
    });
});