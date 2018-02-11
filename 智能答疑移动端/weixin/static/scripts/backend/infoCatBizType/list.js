var infoCatBizTypeFacade = {
    detailsGrid: null, // 数据详情
    url : '/infoCatBizType/queryList',
    query : function() {
        var queryString = infoCatBizTypeFacade.getParams();
        if(!queryString) {
        	return false;
        }
        // 加载详情
        infoCatBizTypeFacade.loadDetails(queryString);
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
                url : infoCatBizTypeFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : infoCatBizTypeFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['菜单名称', '序号', '修改时间', '修改人','操作'],
                jsonReader : {  
                    root: "data",  
                    // page: "curPage",
                    // total: "totalPage",
                    records: "totalRows"
                },
                // prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:false},
                colModel : [{
                    name : 'catName',
                    width : 150
                },{
                	name:'sortNum',
                	align :'center',
                    width : 80
                }, {
                    name : 'modifyTime',
                    align:'center',
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(cellvalue, 'yyyy-MM-dd hh:mm:ss');
                    }
                }, {
                    name : 'modifier',
                    align:'center'
                }, {
                    name : "id",
                    align:'center',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="showCommonEditDialog('+rowObject.id+', \'/infoCatBizType/addOrUpdate?id='+rowObject.id+'&bizType='+$("#bizType").val()+'\',\'修改\',450,180);">修改</button>';
                            retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="deleteInfoCat('+rowObject.id+');">删除</button>';
                        return retVal;
                    }
                }],
                // rowNum : 50,
                // rowList : [ 30, 50,100 ],
                // pager : pager_selector,
                // pagerpos : 'left',
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
    bootbox.confirm("您确定删除该菜单吗?", function(result) {
        if(result) {
            doDelete(id);
        }
    });
}

function doDelete(id) {
	$.ajax({
		type: "POST",
		url: "/infoCatBizType/delete",
		data: "id="+id
	}).done(function (data) {
		if (data.success) {
			$.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
			infoCatBizTypeFacade.query();
		} else {
			$.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
		}
	}).always(function () {
		//$("#submitBtn").removeClass("disabled");
	});
}

function create(){
	var catLevel = $('#catLevel').val(),parentCatId = $("#parentCatId").val();
	showCommonEditDialog(-1,"/infoCatBizType/addOrUpdate?bizType="+$("#bizType").val(),"修改",450,180);
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
    infoCatBizTypeFacade.query();
    $("#searchBtn").click(infoCatBizTypeFacade.query);
  
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