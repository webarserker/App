var preManagerFacade = {
    detailsGrid: null, // 数据详情
    url : '/preManager/findList',
    query : function() {
        var queryString = preManagerFacade.getParams();
        if(!queryString) {
        	return false;
        }
        $('#data-list').show();
        // 加载详情
        preManagerFacade.loadDetails(queryString);
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
                url : preManagerFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : preManagerFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['希望较大分差','可报考最低分差', '大于预测分数', '大于希望较大','大于可报考分数','小于可报考分数' , '操作'],
                jsonReader : {  
                    root: "data",  
                    page: "curPage",  
                    total: "totalPage",  
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'hopeScore'
                }, {
                    name : 'hardScore'
                }, {
                    name : 'biggerPre'
                }, {
                    name : 'biggerHope'
                }, {
                    name : 'biggerHard'
                }, {
                    name : 'smallHard'
                },{
                    name : "id",
                    align :'center',
                    width :100,
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = '<div class="hidden-sm hidden-xs btn-group">';
                        retVal += '<button class="btn btn-xs btn-info" onclick="$.showCommonEditDialog(\'/preManager/toSave?id='+rowObject.id+'\',\'修改预测模型\',800,350);"> ' +
                            '<i class="ace-icon fa fa-pencil bigger-120"></i> </button></div>';
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


$(function() {
    preManagerFacade.query();
    $("#searchBtn").click(preManagerFacade.query);
});