var sysLevelMenuFacade = {
    menuDetailsGrid: null, // 数据详情
    userDetailsGrid: null, // 数据详情
    menuUrl : '/levelMenu/findMenuListBySCode',
    userUrl : '/user/findUserByLevel',
    dataLevel : 1,//默认值为1

    queryMenu : function(){
        var menuQueryString = sysLevelMenuFacade.getMenuParams();
        if(!menuQueryString) {
            return false;
        }
        // 加载详情
        sysLevelMenuFacade.loadMenuDetails(menuQueryString);
    },
    queryUser : function() {
        var userQueryString = sysLevelMenuFacade.getUserParams();
        if(!userQueryString) {
            return false;
        }
        // 加载详情
        sysLevelMenuFacade.loadUserDetails(userQueryString);
    },
    query : function() {
        sysLevelMenuFacade.queryMenu();
        sysLevelMenuFacade.queryUser();
    },
    getMenuParams : function() {
        var params = '';
        params += 'menuName=' + $('#menuName').val();
        params += '&levelId=' + sysLevelMenuFacade.dataLevel;
        return params;
    },
    getUserParams : function() {
        var params = '';
        params += 'loginName=' + $('#loginName').val();
        params += '&dataLevel=' + sysLevelMenuFacade.dataLevel;
        return params;
    },
    // 加载数据详情
    loadMenuDetails : function(params) {
    	var _this = this;
        var menu_grid_selector = "#menu-table-data-list";
        var menu_pager_selector = "#menu-table-data-list-pager";
        if(_this.menuDetailsGrid) {
            // 根据搜索条件，重新加载
            $(menu_grid_selector).jqGrid('setGridParam',{
                url : sysLevelMenuFacade.menuUrl+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.menuDetailsGrid = $(menu_grid_selector).jqGrid({
                url : sysLevelMenuFacade.menuUrl+'?'+params,
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
                    width : 60
                }, {
                    name : 'menuName',
                    align :'left',
                    width : 250,
                    formatter : function(cellvalue, options, rowObject) {
                    	var level = rowObject.menuLevel;
                    	if(level==1){
                            level=0;
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
                    width : 60
                },{
                    name : 'menuLevel',
                    align :'center',
                    width : 60
                }, {
                    name : "id",
                    align :'center',
                    formatter : function(cellvalue, options, rowObject) {
                        if(sysLevelMenuFacade.dataLevel != 1){
                            return ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="deleteLevelMenu('+rowObject.id+');">删除</button>';
                        }else{
                            return '';
                        }
                    }
                }],
                rowNum : 100,
                rowList : [ 30, 50, 100 ],
                pager : menu_pager_selector,
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
        $.resizeGrid(menu_grid_selector);
    },
    // 加载数据详情
    loadUserDetails : function(params) {
        var _this = this;
        var user_grid_selector = "#user-table-data-list";
        var user_pager_selector = "#user-table-data-list-pager";
        if(_this.userDetailsGrid) {
            // 根据搜索条件，重新加载
            $(user_grid_selector).jqGrid('setGridParam',{
                url : sysLevelMenuFacade.userUrl+'?'+params,
                page:1
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.userDetailsGrid = $(user_grid_selector).jqGrid({
                url : sysLevelMenuFacade.userUrl+'?'+params,
                datatype : 'json',
                colNames : ['ID', '用户名', '真实姓名', '联系方式', '状态'],
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
                    width : 40
                }, {
                    name : 'loginName',
                    align :'center',
                    width : 90
                }, {
                    name : 'realName',
                    align :'center',
                    width : 90
                }, {
                    name : 'email',
                    align:'left',
                    formatter : function(cellvalue, options, rowObject) {
                        var str = "邮箱：";
                        if(rowObject.email != null){
                            str += rowObject.email;
                        }
                        str += "<br>手机：";
                        if(rowObject.phoneNum != null){
                            str += rowObject.phoneNum;
                        }
                        return str;
                    }
                }, {
                    name : 'status',
                    align:'center',
                    formatter : function(cellvalue, options, rowObject) {
                        if(cellvalue == 1){
                            return "正常";
                        }else if(cellvalue == 2){
                            return "禁用";
                        }
                    },
                    width : 50
                }],
                rowNum : 30,
                rowList : [ 10, 30, 50 ],
                pager : user_pager_selector,
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
        $.resizeGrid(user_grid_selector);
    }
}
function deleteLevelMenu(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/levelMenu/delete",
                data: {"id":id}
            }).done(function (data) {
                if (data.code = '000000') {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    sysLevelMenuFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {

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
    $('#dataLevel').find('li').click(function () {
        sysLevelMenuFacade.dataLevel = $(this).attr("dataLevel");
        if(sysLevelMenuFacade.dataLevel == 1){
            $('#addBtn').hide();
            sysLevelMenuFacade.menuUrl = '/levelMenu/findMenuListBySCode';
        }else{
            $('#addBtn').show();
            sysLevelMenuFacade.menuUrl = '/levelMenu/findMenuList';
        }
        sysLevelMenuFacade.query();
    });

    $("#searchMenuBtn").click(function () {
        sysLevelMenuFacade.queryMenu();
    });
    $("#searchUserBtn").click(function () {
        sysLevelMenuFacade.queryUser();
    });
    sysLevelMenuFacade.query();

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
            url: '/levelMenu/findSchoolLevelMenu',
            data:{"dataLevel" : sysLevelMenuFacade.dataLevel},
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
	    var params = {};
		var obj = $.fn.zTree.getZTreeObj("tree").getCheckedNodes(true);
        if(obj.length == 0){
            //没有选择
            $.dialog({title: '提示', content: "请选择菜单", icon: 'success.gif',lock:true ,ok: '确定'});
            return;
        }
        params['levelId'] = sysLevelMenuFacade.dataLevel;
		for(var i=0;i<obj.length;i++){
		    params['menuIdList['+ i +']'] = obj[i].id;
		}

		$('#modal-tree-items').modal("toggle");
		//增加菜单
        $.ajax({
            type: "POST",
            url: "/levelMenu/allocateMenu",
            data: params
        }).done(function (data) {
            if (data.code = '000000') {
                $.dialog({title: '提示', content: "操作成功", icon: 'success.gif',lock:true ,ok: '确定'});
                $("#menu-table-data-list").trigger('reloadGrid');
            } else {
                $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true , ok: '确定'});
            }
        }).always(function () {

        });
	});
});