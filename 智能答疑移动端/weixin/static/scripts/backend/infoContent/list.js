var infoContentFacade = {
    detailsGrid: null, // 数据详情
    url : '/infoContent/queryList',
    query : function() {
        var queryString = infoContentFacade.getParams();
        if(!queryString) {
        	return false;
        }
        // 加载详情
        infoContentFacade.loadDetails(queryString);
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
                url : infoContentFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : infoContentFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID', '标题', '一级分类', '二级分类', '排序','发布时间', '创建时间', '发布人', '修改时间', '修改人', '拒绝理由','操作'],
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
                    width : 50,
                    formatter : function(cellvalue, options, rowObject) {
                        return '<a href="/front/info/route/3/'+rowObject.id+'?parentId='+rowObject.catId+'" target="_blank" >'+cellvalue+'</a>';
                     }
                }, {
                    name : 'title',
                    width : 120,
                    formatter : function(cellvalue, options, rowObject) {
                       return '<a href="/front/info/route/3/'+rowObject.id+'?parentId='+rowObject.catId+'" target="_blank" >'+cellvalue+'</a>';
                    }
                }, {
                    name : 'parentCatName',
                    width : 80
                }, {
                    name : 'infoCatName',
                    width : 80
                },  {
                    name : 'sortNum',
                    width : 40
                }, {
                    name : 'pulishTime',
                    width : '75',
                    align:'right',
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(cellvalue, 'yyyy-MM-dd hh:mm:ss');
                    }
                }, {
                    name : 'createTime',
                    align:'right',
                    width : '75',
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(cellvalue, 'yyyy-MM-dd hh:mm:ss');
                    }
                }, {
                    name : 'creator',
                    width : '75'
                }, {
                    width : '75',
                    name : 'modifyTime',
                    align:'right',
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(cellvalue, 'yyyy-MM-dd hh:mm:ss');
                    }
                }, {
                    name : 'modifier',
                    width : '75'
                }, {
                    name : 'remark',
                    width : '80',
                }, {
                    name : "id",
                    align:'left',
                    width : '270',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = '<button class="btn btn-minier btn-warning btn-bold" onclick="showCommonEditDialog(-1,\'/infoContent/addOrUpdate?id='+rowObject.id+'\',\'编辑\',1085,580);">编辑</button>';
                        //if(rowObject.specType == 0){
                            retVal += ' <button class="btn btn-minier btn-warning btn-bold" onclick="deleteInfoContent('+rowObject.id+');">删除</button>';
                        //}
                        retVal += ' <button class="btn btn-minier btn-warning btn-bold" onclick="$.showCommonEditDialog(\'/infoContent/showContent?id='+rowObject.id+'\',\'查看内容\',760,500);">查看内容</button>';
                        retVal += ' <button class="btn btn-minier btn-success btn-bold" onclick="$.showCommonEditDialog(\'/infoContent/showHistory?infoId='+rowObject.id+'\',\'查看历史\',760,500);">查看历史</button>';
                        if(rowObject.isHot != null && rowObject.isHot == 0){
                        	retVal += ' <button class="btn btn-minier btn-success btn-bold" onclick="updateDisType(0,1,'+rowObject.id+')">取消热点</button>';
                        }else{
                        	retVal += ' <button class="btn btn-minier btn-success btn-bold" onclick="updateDisType(0,0,'+rowObject.id+')">设置热点</button>';
                        }
                        if(rowObject.isNotice != null && rowObject.isNotice == 0){
                        	retVal += ' <button class="btn btn-minier btn-primary btn-bold" onclick="updateDisType(1,1,'+rowObject.id+')">取消公告</button>';
                        }else{
                        	retVal += ' <button class="btn btn-minier btn-primary btn-bold" onclick="updateDisType(1,0,'+rowObject.id+')">设置公告</button>';
                        }
                        retVal += ' <button class="btn btn-minier btn-primary btn-bold" onclick="setCatIds('+rowObject.id+','+rowObject.catId+');">关联分类</button>';
                        if(rowObject.isRecommend != null && rowObject.isRecommend == 0){
                        	 retVal += ' <button class="btn btn-minier btn-primary btn-bold" onclick="updateDisType(2,1,'+rowObject.id+');">取消推荐</button>';
                        }else{
                        	 retVal += ' <button class="btn btn-minier btn-primary btn-bold" onclick="updateDisType(2,0,'+rowObject.id+');">推荐</button>';
                        }
                        retVal += ' <button class="btn btn-minier btn-danger btn-bold" id="bbtn_'+rowObject.id+'" onclick="broadcastWxMsg('+rowObject.id+','+rowObject.status+');">微信消息推送</button>';
                        return retVal;
                    }
                }],
                rowNum : 50,
                rowList : [ 30, 50,100],
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
                    infoContentFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}

