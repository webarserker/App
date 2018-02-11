var MoveTest = {
		    higherLevelNum:null,
		    lowerLevelNum:null,
		    leafnodeEndrag:null,
		    contentShow:null,
		    errorMsg: "放错了...请选择正确的类别！",
			curTarget: null,
			curTmpTarget: null,
			dragObj:null,
			noSel: function() {
				try {
					window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
				} catch(e){}
			},
			dragTree2Dom: function(treeId, treeNodes) {
				//return !treeNodes[0].isParent;
				return true;
			},
			prevTree: function(treeId, treeNodes, targetNode) {
				//return !targetNode.isParent && targetNode.parentTId == treeNodes[0].parentTId;
				return true;
			},
			nextTree: function(treeId, treeNodes, targetNode) {
				return !targetNode.isParent && targetNode.parentTId == treeNodes[0].parentTId;
			},
			innerTree: function(treeId, treeNodes, targetNode) {
				return targetNode!=null && targetNode.isParent && targetNode.tId == treeNodes[0].parentTId;
			},
			dragMove: function(e, treeId, treeNodes) {
				var p = null, pId = 'dom_' + treeNodes[0].pId;
				if (e.target.id == pId) {
					p = $(e.target);
				} else {
					p = $(e.target).parent('#' + pId);
					if (!p.get(0)) {
						p = null;
					}
				}

				$('.domBtnDiv .active').removeClass('active');
				if (p) {
					p.addClass('active');
				}
			},
			dropTree2Dom: function(e, treeId, treeNodes, targetNode, moveType,flag) {
				//var domId = "dom_" + treeNodes[0].getParentNode().id;
				
				var zTree = $.fn.zTree.getZTreeObj("treeDemo");
				/*zTree.removeNode(treeNodes[0]);*/
                var domId=treeNodes[0]&&treeNodes[0].id?treeNodes[0].id:treeNodes.id;
                var domName=treeNodes[0]&&treeNodes[0].name?treeNodes[0].name:treeNodes.name;
                var isParent=treeNodes[0]&&treeNodes[0].isParent?treeNodes[0].isParent:treeNodes.isParent;
                var active = $("#editable").children().length>0?'':'in active';
            	var nodes =isParent && treeNodes[0] && treeNodes[0].children ? treeNodes[0].children : treeNodes.children;	
				if((flag==undefined||flag=='undefined')&& isParent){
					bootbox.confirm("当前分类包含子类，是否关联子类?", function(result) {
						flag=!result;
						appContont(isParent,flag,domId,domName,nodes,active);
					});
				}else{
					appContont(isParent,flag,domId,domName,nodes,active);
				}
				
				
				//MoveTest.updateType();
				
				/*if (moveType == null && (domId == e.target.id || $(e.target).parents("#" + domId).length > 0)) {
					var zTree = $.fn.zTree.getZTreeObj("treeDemo");
					zTree.removeNode(treeNodes[0]);

					var newDom = $("span[domId=" + treeNodes[0].id + "]");
					if (newDom.length > 0) {
						newDom.removeClass("domBtn_Disabled");
						newDom.addClass("domBtn");
					} else {
						$("#" + domId).append("<span class='domBtn' domId='" + treeNodes[0].id + "'>" + treeNodes[0].name + "</span>");
					}
					MoveTest.updateType();
				} else if ( $(e.target).parents(".domBtnDiv").length > 0) {
					alert(MoveTest.errorMsg);
				}*/
			},
			dom2Tree: function(e, treeId, treeNode) {
				var target = MoveTest.curTarget, tmpTarget = MoveTest.curTmpTarget;
				if (!target) return;
				var zTree = $.fn.zTree.getZTreeObj("treeDemo"), parentNode;
				if (treeNode != null && treeNode.isParent && "dom_" + treeNode.id == target.parent().attr("id")) {
					parentNode = treeNode;
				} else if (treeNode != null && !treeNode.isParent && "dom_" + treeNode.getParentNode().id == target.parent().attr("id")) {
					parentNode = treeNode.getParentNode();
				}

				if (tmpTarget) tmpTarget.remove();
				if (!!parentNode) {
					var nodes = zTree.addNodes(parentNode, {id:target.attr("domId"), name: target.text()});
					zTree.selectNode(nodes[0]);
				} else {
					target.removeClass("domBtn_Disabled");
					target.addClass("domBtn");
					alert(MoveTest.errorMsg);
				}
				MoveTest.updateType();
				MoveTest.curTarget = null;
				MoveTest.curTmpTarget = null;
			},
			updateType: function() {
				var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
				nodes = zTree.getNodes();
				for (var i=0, l=nodes.length; i<l; i++) {
					var num = nodes[i].children ? nodes[i].children.length : 0;
					nodes[i].name = nodes[i].name.replace(/ \(.*\)/gi, "") + " (" + num + ")";
					zTree.updateNode(nodes[i]);
				}
			},
			bindDom: function() {
				$(".domBtnDiv").bind("mousedown", MoveTest.bindMouseDown);
			},
			bindMouseDown: function(e) {
				var target = e.target;
				if (target!=null && target.className=="domBtn") {
					var doc = $(document), target = $(target),
					docScrollTop = doc.scrollTop(),
					docScrollLeft = doc.scrollLeft();
					target.addClass("domBtn_Disabled");
					target.removeClass("domBtn");
					curDom = $("<span class='dom_tmp domBtn'>" + target.text() + "</span>");
					curDom.appendTo("body");

					curDom.css({
						"top": (e.clientY + docScrollTop + 3) + "px",
						"left": (e.clientX + docScrollLeft + 3) + "px"
					});
					MoveTest.curTarget = target;
					MoveTest.curTmpTarget = curDom;

					doc.bind("mousemove", MoveTest.bindMouseMove);
					doc.bind("mouseup", MoveTest.bindMouseUp);
					doc.bind("selectstart", MoveTest.docSelect);
				}
				if(e.preventDefault) {
					e.preventDefault();
				}
			},
			bindMouseMove: function(e) {
				MoveTest.noSel();
				var doc = $(document), 
				docScrollTop = doc.scrollTop(),
				docScrollLeft = doc.scrollLeft(),
				tmpTarget = MoveTest.curTmpTarget;
				if (tmpTarget) {
					tmpTarget.css({
						"top": (e.clientY + docScrollTop + 3) + "px",
						"left": (e.clientX + docScrollLeft + 3) + "px"
					});
				}
				return false;
			},
			bindMouseUp: function(e) {
				var doc = $(document);
				doc.unbind("mousemove", MoveTest.bindMouseMove);
				doc.unbind("mouseup", MoveTest.bindMouseUp);
				doc.unbind("selectstart", MoveTest.docSelect);

				var target = MoveTest.curTarget, tmpTarget = MoveTest.curTmpTarget;
				if (tmpTarget) tmpTarget.remove();

				if ($(e.target).parents("#treeDemo").length == 0) {
					if (target) {
						target.removeClass("domBtn_Disabled");
						target.addClass("domBtn");
					}
					MoveTest.curTarget = null;
					MoveTest.curTmpTarget = null;
				}
			},
			bindSelect: function() {
				return false;
			}
		};
  //弹出树，选择菜单
  var zTreeObj;
  var setting2 = {
			edit: {
				enable: true,
				showRemoveBtn: false,
				showRenameBtn: false,
				drag:{
					prev: MoveTest.prevTree,
					next: MoveTest.nextTree,
					inner: MoveTest.innerTree
				}
			},
			data: {
				keep: {
					parent:false,
					leaf: false
				},
				simpleData: {
					enable: true
				}
			},
			callback: {
		        onClick: function (e, treeId, treeNode, clickFlag) {
		          zTreeObj.checkNode(treeNode, !treeNode.checked, true);
		        },
		        beforeDrag: MoveTest.dragTree2Dom,
				onDrop: MoveTest.dropTree2Dom,
				onDragMove: MoveTest.dragMove,
				onMouseUp: MoveTest.dom2Tree,
			    /*onCheck:function(e, treeId, treeNode) {
		    		if(treeNode.isParent){
		    			var nodes = treeNode.children;
		    			for(var i=0;i< nodes.length;i++){
		    				if(treeNode.checked){//追加节点
		    				 MoveTest.dropTree2Dom(e, treeId, nodes[i]);
		    				}else{//移除节点
		    					$("li[domId=" + nodes[i].id + "]").remove();	
		    				}
		    			}	  
		    		}else{
		    			if(treeNode.checked){
		    				MoveTest.dropTree2Dom(e, treeId, treeNode);	  
		    			}else{
		    			  $("li[domId=" + treeNode.id + "]").remove();
		    			}
		    		}
			       
			    },*/
			    onAsyncSuccess:function(e,treeId,treeNode,msg){
			  /*  	var nodes = zTreeObj.getNodes();
			    	for(var i=0;i<nodes.length;i++){
			    		zTreeObj.expandNode(nodes[i], false, false, false);
			    	}
			    	zTreeObj.expandAll(false);*/
			    	zTreeObj.expandAll(false);
			    	loadModule();
			    }
	        },
			view: {
				selectedMulti: false,
				addDiyDom: addDiyDom
			},
			async: {
				 enable: true,
				 dataType:"json",//返回数据类型  
	             type:"post",//请求方式  
				 url : '/infoCat/getLimitSizeCats',
				 autoParam:["id", "name=n", "level=lv"]
			}
	};
  //加载文章列表
  var infoContentFacade = {
		  gridArray:[], // 数据详情  
		  detailsGrid:null, // 数据详情
		    domid:null,
		    url : '/infoContent/querySimpleList',
		 		    // 加载数据详情
		    loadDetails : function(params) {
		        var _this = this;
		        
		        var grid_selector = "#table-data-list"+infoContentFacade.domid;
		        var pager_selector = "#table-data-list-pager"+infoContentFacade.domid;
		        if(infoContentFacade.gridArray.indexOf(grid_selector) >= 0) {
		            // 根据搜索条件，重新加载
		            $(grid_selector).jqGrid('setGridParam',{
		                url : infoContentFacade.url+'?'+params,
		                page:1 
		            }).trigger("reloadGrid");
		        } else {
		        	infoContentFacade.gridArray.push(grid_selector);
		            // 首次加载
		             detailsGrid = $(grid_selector).jqGrid({
		                url : infoContentFacade.url+'?'+params,
		                datatype : 'json',
		                colNames : ['发布时间', '标题', '文章地址','关联分类', '序号','操作',"",""],
		                jsonReader : {  
		                    root: "data",  
		                    page: "curPage",  
		                    total: "totalPage",  
		                    records: "totalRows"
		                },
		                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
		                cmTemplate: {sortable:true},
		                colModel : [{
		                    name : 'pulishTime',
		                    width:80,
		                    align:'left',
		                    formatter : function(cellvalue, options, rowObject) {
		                        return $.dateFormat(cellvalue, 'yyyy-MM-dd');
		                    }
		                },{
		                    name : 'title'
		                },{
		                    name : 'infoCatName',
		                    width:100
		                }, {
		                    name : 'parentCatName'
		                },  {
		                    name : 'sortNum',
		                    width:40
		                }, {
		                    name : "id",
		                    width:80,
		                    align:'right',
		                    formatter : function(cellvalue, options, rowObject) {
		                    	var isInCat = infoContentFacade.domid==rowObject.catId ? 1 : 0;
		                        var retVal = '<a role="button"  class="btn btn-minier btn-warning" onclick="showCommonEditDialog(-1,\'/infoContent/addOrUpdate?id='+rowObject.id+'\',\'编辑\',1085,580);">编辑</a>'
		                        +'<a role="button" class="btn btn-minier btn-success" onclick="toTop('+rowObject.id+','+ infoContentFacade.domid +','+rowObject.sortNum+',' + isInCat + ');">置顶</a>';
		                        return retVal;
		                    }
		                },{
		                    name : 'id',
		                    hidden:true
		                },{
		                    name : 'catId',
		                    hidden:true
		                }],
		                forceFit:true,
		                scrollAmount:0,
		                rowNum : 15,
		                rowList : [ 15, 50,100],
		                pager : pager_selector,
		                pagerpos : 'left',
		                viewrecords : true,
		                height : 'auto',
		                loadComplete : function() {
	                	  var grid = $(grid_selector);  
	                       var ids = grid.getDataIDs();  
	                       for (var i = 0; i < ids.length; i++) { 
	                           //grid.setRowData( ids[i], true, {height:'20px'});
	                           var row = grid.getRowData(ids[i]);
	                           if(row.sortNum <= MoveTest.lowerLevelNum){
	                        	   grid.setRowData(ids[i], true, {height:'20px',background:'powderblue'});   
	                           }
	                       } 
		                },
		                gridComplete : function() {
		                	//更新jquery.tablednd.js插件的方法。
		                	 $(grid_selector).tableDnD({ 
		                		  onDrop:function(table,row){
		                			  var targetSort = $(row).prev().children().eq(4).text() ? $(row).prev().children().eq(4).text() : 0;
		                			  var sortNum = $(row).children().eq(4).text();
		                			  var infoId = $(row).children().eq(6).text();
		                			  var catId = $(row).children().eq(7).text();
		                			  var catid = infoContentFacade.domid;
				                	  //如果位置相同不改变顺序
		                			  if(targetSort != sortNum){
		                				  var isInCat = infoContentFacade.domid == catId? 1: 0;
		                					$.post("/infoContent/updateInfoSort",{id:infoId,catId:catid,sortNum:sortNum,targetSort:targetSort,isInCat:isInCat},function(res){
		                						 if(res.success) {
		                				             loadInfolist(catid);
		                				         }else {
		                				        	 parent.$.dialog({title: '提示', content: res.message, icon: 'error.gif',lock:true, ok: '确定'});
		                				         }
		                					},"json")
		                			  }
				                    }
				                });
		                }

		            });
		        }
		        // 自适应宽度
		        $(grid_selector).setGridWidth(parseInt($(".tab-content").css("width"))-30);
		    }
		 
		}

