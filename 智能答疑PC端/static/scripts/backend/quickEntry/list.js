var quickEntryFacade = {
    detailsGrid: null, // 数据详情
    url : '/quickEntry/getEntrys',
    query : function() {
        var queryString = quickEntryFacade.getParams();
        if(!queryString) {
        	return false;
        }
        // 加载详情
        quickEntryFacade.loadDetails(queryString);
    },
    getParams : function() {
        return $("form").serialize();
    },
    // 加载数据详情
    loadDetails : function(params){
        var _this = this;
        var grid_selector = "#table-data-list";
        var pager_selector = "#table-data-list-pager";
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : quickEntryFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : quickEntryFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID', '标题',  '排序','状态', '修改时间', '修改人','操作'],
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
                    width : 150,
                },{
                	name:'sortNum',
                	align :'center',
                    width : 80
                }, {
                    name:'status',
                        align :'center',
                        width : 80,
                        formatter : function(cellvalue, options, rowObject) {
                        return (cellvalue == 0) ? "显示" : "不显示";
                    }
                }, {
                    name : 'modifyTime',
                    align:'right',
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(cellvalue, 'yyyy-MM-dd hh:mm:ss');
                    }
                }, {
                    name : 'modifier'
                }, {
                    name : "id",
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = '';
                        retVal +=' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="showCommonEditDialog('+rowObject.id+', \'/quickEntry/addOrUpdate?id='+rowObject.id+'\',\'修改\',450,450);">修改</button>'
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="changeStatus('+rowObject.id+');">修改为显示</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="deletequickEntry('+rowObject.id+');">删除</button>';
                        return retVal;
                    }
                }],
                rowNum : 50,
                rowList : [ 30, 50,100 ],
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
function deletequickEntry(id){
    $.ajax({
        type: "POST",
        url: "/quickEntry/delete",
        data: "id="+id
    }).done(function (data) {
        if (data.success) {
            $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
            quickEntryFacade.query();
        } else {
            $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
        }
    }).always(function () {
        //$("#submitBtn").removeClass("disabled");
    });
}
function changeStatus(id){
    $.ajax({
        type: "POST",
        url: "/quickEntry/changeStatus",
        data: "id="+id
    }).done(function (data) {
        if (data.success) {
            $.dialog({title: '提示', content: "修改成功", icon: 'success.gif',lock:true ,ok: '确定'});
            quickEntryFacade.query();
        } else {
            $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
        }
    })
}

var editDialog;
function showCommonEditDialog(id, url, title, width, height){
    editDialog = $.dialog({
        id : 'editquickEntry',
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
function create(){
    showCommonEditDialog(-1,"/quickEntry/addOrUpdate","新增",450,450);
}
$(function() {
    quickEntryFacade.query();
    $("#searchBtn").click(quickEntryFacade.query);
});