//微信消息推送
function broadcastWxMsg(infoId,status){
	if(status!=3){
		$.dialog({title: '提示', content:"当前文章需审核", icon: 'success.gif',lock:true ,ok: '确定'});
		return;
	}
	 $("#bbtn_"+infoId).addClass("disabled");
	$.ajax({
		type:'POST',
		url:'/infoContent/broadcastWxMsg',
		data:{id:infoId},
	}).done(function(data){
		  if (data) {
	            $.dialog({title: '提示', content: "推送成功", icon: 'success.gif',lock:true ,ok: '确定'});
	            infoContentFacade.query();
	        } else {
	            $.dialog({title: '提示', content: "推送失败", icon: 'error.gif',lock:true, ok: '确定'});
	       }
	}).always(function () {
       $("#bbtn_"+infoId).removeClass("disabled");
    });
}
var editDialog;
function create(){
    editDialog = showCommonEditDialog(-1,"/infoContent/addOrUpdate?catId="+$("#catId").val()+"&specType=" + $("#specType").val(),"发布信息",1085,580);
}
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
function updateDisType(type,status,id){
    $.ajax({
        type: "POST",
        url: "/infoContent/updateDisType",
        data: {type:type,status:status,id:id}
    }).done(function (data) {
        if (data) {
            $.dialog({title: '提示', content: "设置成功", icon: 'success.gif',lock:true ,ok: '确定'});
            infoContentFacade.query();
        } else {
            $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
        }
    })
}

function setCatIds(id, catId){
    $("#infoId").val(id);

    $.post('/infoCat/getAllCatsByInfoId?infoId='+id+'&catId='+catId, null, function(list){
        var catIdsSetting = {
            check: {
                enable: true,
                chkStyle: "checkbox",
                //radioType: "all"
            },
            // callback: {
            //     beforeCheck: function (e, treeNode) {
            //        if(!treeNode.isParent) {
            //            return true;
            //        }
            //        return false;
            //    }
            // },
            data: {
                simpleData: {//是否为简单数据类型JSON
                    enable:true,
                }
            },
        };
        $.fn.zTree.init($("#catsTree"), catIdsSetting, list);
        $('#modal-tree-items-cats').modal("toggle");
    }, 'json');

}
$(function() {
	infoContentFacade.query();
    $("#searchBtn").click(infoContentFacade.query);
    //$("#contentType").change(infoContentFacade.getInfoCat);
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
		zTreeObj = $.fn.zTree.init($("#tree"), setting);
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
        $("#specType").val("");//清空该条件
        $('#modal-tree-items').modal("toggle");
    });
    $('#select-cats-ok').on('click', function() {
        var params = '?id='+$("#infoId").val();
        var obj = $.fn.zTree.getZTreeObj("catsTree").getCheckedNodes(true);
        var count = 0;
        for(var i=0;i<obj.length;i++){
            if(obj[i].leaf && !obj[i].isParent) {
                params += "&catIds["+(count++)+"]=" + obj[i].id;
            }
        }
        $.post('/infoContent/updateCats' + params, null, function(res){
            if(res.success) {
                $.dialog({title: '提示', content: "操作成功", icon: 'success.gif',lock:true ,ok: '确定'});
                $("#infoId").val("");//清空该条件
                $('#modal-tree-items-cats').modal("toggle");
            }else {
                $.dialog({title: '提示', content: res.message, icon: 'error.gif',lock:true, ok: '确定'});
            }
        }, 'json');

    });
});