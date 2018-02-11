var sysSchoolMenuFacade = {
    detailsGrid: null, // 数据详情
    url : '/schoolMenu/queryList',
    query : function() {
        var queryString = sysSchoolMenuFacade.getParams();
        if(!queryString) {
        	return false;
        }
        // 加载详情
        sysSchoolMenuFacade.loadDetails(queryString);
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
                url : sysSchoolMenuFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : sysSchoolMenuFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['菜单ID','菜单名称','序号','菜单层级','操作'],
                jsonReader : {  
                    root: "data",  
                    page: "curPage",  
                    total: "totalPage",  
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'menuId',
                    align :'center',
                    width : 40
                }, {
                    name : 'menuName',
                    align :'left',
                    width : 200,
                    formatter : function(cellvalue, options, rowObject) {
                    	var level = rowObject.menuLevel;
                    	if(level==1){
                    		levle=0;
                    	}
                    	var sparc="";
                    	for(var i=0;i<level*3;i++){
                    		sparc +='&nbsp;';
                    	}
                        return sparc + cellvalue;
                    }
                },{
                    name : 'menuOrder',
                    align :'center',
                },{
                    name : 'menuLevel',
                    align :'center',
                    width : 90
                }, {
                    name : "id",
                    formatter : function(cellvalue, options, rowObject) {
                        return ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="deleteSchoolMenu('+rowObject.menuId+');">删除</button>';
                    }
                }],
                rowNum : 100,
                rowList : [ 30, 50, 100 ],
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
function deleteSchoolMenu(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/schoolMenu/delete",
                data: {"menuId":id,"scode":$("#scode").val()}
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    sysSchoolMenuFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}
var treeObj = null;
/**
 *将被分配的菜单进行勾选
 */
function showChecked(){
    var treeObj = $.fn.zTree.getZTreeObj("tree");
    var nodes = treeObj.getNodes();//只能获取1级节点
    showCheckedNode(nodes);
}
function showCheckedNode(nodes){
    for (var i = 0; i < nodes.length; i++) {
        if(nodes[i].ifSelected){
            treeObj.checkNode(nodes[i], true, false);
        }
        if(nodes[i].isParent){
            showCheckedNode(nodes[i].children)
        }
    }
}
$(function() {
    $("#searchBtn").click(sysSchoolMenuFacade.query);
    $('#searchBtn').click();
    $("#addDefaultMenuBtn").click(function(){
    	$.ajax({
            type: "POST",
            url: "/schoolMenu/addDefaultMenu",
            data: {"scode":$("#scode").val()}
        }).done(function (data) {
            if (data.success) {
                $.dialog({title: '提示', content: "添加成功", icon: 'success.gif',lock:true ,ok: '确定'});
                sysSchoolMenuFacade.query();
            } else {
                $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
            }
        }).always(function () {
            //$("#submitBtn").removeClass("disabled");
        });
    });
    
    $('#expandAll').click(function () {
        treeObj.expandAll(true);
        $(this).hide().siblings().show();
    });
    $('#shrinkAll').click(function () {
        treeObj.expandAll(false);
        $(this).hide().siblings().show();
    });
  //弹出树，选择菜单
	/*var setting = {
			check: {
				enable: true
			},
			data: {  
	            simpleData: {//是否为简单数据类型JSON  
	                enable:true
	            }
	        }, 
			async: {
				enable: true,
				 dataType:"json",//返回数据类型  
	             type:"post",//请求方式  
				 url : '/menu/getMenus',
				 autoParam:["id", "name=n", "level=lv"]
			}
	};*/

    var setting = {
        treeId:"school_menu",

        data: {
            key: {
                name: "menuName",
                title: "id"
            },
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "parentId"
            }
        },
        check: {
            enable: true,
            chkStyle: "checkbox",
            chkboxType: { "Y": "ps", "N": "ps" },
            nocheckInherit: false
        }
    };

	$("#addBtn").click(function(){
		$('#modal-tree-items').modal("toggle");
		// $.fn.zTree.init($("#tree"), setting);
        $.ajax({
            type: 'post',
            url: '/menu/findSchoolMenu',
            data:{"sCode" : $('#scode').val()},
            dataType: "json",
            success: function (data) {
                if(data.code == "000000"){
                    treeObj = $.fn.zTree.init($("#tree"), setting, data.data);
                    showChecked();
                }else{
                    alert(data.message);
                }
            },
            error: function (msg) {
                if(msg.status == 500){
                    alert(" 数据加载失败,请联系管理员！");
                }
                if(msg.status == 200){
                    location.href = "${ctx}/ajax_noPermission";
                }
            }
        });
	});
	$('#tree-select-ok').on('click', function() {
		var name;
		var ids = [];
		var obj = $.fn.zTree.getZTreeObj("tree").getCheckedNodes(true);
		for(var i=0;i<obj.length;i++){
			ids[i]=obj[i].id;
		}
		if(ids.length == 0){
			//没有选择
			$.dialog({title: '提示', content: "请选择菜单", icon: 'success.gif',lock:true ,ok: '确定'});
			return;
		}
		$('#modal-tree-items').modal("toggle");
		//增加菜单
		$.post("/schoolMenu/allocateMenu.json", {"items" : ids.toString(),"scode":$("#scode").val()}, function(data, textStatus, jqXHR) {
			if (jqXHR.status == "200") {
				if(data){
					$.dialog({title: '提示', content: "操作成功", icon: 'success.gif',lock:true ,ok: '确定'});
					$("#table-data-list").trigger('reloadGrid');
				}else{
					$.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
				}
				
			}
	  }, 'text').fail(function(jqXHR, textStatus, errorThrown) {
		  $.dialog({title: '提示', content: textStatus, icon: 'error.gif',lock:true, ok: '确定'});
	});
	});
});