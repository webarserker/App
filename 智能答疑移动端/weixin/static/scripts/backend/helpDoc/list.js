var helpDocFacade = {
    detailsGrid: null, // 数据详情
    url : '/helpDoc/queryList',
    query : function() {
        var queryString = helpDocFacade.getParams();
        if(!queryString) {
        	return false;
        }
        // 加载详情
        helpDocFacade.loadDetails(queryString);
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
                url : helpDocFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : helpDocFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID', '一级分类', '二级分类', '创建时间', '创建人','操作'],
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
                    name : 'menu1Name',
                    width : 150
                }, {
                    name : 'menu2Name',
                    width : 150
                },  {
                    name : 'createTime',
                    align:'right',
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(cellvalue, 'yyyy-MM-dd hh:mm:ss');
                    }
                }, {
                    name : 'creator'
                }, {
                    name : "id",
                    width : '150',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="$.showCommonEditDialog(\'/helpDoc/addOrUpdate?id='+rowObject.id+'\',\'编辑\',980,550);">编辑</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="deleteHelp('+rowObject.id+');">删除</button>';
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
    getMenu2 : function () {
    	var menu1Name = $("#menu1Name").find("option:selected").val();
    	if(menu1Name){
    		$.post('/helpDoc/getMenu2',{'menu':menu1Name},function(data){
    			if(data) {
    				$("#menu2Name").empty();
                    $("#menu2Name").append("<option value=''>请选择</option>");
    				$(data).each(function() {
    					$("#menu2Name").append("<option value='"+this.menuName+"'>"+this.menuName+"</option>");
    				});
    			}else {
    				$("#menu2Name").empty();
    			}
    		},'json');
    	} else {
			$("#menu2Name").empty();
    	}
    }
}
function deleteHelp(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/helpDoc/delete",
                data: "id="+id
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    helpDocFacade.query();
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
	helpDocFacade.query();
    $("#searchBtn").click(helpDocFacade.query);
    $("#menu1Name").change(helpDocFacade.getMenu2);
});