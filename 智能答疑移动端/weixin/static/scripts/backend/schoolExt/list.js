var schoolFacade = {
    detailsGrid: null, // 数据详情
    url : '/schoolExt/findList',
    query : function() {
        var queryString = schoolFacade.getParams();
        if(!queryString) {
        	return false;
        }
        $('#data-list').show();
        // 加载详情
        schoolFacade.loadDetails(queryString);
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
                url : schoolFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : schoolFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID', '分类', '标题','数量', '修改时间', '修改人','操作'],
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
                    name : 'catType',
                    formatter : function(cellvalue, options, rowObject) {
                        if(cellvalue == 1){
                            return '学科建设';
                        }else if(cellvalue == 2){
                            return '师资力量';
                        }else if(cellvalue == 3){
                            return '学生规模';
                        }
                    }

                },{
                    name : 'title',
                    align :'center'
                },  {
                    name : 'number',
                    align :'center',
                    width : 50
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
                    width :100,
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = '<div class="hidden-sm hidden-xs btn-group">';
                        retVal += '<button class="btn btn-xs btn-info" onclick="$.showCommonEditDialog(\'/schoolExt/toAddOrUpdate?id='+rowObject.id+'\',\'修改信息\',400,250);"> ' +
                            '<i class="ace-icon fa fa-pencil bigger-120"></i> </button>' +
                            '<button class="btn btn-xs btn-danger" onclick="deleteSchool('+rowObject.id+')"> <i class="ace-icon fa fa-trash-o bigger-120"></i> </button> </div>';
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

function deleteSchool(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/schoolExt/delete",
                data: "id="+id
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    schoolFacade.query();
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
    $.showCommonEditDialog("/schoolExt/toAddOrUpdate","新增师资学生",400,250);
}

$(function() {
    schoolFacade.query();
    $("#searchBtn").click(schoolFacade.query);

    $("#addBtn").click(function(){
        addSchool()
    });
});