$(function() {
	//分类配置
	MoveTest.higherLevelNum=+$("#higherLevelNum").val();	
	MoveTest.lowerLevelNum=+$("#lowerLevelNum").val();	
	MoveTest.leafnodeEndrag=+$("#leafnodeEndrag").val();	
	MoveTest.contentShow=+$("#contentShow").val();
   //加载树
	zTreeObj = $.fn.zTree.init($("#treeDemo"), setting2);

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
	
	// Editable list
	var editableList = Sortable.create(document.getElementById('editable'), {
		animation: 150,
		filter: '.js-remove',
		onFilter: function (evt) {
			evt.item.parentNode.removeChild(evt.item);
			var id=$(evt.item).attr('domid');
			$("#"+id).remove();//移除子项
			$('#editable a:first').tab('show');
			var newDom=$("#editable li[class*=active]");
		    if($.trim($("#"+id).text())=='自定义项'){
		    	$('#leftTab a:first').tab('show');	
		    }
		}
	});
	//取消按钮
	$("#cancelbtn").click(function(){
		window.close();
	})
	//确认按钮
	$("#submitbtn").click(function(){
		//获取父类内容
		var newDom = $("li[class*=item-orange] a"),data=[],params={};
		if(newDom==null ){
			parent.$.dialog({title: '提示', content:"模块关联分类为空", icon: 'error.gif',lock:true ,ok: '确定'});
			return false;
		}
		$.each(newDom,function(index,item){
			var obj={};
			obj['id']=$(item).attr("data-id");
			obj['ntype']=$(item).attr("data-ntype");//data-ntype0分类1文章2自定义
			obj['name']=$(item).text();// 
			obj['ntype']=$(item).attr("data-ntype");//data-ntype0分类1文章2自定义
			obj['info']=$("#domid_" + $(item).attr("data-id")).attr('data-info');//是否需要查询文章0否1是
			if(obj['ntype']==2){
				obj['icon']=$(item).attr("data-icon");//自定义icon
				obj['img']=$(item).attr("data-img");//自定义img
				obj['link']=$(item).attr("data-link");//自定义链接
			}
			data.push(obj); 
		})
	    params['data']=JSON.stringify(data);
		params['templateKey']=$("#templateKey").val();
		params['moduleKey']=$("#moduleKey").val();
		params['id']=$("#id").val();
	
		
		//保存内容
		$.post("/schoolTemplate/manage/saveModuleInfo",params,function(res){
			if(res.success) {
	             parent.$.dialog({title: '提示', content: "操作成功", icon: 'success.gif',lock:true ,ok: '确定'});
	         }else {
	        	 parent.$.dialog({title: '提示', content: res.message, icon: 'error.gif',lock:true, ok: '确定'});
	         }
		},"json");
	
	})
	//右侧tab操作
  $('#editable li a').click(function (e) {
			  e.preventDefault();
			  var id = $(this).attr('data-id');
			  if($("#domid_"+id).attr("data-info")){
				  //查询文章列表
				  loadInfolist(id);
			  }
			  $(this).tab('show');
		})
 
	//选择自定义图标
    $('#catIconInput').click(function(){
//      $.showCommonEditDialog("/infoCat/chooseCatIcon","选择分类图标",450,300);
    $.dialog({
          id : 'chooseCatIcon',
          lock: true,
          title : '选择分类图标',
          content : "url:/infoCat/chooseCatIcon",
          width: 450,
          height: 600,
          drag: true,
          resize: true,
          icon: 'alert.gif'
      });
  });
//自定义项确认
	$("#zdySubmitBtn").click(function(){
	
		var name = $.trim($("#name").val());
		var link = $.trim($("#link").val());
		var icon = $.trim($('#icon').val());
		var img = $.trim($('#imgUrl').val());
		if( !name){
			 parent.$.dialog({title: '提示', content: "请输入名称", icon: 'error.gif',lock:true ,ok: '确定'});	
		}
		if( !link){
			 parent.$.dialog({title: '提示', content: "请输入链接地址", icon: 'error.gif',lock:true ,ok: '确定'});	
		}
		//判断当前分类数量是否超出
		  if(maxItems()){
			return false;  
		  };
		  $(".file-drop-zone-title").remove();
		  var newDom=$("#editable li[class*=active]");
		  if(newDom && newDom.hasClass('active')){
			  newDom.removeClass("active");  
		  }
		  var diveDom=$("#myTabContent div[class*=active]");
		  if(diveDom && diveDom.hasClass('active')){
			  diveDom.removeClass("active");  
		  }
		  if(isAppear(name)){
			$("#editable li:last").addClass("active");  
			 return false;
		  };//判断当前追加节点是否重复
		  var domId = (+ new Date()).toString(32);
		  $("#editable").append('<li class="item-orange active" domId="" ><a href="#' + domId + '" data-ntype="2"  data-link="' + link + '" data-icon="' + icon + '" data-img="' + img + '" >' +name+ '</a><i class="js-remove">✖</i></li>');
		  $("#myTabContent").append('<div class="tab-pane fade in active" id="' + domId + '" data-info="0"></div>');
			//右侧tab操作
		  $('#editable li a').click(function (e) {
					  e.preventDefault();
					  $(this).tab('show');
		 })
	})
});
  //加载模板维护内容
  function loadModule(){
	var templateKey=$("#templateKey").val();
	var moduleKey=$("#moduleKey").val();
		//加载当前模块维护后的内容
		$.post("/schoolTemplate/manage/getModuleInfo",{templateKey:templateKey,moduleKey:moduleKey},function(res){
			 if(res.success) {
				 if(!res.data)return;
				 $("#id").val(res.data.id);
				 var data = eval("(" + res.data.data + ")");
				 if(data){
				 $(".file-drop-zone-title").remove();
				  $.each(data,function(index,item){
					  var active = index == 0 ? 'in active' : '';
					  var domName=item.name;
					  if(item.ntype==0){//分类
						  var catid = item.id;
						  var node = zTreeObj.getNodeByParam("id",catid);
						  var isParent=node.isParent;
					      var nodes= isParent ? node.children : node;
						  appContont(isParent,true,catid,domName,nodes,active);
					  }
	                  if(item.ntype==2){//自定义
	                	  var domId = (+ new Date()).toString(32);
	    				  $("#editable").append('<li class="item-orange ' + active +' " domId="" ><a href="#' + domId + '" data-ntype="2" data-link="' + item.link + '" data-icon="' + item.icon + '" data-img="' + item.img + '" >' + domName + ' </a><i class="js-remove">✖</i></li>');
	    				  $("#myTabContent").append('<div class="tab-pane fade ' + active +'" id="' + domId + '" data-info="0"></div>');  
	    					//右侧tab操作
	    				  $('#editable li a').click(function (e) {
	    							  e.preventDefault();
	    							  var id = $(this).attr('data-id');
	    							  if($("#domid_"+id).attr("data-info")){
	    								  //查询文章列表
	    								  loadInfolist(id);
	    							  }
	    							  $(this).tab('show');
	    				 })
	                  }
				  }) 
				 }
	         }else{
	        	 alert("服务异常，"+res.message);
	         }
		},"json")
	  
  }
  //选择图标回调
  function getCatIcon(iconUrl){
      $('#catIcon').attr("class","iconfont w3-text-theme " + iconUrl);
      $('#icon').val(iconUrl);
      $('#delIcon').show();
  }
