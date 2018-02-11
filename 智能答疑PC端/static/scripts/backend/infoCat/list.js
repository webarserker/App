var infoCatFacade = {
    detailsGrid: null, // 数据详情
    url : '/infoCat/queryList',
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
                colNames : ['ID', '分类名称', '序号', '修改时间', '修改人','操作'],
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
                }, /*{
                    name : 'contentTypeStr',
                    width : 100
                },*/ {
                    name : 'name',
                    width : 150,
                    formatter : function(cellvalue, options, rowObject) {
                    	var level = rowObject.catLevel;
                    	if(level){
                    		level = level-1;
                    	}
                    	var sparc="";
                    	for(var i=0;i<level*6;i++){
                    		sparc +='&nbsp;';
                    	}
                        return sparc + cellvalue;
                    }
                },{
                	name:'sortNum',
                	align :'center',
                    width : 80
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
                        if(rowObject.catLevel!=3) {
                            retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="createChildCat('+rowObject.catLevel+','+rowObject.id+');">新增</button>';
                        }
                        retVal +=' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="showCommonEditDialog('+rowObject.id+', \'/infoCat/addOrUpdate?id='+rowObject.id+'\',\'修改\',450,450);">修改</button>'
                        if(!rowObject.isDefault ||　rowObject.parentCatId) {
                            retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="deleteInfoCat('+rowObject.id+');">删除</button>';
                        }
                        if(rowObject.parentCatId){
                        	retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="goInfoContentPage(\''+rowObject.id+'\', \''+rowObject.name+'\');">信息发布</button>';
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
function deleteInfoCat(id){
	$.post('/infoCat/hasInfo', {'id':id}, function(data){
		if(data > 0) {
			bootbox.confirm("该分类下存在未删除的信息，您确定删除该分类以及分类中的信息吗?", function(result) {
				if(result) {
					doDelete(id);
				}
			});
		}else {
			bootbox.confirm("您确定删除该记录?", function(result) {
				if(result) {
					doDelete(id);
				}
			});
		}
	}, 'json');
}

function goInfoContentPage(id, name){
    window.parent.toPage('/infoContent/page?catId=' + id, "信息发布管理_"+name, "cat_"+id);
}

function doDelete(id) {
	$.ajax({
		type: "POST",
		url: "/infoCat/delete",
		data: "id="+id
	}).done(function (data) {
		if (data.success) {
			$.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
			infoCatFacade.query();
		} else {
			$.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
		}
	}).always(function () {
		//$("#submitBtn").removeClass("disabled");
	});
}
function createChildCat(catLevel,catId){
	showCommonEditDialog(-1,"/infoCat/addOrUpdate?parentCatId="+catId+'&catLevel='+catLevel,"新增",450,450);
}
function create(){
	var catLevel = $('#catLevel').val(),parentCatId = $("#parentCatId").val();
	showCommonEditDialog(-1,"/infoCat/addOrUpdate?parentCatId="+parentCatId+'&catLevel='+catLevel,"新增",450,450);
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
				 url : '/infoCat/getLimitSizeCats',
				 autoParam:["id", "name=n", "level=lv"]
			}
	};
	$("#parentName").click(function(){
		$('#modal-tree-items').modal("toggle");
    zTreeObj = $.fn.zTree.init($("#tree"), setting);
	});
	$('#tree-select-ok').on('click', function() {
		var name="",level=1;
		var id ="";
		var obj = $.fn.zTree.getZTreeObj("tree").getCheckedNodes(true);
		for(var i=0;i<obj.length;i++){
			id=obj[i].id;
			name=obj[i].name;
			level=obj[i].level+2;
		}
		$("#catLevel").val(level);
		$("#parentName").val(name);
		$("#parentCatId").val(id);
		$('#modal-tree-items').modal("toggle");
	});
});