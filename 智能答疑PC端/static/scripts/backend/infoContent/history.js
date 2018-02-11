var infoContentHistoryFacade = {
    detailsGrid: null, // 数据详情
    url : '/infoContent/history',
    query : function() {
        var queryString = "infoId="+$("#infoId").val();
        // 加载详情
        infoContentHistoryFacade.loadDetails(queryString);
    },
    // 加载数据详情
    loadDetails : function(params) {
        var _this = this;
        var grid_selector = "#table-data-list";
        var pager_selector = "#table-data-list-pager";
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : infoContentHistoryFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : infoContentHistoryFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID', '标题', '修改时间', '修改人','操作'],
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
                    width : 80
                }, {
                    name : 'title',
                    width : 120
                }, {
                    name : 'modifyTime',
                    align:'right',
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(cellvalue, 'yyyy-MM-dd hh:mm:ss');
                    }
                }, {
                    name : 'modifier',
                    align:'right'
                }, {
                    name : "id",
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="create('+rowObject.id+');">编辑</button>';
                        return retVal;
                    }
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
    },
    openWin : function(id) {
    	var url = '/infoContent/updateHistory?id='+id;
    	parent.$.dialog({
    		id : 'openWin',
		    lock: true,
			title : '编辑',
			content : "url:"+url,
		    width: 1085,
		    height: 580,
		    drag: true,
		    resize: true,
		    icon: 'alert.gif'
		});
    }
}
//查看历史
function create(id){
	showCommonEditDialog(-1,"/infoContent/updateHistory?id="+id,"编辑",1085,580);
}

function showCommonEditDialog(id, url, title, width, height){
	window.parent.editDialog= parent.$.dialog({
        id : 'editInfoCat2',
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
	infoContentHistoryFacade.query();
    $("#searchBtn").click(infoContentHistoryFacade.query);
    $("#contentType").change(infoContentHistoryFacade.getInfoCat);
});