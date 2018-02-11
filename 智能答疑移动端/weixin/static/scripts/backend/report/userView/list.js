var userViewFacade = {
    detailsGrid: null, // 数据详情
    url : '/report/userViewList',
    query : function() {
        var queryString = userViewFacade.getParams();
        if(!queryString) {
        	return false;
        }
        // 加载详情
        userViewFacade.loadDetails(queryString);
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
                url : userViewFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : userViewFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['用户ID', '生源地', '用户名称', '科类', '招生类型', '分数','访问次数', '提问次数','操作'],
                jsonReader : {  
                    root: "data",  
                    page: "curPage",  
                    total: "totalPage",  
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'userId',
                    align :'center',
                    width : 60,
                    formatter : function(cellvalue, options, rowObject) {
                        return "<a href='#' onclick=\"sendMsg(\'"+cellvalue+"\');return false;\">"+cellvalue+"</a>"
                    },
                    key : true
                }, {
                    name : 'userCity',
                    width : 80
                }, {
                    name : 'userName',
                    width : 100
                }, {
                    name : 'scienceClass',
                    width : 100
                }, {
                    name : 'type',
                    width : 200
                }, {
                    name : 'userScore',
                    width : 50
                }, {
                    name : 'viewTimes',
                    width : 60
                }, {
                    name : 'quesTimes',
                    width : 60
                }, {
                    name : "id",
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="sendMsg('+rowObject.userId+');">发送回访消息</button>';
                        return retVal;
                    }
                }
                ],
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

var editDialog;
function showCommonEditDialog(id, url, title, width, height){
    editDialog = $.dialog({
        id : 'editInfoCat',
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

function sendMsg(userid){
	$.showCommonEditDialog("/msg/toSendMsg?id="+userid,"发送回访消息",600,300)
}


$(function() {
    userViewFacade.query();
    $("#searchBtn").click(userViewFacade.query);
});