function addDiyDom(treeId, treeNode) {
	var aObj = $("#" + treeNode.tId + "_a");
	var editStr ='';
	var nodeid = treeNode.id;
	if ($("#paBtn_"+treeNode.id).length>0) return;
	if(treeNode.isParent){
	    editStr+= "<a type='button edit' class='diyBtn1' id='paBtn_" + nodeid
		+ "' title='关联当前类' onfocus='this.blur();'><i class='ace-icon fa fa-external-link'></i></a>";
		editStr+="<a type='button' class='diyBtn1' id='chBtn_" + nodeid
		+ "' title='关联子类' onfocus='this.blur();'><i class='ace-icon fa fa-external-link orange'></i></a>";
		editStr+= "<a type='button edit' class='diyBtn1' id='catBtn_" + nodeid
		+ "' title='新增子类' onfocus='this.blur();'>+</a>";
	}else if(treeNode.level==0){
		editStr+= "<a type='button edit' class='diyBtn1' id='catBtn_" + nodeid
		+ "' title='新增子类' onfocus='this.blur();'>+</a>";
	}
	if(!treeNode.isParent){
		editStr +="<a type='button edit' class='diyBtn1' id='infoBtn_" + nodeid
		+ "' title='发布文章' onfocus='this.blur();'><i class='ace-icon fa fa-book'></i></a>";	
	}
	aObj.append(editStr);
	var btn = $("#paBtn_"+nodeid);//关联当前类
	if (btn) btn.bind("click", function(e){
		var flag=true;
		MoveTest.dropTree2Dom(e, treeId, treeNode,null,null,flag);
	});
	var chBtn_ = $("#chBtn_"+nodeid);//关联子类
	if (chBtn_) chBtn_.bind("click", function(e){
		var flag=false;
		MoveTest.dropTree2Dom(e, treeId, treeNode,null,null,flag);
	});
	var infoBtn_ = $("#infoBtn_"+nodeid);//文章发布
	if (infoBtn_) infoBtn_.bind("click", function(e){
		create(nodeid);
	});
	var catBtn_ = $("#catBtn_"+nodeid);//新增子类
	if (catBtn_) catBtn_.bind("click", function(e){
		createChildCat(nodeid);
	});
};
//判断当前对象是否存在
function isexists(domId){

	var newDom = $("li[domId=domid_" + domId + "]");
	if( newDom.length > 0){
		 var id = $("li[domId=domid_" + domId + "] a").attr('domid');
		  if($("#domid_"+id).attr("data-info")){
			  //查询文章列表
			  loadInfolist(id);
		  }
		$("li[domId=domid_" + domId + "] a").tab('show');
		return true;
	}
	 
	return false;
}
//判断对象是否重复
function isAppear(name){
	var flag=false;
	  var nodes = $("#editable li a");//判断是否重复
      $.each(nodes,function(idx,item){
    	 if(item.innerText == name){
    		 flag=true;
    	 }
      })
   return flag;
}
//判断当前分类数量是否超出
function maxItems(){
	var newDom = $("li[domId*=domid]");
	if(newDom && newDom.length == MoveTest.higherLevelNum){
		 parent.$.dialog({title: '提示', content: "分类数量不能超出模板数量", icon: 'error.gif',lock:true ,ok: '确定'});
		return true;
	}	
	return false;	
}
//加载分类信息
function appContont(isParent,flag,domId,domName,nodes,active){
	  var moduleType =$("#moduleType").val();
	  $(".file-drop-zone-title").remove();
	  if(isParent){//当前对象为父类
	    	var content='';
	    	//if(MoveTest.lowerLevelNum || (moduleType==2||moduleType=="2")){//分类—文章类型加载子列表
	    		if(flag){//关联当前类
	    			if(isexists(domId)) return;
	    			for(var i=0;i< nodes.length;i++){
	    				content+='<li class="item-orange clearfix ui-sortable-handle" data-ntype="0" data-id="' + nodes[i].id + '">' + nodes[i].name + '</li>';
	    			}
	    			//判断当前分类数量是否超出
	    			if(maxItems()) return;
	    			$("#editable").append('<li class="item-orange '+active+'" domId="domid_' + domId + '"><a href="#domid_' + domId + '" data-id="' + domId + '"  data-ntype="0">'+ domName +'</a><i class="js-remove">✖</i></li>');
	    			if(moduleType==2||moduleType=="2"){
	    				$("#myTabContent").append('<div class="tab-pane fade '+active+'"  id="domid_' + domId + '" data-info="0"><ul id="drag_' + domId + '" class="item-list">'+content+'</ul></div>');
	    			}
	    			//初始列表拖动效果
	    			Sortable.create(document.getElementById("drag_" + domId), {
	    				animation: 150,
	    				filter: '.js-remove',
	    				onFilter: function (evt) {
	    				},
	    				onEnd: function(evt){ SortableonEnd(evt.item);}
	    			});
	    		}else{//关联当前子类
	    			var childcont="";
	    			for(var i=0;i< nodes.length;i++){
	    				var childcontent = '';
	    				if(! isexists(nodes[i].id)){
	    					//判断当前分类数量是否超出
	    					if(maxItems()) return;
	    					$("#editable").append('<li class="item-orange '+(i==0 ? active:'')+'"  domId="domid_' + nodes[i].id + '" ><a href="#domid_' + nodes[i].id + '" data-id="' + nodes[i].id + '" data-ntype="0">'+ nodes[i].name +'</a><i class="js-remove">✖</i></li>');
	    					//判断当前对象是否为父类节点
	    					if(nodes[i].isParent){
	    						var childNodes=	nodes[i].children;
	    						for(var j=0;j<childNodes.length;j++){
	    							childcontent+='<li class="item-orange clearfix ui-sortable-handle" data-id="' + childNodes[j].id + '" data-ntype="0">' + childNodes[j].name + '</li>'; 
	    						}
	    						if(moduleType==2||moduleType=="2"){
	    							$("#myTabContent").append('<div class="tab-pane fade '+(i==0 ? active:'')+'"  id="domid_' + nodes[i].id + '" data-info="0" ><ul  class="item-list" id="drag_' + nodes[i].id + '" >'+ childcontent +'</ul></div>');
	    						}
	    						// 初始列表拖动效果
	    						Sortable.create(document.getElementById("drag_" + nodes[i].id), {
	    							animation: 150,
	    							filter: '.js-remove',
	    							onFilter: function (evt) {
	    							},
	    							onEnd: function(evt){ SortableonEnd(evt.item);}
	    						});
	    						
	    					}else{
	    						var myTabContent ='<a class="btn btn-sm btn-primary" onclick="create('+ nodes[i].id +')" >发布文章</a><div class="row data-table"><div class="col-xs-12"><table id="table-data-list' + nodes[i].id + '"></table><div id="table-data-list-pager' + nodes[i].id + '"></div></div></div>';
	    						if(moduleType==2||moduleType=="2"){
	    							$("#myTabContent").append('<div class="tab-pane fade '+(i==0 ? active:'')+'" id="domid_' + nodes[i].id + '" data-info="1">'+ myTabContent +'</div>');
	    							if(i==0 && active && active.indexOf('in')>=0){
	    								loadInfolist( nodes[i].id );	
	    							}
	    						}
	    					}
	    					
	    				}
	    			}
	    			
	    		}
	    /*	}else{//单个标题跳转
	    		if(isexists(domId)) return;
    			//判断当前分类数量是否超出
    			if(maxItems()) return;
    			$("#editable").append('<li class="item-orange '+active+'" domId="domid_' + domId + '"><a href="#domid_' + domId + '" data-id="' + domId + '"  data-ntype="0">'+ domName +'</a><i class="js-remove">✖</i></li>');	
	    	}*/
	    }else{
	      if(isexists(domId)) return;
	      //判断当前分类数量是否超出
	      if(maxItems()) return;
	      $("#editable").append('<li class="item-orange '+active+'"  domId="domid_' + domId + '" ><a href="#domid_' + domId + '" data-id="' + domId + '" data-ntype="0">'+ domName +'</a><i class="js-remove">✖</i></li>');
	      var myTabContent ='<a class="btn btn-sm btn-primary" onclick="create('+ domId +')" >发布文章</a><div class="row data-table"><div class="col-xs-12"><table id="table-data-list' + domId + '"></table><div id="table-data-list-pager' + domId + '"></div></div></div>';
	      if(moduleType==2||moduleType=="2"){
	    	  $("#myTabContent").append('<div class="tab-pane fade '+active+'" id="domid_' + domId + '" data-info="1" >'+myTabContent+'</div>');
	    	  if( active.indexOf('in')>=0){
	    		  loadInfolist(domId);	
	    	  }
	      }
	    }
	  
	  $('#editable li a').click(function (e) {
			  e.preventDefault();
			  var id = $(this).attr('data-id');
			  if($("#domid_"+id).attr("data-info")){
				  //查询文章列表
				  loadInfolist(id);
			  }
			  $(this).tab('show');
		})
	
}

