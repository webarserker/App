var sysMenuFacade = {
    detailsGrid: null, // 数据详情
    url : '/menu/queryList',
    query : function() {
        var queryString = sysMenuFacade.getParams();
        if(!queryString) {
        	return false;
        }
        // 加载详情
        sysMenuFacade.loadDetails(queryString);
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
                url : sysMenuFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : sysMenuFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID', '菜单名称','地址', /*'父菜单ID', '菜单层级',*/'序号','图标','是否可见','是否叶子节点','适用类型','操作'],
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
                    align :'center'
                },{
                	name : 'menuName',
                    align :'left',
                    width : 200,
                    formatter : function(cellvalue, options, rowObject) {
                    	var level = rowObject.menuLevel;
                    	if(level==1){
                    		levle=0;
                    	}
                    	var sparc="";
                    	for(var i=0;i<level*2;i++){
                    		sparc +='&nbsp;';
                    	}
                        return sparc + cellvalue;
                    }
                }, {
                    name : 'menuUrl',
                    align:'center'
                }, /*{
                    name : 'parentId',
                    align :'center'
                },{
                    name : 'menuLevel',
                    align :'center',
                }, */ {
                    name : 'menuOrder',
                    align :'center',
                }, {
                    name : 'menuIcon',
                    align:'center'
                }, {
                    name : 'isvisible',
                    align:'center',
                    formatter : function(cellvalue, options, rowObject) {
                    	if(cellvalue == 0){
                    		return "YES";
                    	}else{
                    		return "NO";
                    	}
                    }
                }, {
                    name : 'isleaf',
                    align:'center',
                    formatter : function(cellvalue, options, rowObject) {
                        if(cellvalue == 0){
                            return "NO";
                        }else{
                            return "YES";
                        }
                    }
                },
                {
                    name : 'menuTypeStr',
                    align:'center'
                },
                {
                    name : "id",
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="editMenu('+rowObject.id+');">修改</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="deleteMenu('+rowObject.id+');">删除</button>';
                        return retVal;
                    }
                }],
                rowNum : 100,
                rowList : [ 30, 100, 200 ],
                pager : pager_selector,
                pagerpos : 'left',
                viewrecords : true,
                height : 'auto',
                /*treeGrid: true,  
                treeGridModel: 'adjacency',
                treeReader:{  
                    level_field: "menuLevel",  
                    parent_id_field: "parentId",  
                    leaf_field: "isleaf",  
                    expanded_field: "expanded"
                }, */
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
function deleteMenu(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/menu/delete",
                data: "id="+id
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    sysMenuFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}
function editMenu(id){
    $.showCommonEditDialog("/menu/addOrUpdate?id="+id,"修改菜单",600,500);
}
$(function() {
    $("#searchBtn").click(sysMenuFacade.query);
    $('#searchBtn').click();
});