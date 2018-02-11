/**
 * Created by luqq on 16/4/10.
 */
var majorFacade = {
    detailsGrid: null, // 数据详情
    url : '/major/getMajorList',
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
                colNames : ['ID', '专业名称', '学制' , '授予学位', '学费标准'],
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
                }, {
                    name : 'schoolYear',
                    align :'center'
                }, {
                    name : 'degree',
                    align :'center'
                }, {
                    name : 'tuitionStandard',
                    align :'center'
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
    majorFacade.query();
});