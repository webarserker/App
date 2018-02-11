var infoVerifyFacade = {
    detailsGrid: null, // 数据详情
    url : '/infoContent/queryVerifyList',
    query : function() {
        var queryString = infoVerifyFacade.getParams();
        if(!queryString) {
        	return false;
        }
        // 加载详情
        infoVerifyFacade.loadDetails(queryString);
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
                url : infoVerifyFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : infoVerifyFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID', '标题', '一级分类', '二级分类', '提交时间', '提交人','操作'],
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
                    name : 'contentTypeStr',
                    width : 100
                }, {
                    name : 'infoCatName',
                    width : 100
                }, {
                    name : 'createTime',
                    align:'right',
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(cellvalue, 'yyyy-MM-dd hh:mm:ss');
                    }
                }, {
                    name : 'creator'
                }, {
                    name : "id",
                    formatter : function(cellvalue, options, rowObject) {
                      //  var retVal = ' <button class="btn btn-minier btn-primary btn-bold" onclick="$.showCommonEditDialog(\'/infoContent/verifyPage?id='+rowObject.id+'\',\'审核\',980,500);">审核</button>';
                    	var retVal = '<button class="btn btn-minier btn-warning btn-bold" onclick="showCommonEditDialog(-1,\'/infoContent/addOrUpdate?id='+rowObject.id+'\',\'审核\',1085,580);">审核</button>';
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
    getInfoCat : function () {
    	var contentType = $("#contentType").find("option:selected").val();
    	if(contentType){
    		$.post('/infoCat/getByContentType',{'type':contentType},function(data){
    			if(data) {
    				$("#catId").empty();
                    $("#catId").append("<option value=''>请选择</option>");
    				$(data).each(function() {
    					$("#catId").append("<option value='"+this.id+"'>"+this.name+"</option>");
    				});
    			}else {
    				$("#catId").empty();
    			}
    		},'json');
    	} else {
			$("#catId").empty();
    	}
    }
}
function deleteInfoContent(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/infoContent/delete",
                data: "id="+id
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    infoVerifyFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}
//审核对话框
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
	infoVerifyFacade.query();
    $("#searchBtn").click(infoVerifyFacade.query);
    //$("#contentType").change(infoVerifyFacade.getInfoCat);
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
				 url : '/infoCat/getCats',
				 autoParam:["id", "name=n", "level=lv"]
			}
	};
	$("#parentName").click(function(){
		$('#modal-tree-items').modal("toggle");
		zTreeObj=$.fn.zTree.init($("#tree"), setting);
	});
	$('#tree-select-ok').on('click', function() {
		var name="";
		var id="";
		var contentType="";
		var obj = $.fn.zTree.getZTreeObj("tree").getCheckedNodes(true);
		var isleaf = true;
		for(var i=0;i<obj.length;i++){
			id=obj[i].id;
			name=obj[i].name;
			isleaf = obj[i].leaf;
			contentType = obj[i].contentType;
		}
		$("#parentName").val(name);
		if(isleaf){
			$("#catId").val(id);
		}else{
			$("#catId").val("");//清空
		}
		$("#contentType").val(contentType);
		$('#modal-tree-items').modal("toggle");
	});
});