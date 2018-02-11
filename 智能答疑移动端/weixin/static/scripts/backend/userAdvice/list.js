var userAdviceFacade = {
    detailsGrid: null, // 数据详情
    url : '/userAdvice/queryList',
    query : function() {
        var queryString = userAdviceFacade.getParams();
        if(!queryString) {
        	return false;
        }
        // 加载详情
        userAdviceFacade.loadDetails(queryString);
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
                url : userAdviceFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : userAdviceFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['分类', '建议内容', '提交人', '联系方式', '提交时间'],
                jsonReader : {  
                    root: "data",  
                    page: "curPage",  
                    total: "totalPage",  
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colModel : [{
                    name : 'type',
                    width : 120
                }, {
                    name : 'content',
                    width : 240
                }, {
                    name : 'creator',
                    align:'left',
                    width : 80
                }, {
                    name : 'contact',
                    align:'left',
                    width : 80
                }, {
                    name : "createTime",
                    formatter : function(value, options, rowObject) {
                        return $.dateFormat(value, 'yyyy-MM-dd hh:mm:ss');
                    },
                    align:'center',
                }],
                rowNum : 30,
                rowList : [ 10, 30, 50 ],
                pager : pager_selector,
                pagerpos : 'left',
                viewrecords : true,
                height : 'auto',
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                    }, 0);
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    }
}

$(function() {
    userAdviceFacade.query();
    $("#searchBtn").click(userAdviceFacade.query);
});