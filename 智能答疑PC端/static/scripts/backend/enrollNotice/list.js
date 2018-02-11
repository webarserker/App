var enrollNoticeFacade = {
    detailsGrid: null, // 数据详情
    url : '/enrollNotice/queryList',
    query : function() {
        var queryString = enrollNoticeFacade.getParams();
        if(!queryString) {
        	return false;
        }
        // 加载详情
        enrollNoticeFacade.loadDetails(queryString);
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
                url : enrollNoticeFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : enrollNoticeFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID', '标题', '排序', '创建时间', '发布人', '修改时间', '修改人', '操作'],
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
                    name : 'sortNum',
                    width : 50
                }, {
                    name : 'createTime',
                    align:'right',
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(cellvalue, 'yyyy-MM-dd hh:mm:ss');
                    }
                }, {
                    name : 'creator'
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
                    width : '150',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="$.showCommonEditDialog(\'/enrollNotice/addOrUpdate?id='+rowObject.id+'\',\'编辑\',980,550);">编辑</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="deleteNotice('+rowObject.id+');">删除</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="$.showCommonEditDialog(\'/enrollNotice/showContent?id='+rowObject.id+'\',\'查看内容\',760,500);">查看内容</button>';
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
    }
}
function deleteNotice(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/enrollNotice/delete",
                data: "id="+id
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    enrollNoticeFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}

$(function() {
	enrollNoticeFacade.query();
    $("#searchBtn").click(enrollNoticeFacade.query);
});