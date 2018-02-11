var infoCatFacade = {
    detailsGrid: null, // 数据详情
    url : '/navigator/queryList',
    query : function() {
        var queryString = infoCatFacade.getParams();
        if(!queryString) {
        	return false;
        }
        // 加载详情
        infoCatFacade.loadDetails(queryString);
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
                url : infoCatFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : infoCatFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID', '分类名称','链接地址','分类图标','分类图片', '排序','是否可见','修改时间', '修改人','操作'],
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
                },{
                    name : 'name',
                    width : 150,
                    formatter : function(cellvalue, options, rowObject) {
                    	var level = rowObject.navLevel;
                    	console.log(level);
                    	/*if(level){
                    		level = level-1;
                    	}*/
                    	var sparc="";
                    	for(var i=0;i<level*6;i++){
                    		sparc +='&nbsp;';
                    	}
                    	
                        return sparc + cellvalue;
                    }
                }, {
                    name : 'refUrl',
                    width : 100
                }, {
                    name : 'icon',
                    width : 80,
                    align :'center',
                    formatter : function(cellvalue, options, rowObject) {
                        return '<i class="'+cellvalue+'"></i>';
                    }
                }, {
                    name : 'imgUrl',
                    width : 250
                },{
                	name:'sortNum',
                	align :'center',
                    width : 80
                },{
                	name:'isShow',
                	align :'center',
                    width : 80,
                    formatter : function(cellvalue, options, rowObject) {
                        return cellvalue == 0 ? '显示':'隐藏';
                    }
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
                        var retVal = ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="showCommonEditDialog('+rowObject.id+', \'/navigator/toAddOrUpdate?id='+rowObject.id+'\',\'修改\',450,550);">修改</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="deleteInfoCat('+rowObject.id+','+rowObject.navLevel+','+rowObject.catType+');">删除</button>';
                        if(rowObject.parentCatId){
                        	retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="goInfoContentPage('+rowObject.id+');">信息发布</button>';
                        }
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
function deleteInfoCat(id,navLevel,catType){
	bootbox.confirm(navLevel ? "您确定删除该记录?" : "您确定删除该分类下的所有记录?", function(result) {
		if(result) {
			doDelete(id,catType);
		}
	});
}

function goInfoContentPage(id,catType){
	window.location.href = '/infoContent/page?catId=' +id+ '&catType=' +catType;
}

function doDelete(id,catType) {
	 $("#submitBtn").addClass("disabled");
	$.ajax({
		type: "POST",
		url: "/navigator/delete",
		data: "id="+id+'&catType='+catType
	}).done(function (data) {
		if (data.retCode == 0) {
			$.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
			infoCatFacade.query();
		} else {
			$.dialog({title: '提示', content: data.message, icon: 'error.gif',lock:true, ok: '确定'});
		}
	}).always(function () {
		$("#submitBtn").removeClass("disabled");
	});
}

function create(){
	showCommonEditDialog(-1,"/navigator/toAddOrUpdate?catType=" + $("#catType").val() ,"新增",450,550);
}
var editDialog;
function showCommonEditDialog(id, url, title, width, height){
    editDialog = $.dialog({
        id : 'editInfoNavigator',
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
    infoCatFacade.query();
    $("#searchBtn").click(infoCatFacade.query);
  
  //弹出树，选择菜单
  var zTreeObj;
	var setting = {
			check: {
				enable: true,
				chkStyle: "radio",
				radioType: "all"
			},
      callback: {
        onClick: function (e, treeId, treeNode, clickFlag) {
          zTreeObj.checkNode(treeNode, !treeNode.checked, true);
        }
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
				 url : '/navigator/getNavigatorTree?catType=' + $("#catType").val(),
				 autoParam:["id", "name=n", "level=lv"]
			}
	};
	$("#parentName").click(function(){
		$('#modal-tree-items').modal("toggle");
        zTreeObj = $.fn.zTree.init($("#tree"), setting);
	});
	$('#tree-select-ok').on('click', function() {
		var name="";
		var id ="";
		var obj = $.fn.zTree.getZTreeObj("tree").getCheckedNodes(true);
		for(var i=0;i<obj.length;i++){
			id=obj[i].id;
			name=obj[i].name;
		}
		$("#parentName").val(name);
		$("#parentId").val(id);
		$('#modal-tree-items').modal("toggle");
	});
});