//加载文章列表
function loadInfolist(domId){
	infoContentFacade.domid=domId;
	infoContentFacade.loadDetails("catId="+domId);
}
//文章置顶操作
function toTop(infoId,catId,sortNum,isInCat){
	$.post("/infoContent/updateInfoSort",{id:infoId,catId:catId,sortNum:sortNum,targetSort:0,isInCat:isInCat},function(res){
		 if(res.success) {
             parent.$.dialog({title: '提示', content: "操作成功", icon: 'success.gif',lock:true ,ok: '确定'});
             loadInfolist(catId);
         }else {
        	 parent.$.dialog({title: '提示', content: res.message, icon: 'error.gif',lock:true, ok: '确定'});
         }
	},"json")
}
//文章编辑
var editDialog;
function showCommonEditDialog(id, url, title, width, height){
    editDialog = parent.$.dialog({
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
//文章发布
function create(catId){
    editDialog = showCommonEditDialog(-1,"/infoContent/addOrUpdate?catId=" + catId,"发布信息",1085,580);
}
//父级节点新增子类
function createChildCat(catId){
	showCommonEditDialog(-1,"/infoCat/addOrUpdate?parentCatId="+catId,"新增",450,450);
}
//子类顺拖动修改
function SortableonEnd(item){
	var targetId = $(item).prev().attr('data-id') ? $(item).prev().attr('data-id'):0;
	var sortId = $(item).attr('data-id'); 
	if(targetId != sortId){
			$.post("/infoCat/updateCatSort",{targetId:targetId,sortId:sortId},function(res){
				 if(res.success) {
					if($("#editable li[class*=active]").find('a')){
						var parentId=$("#editable li[class*=active]").find('a').attr('data-id');
						refreshNode(parentId);
					}
		         }else {
		        	 parent.$.dialog({title: '提示', content: res.message, icon: 'error.gif',lock:true, ok: '确定'});
		         }
			},"json")
	 }
}
/** 
 * 刷新当前父节点 
 */  
function refreshNode(id) {  
	if(id){
		/*根据 treeId 获取 zTree 对象*/  
		var type = "refresh",silent = false; 
		/*强行异步加载父节点的子节点。[setting.async.enable = true 时有效]*/  
		var parentNode = zTreeObj.getNodeByParam('id',id);  
		/*选中指定节点*/  
		zTreeObj.selectNode(parentNode);  
		zTreeObj.reAsyncChildNodes(parentNode, type, silent); 
	}
}  