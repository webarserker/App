var userFacade = {
    detailsGrid: null, // 数据详情
    url : '/user/findUser',
    query : function() {
        var queryString = userFacade.getParams();
        if(!queryString) {
        	return false;
        }
        // 加载详情
        userFacade.loadDetails(queryString);
    },
    getParams : function() {
        return $("#userForm").serialize();
    },
    // 加载数据详情
    loadDetails : function(params) {
        var _this = this;
        var grid_selector = "#table-data-list";
        var pager_selector = "#table-data-list-pager";
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : userFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : userFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID', '用户名', '真实姓名', '联系方式','客服类型','账号级别','问题处理','审核权限','状态','修改人','操作'],
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
                    name : 'cusLevel',
                    align:'center',
                    formatter : function(cellvalue, options, rowObject) {
                        if(cellvalue == 0){
                            return "非客服";
                        }else if(cellvalue == 1){
                            return "普通";
                        }else if(cellvalue == 2){
                            return "专家";
                        }
                    },
                    width : 90
                }, {
                    name : 'dataLevel',
                    align:'left',
                    formatter : function(cellvalue, options, rowObject) {
                        if(cellvalue == 1){
                            return "一级账号";
                        }else if(cellvalue == 2){
                            return "二级账号";
                        }else if(cellvalue == 3){
                            return "三级账号";
                        }else if(cellvalue == -1){
                            return "系统管理员";
                        }
                    },
                    width : 90
                }, {
                    name : 'isHandling',
                    align:'left',
                    formatter : function(cellvalue, options, rowObject) {
                        var text = "是否处理问题：";
                        if(rowObject.isHandling == 0){
                            text+="否";
                        }else if(rowObject.isHandling == 1){
                            text+="是";
                        }
                        text += "<br>最大处理数量："+rowObject.handlingNum;
                        return text;
                    },
                }, {
                    name : 'hasApprove',
                    align:'center',
                    formatter : function(cellvalue, options, rowObject) {
                        if(cellvalue == 0){
                            return "否";
                        }else if(cellvalue == 1){
                            return "是";
                        }
                    },
                    width : 90
                },{
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
                }, {
                    name : 'checkUser',
                    align:'left',
                    formatter : function(cellvalue, options, rowObject) {
                        return (rowObject.checkUser?rowObject.checkUser:'')+"<br/>" + $.dateFormat(new Date(rowObject.checkTime),"yyyy-MM-dd hh:mm:ss");
                    }
                }, {
                    name : "id",
                    title:false,
                    formatter : function(cellvalue, options, rowObject) {
                    	var userDataLevel = $("#userDataLevel").val();
                        var retVal = ' <button class="btn btn-minier btn-primary btn-bold" onclick="$.showCommonEditDialog(\'/user/toUpdate?id='+rowObject.id+'\',\'修改\',600,500);">修改</button>';
                        retVal += ' <button class="btn btn-minier btn-info btn-bold" onclick="deleteUser('+rowObject.id+');">删除</button>';
                        retVal += ' <button class="btn btn-minier btn-success btn-bold" ';
                        if(rowObject.status == 1){
                            retVal +='onclick="updateStatus('+rowObject.id+',\'禁用\',2);">禁用';
                        }else{
                            retVal +='onclick="updateStatus('+rowObject.id+',\'启用\',1);">启用';
                        }
                        retVal += '</button>';
                        if(userDataLevel == 1){
                        	//1级账号可以重置用户密码
                        	retVal += ' <button class="btn btn-minier btn-warning btn-bold" onclick="restPassword('+rowObject.id+');">重置密码</button>';
                        }
                        if(rowObject.wxOpenid!=null&&rowObject.wxOpenid!='null'&&rowObject.wxOpenid!=''){
                        	retVal += '<button class="btn btn-minier btn-danger btn-bold" onclick="wxdelBind(\''+rowObject.id+'\')">解除绑定</button>';
                        }else{
                        	retVal += '<button class="btn btn-minier btn-danger btn-bold" onclick="wxqrcode(\''+rowObject.id+'\',\''+rowObject.loginName+'\')">绑定微信</button>';
                        }
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
    }
}
var checkFacade = {
	    detailsGrid: null, // 数据详情
	    url : '/user/findUser',
	    query : function() {
	        var queryString = checkFacade.getParams();
	        if(!queryString) {
	        	return false;
	        }
	        // 加载详情
	        checkFacade.loadDetails(queryString);
	    },
	    getParams : function() {
	        return $("#checkForm").serialize();
	    },
	    // 加载数据详情
	    loadDetails : function(params) {
	        var _this = this;
	        var grid_selector = "#table-check-list";
	        var pager_selector = "#table-check-list-pager";
	        if(_this.detailsGrid) {
	            // 根据搜索条件，重新加载
	            $(grid_selector).jqGrid('setGridParam',{
	                url : checkFacade.url+'?'+params,
	                page:1 
	            }).trigger("reloadGrid");
	        } else {
	            // 首次加载
	            _this.detailsGrid = $(grid_selector).jqGrid({
	                url : checkFacade.url+'?'+params,
	                datatype : 'json',
	                colNames : ['ID', '用户名', '真实姓名', '联系方式','客服类型','账号级别','问题处理','审核状态','拒绝理由','审核人','操作'],
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
	                    name : 'cusLevel',
	                    align:'center',
	                    formatter : function(cellvalue, options, rowObject) {
	                        if(cellvalue == 0){
	                            return "非客服";
	                        }else if(cellvalue == 1){
	                            return "普通";
	                        }else if(cellvalue == 2){
	                            return "专家";
	                        }
	                    },
	                    width : 90
	                }, {
	                    name : 'dataLevel',
	                    align:'left',
	                    formatter : function(cellvalue, options, rowObject) {
	                        if(cellvalue == 1){
	                            return "一级账号";
	                        }else if(cellvalue == 2){
	                            return "二级账号";
	                        }else if(cellvalue == 3){
	                            return "三级账号";
	                        }else if(cellvalue == -1){
	                            return "系统管理员";
	                        }
	                    },
	                    width : 90
	                }, {
	                    name : 'isHandling',
	                    align:'left',
	                    formatter : function(cellvalue, options, rowObject) {
	                        var text = "是否处理问题：";
	                        if(rowObject.isHandling == 0){
	                            text+="否";
	                        }else if(rowObject.isHandling == 1){
	                            text+="是";
	                        }
	                        text += "<br>最大处理数量："+rowObject.handlingNum;
	                        return text;
	                    },
	                }, {
	                    name : 'wxStatus',
	                    align:'center',
	                    formatter : function(cellvalue, options, rowObject) {
	                        if(cellvalue == 0){
	                            return "<font color='red'>待审核</font>";
	                        }else if(cellvalue == 1){
	                            return "<font color='red'>审核通过</font>";
	                        } if(cellvalue == 2){
	                            return "<font color='red'>审核不通过</font>";
	                        }
	                    },
	                    width : 90
	                }, {
	                    name : 'rejectRemark',
	                    align:'center',
	                    width : 90
	                },{
	                    name : 'checkUser',
	                    align:'left',
	                    formatter : function(cellvalue, options, rowObject) {
	                        return rowObject.checkUser?rowObject.checkUser:'' + "<br>" + $.dateFormat(rowObject.checkTime,"yyyy-MM-dd hh:mm:ss");
	                    }
	                }, {
	                    name : "id",
	                    title:false,
	                    formatter : function(cellvalue, options, rowObject) {
	                    	var userDataLevel = $("#userDataLevel").val();
	                        if(userDataLevel == 1 || rowObject.wxStatus == 2||rowObject.wxStatus == 0){
	                        	return '<button class="btn btn-minier btn-danger btn-bold" onclick="$.showCommonEditDialog(\'/user/toCheckWx?id='+rowObject.id+'\',\'\',880,500);">审核</button>';
	                        }
	                        return "";
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
	    }
	}
/**
 * 重置用户密码
 */
function restPassword(id){
	bootbox.confirm("您确定重置该用户密码?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/user/restDefaultPassword",
                data: "id="+id
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: data.msg, icon: 'success.gif',lock:true ,ok: '确定'});
                    userFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}
function deleteUser(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/user/delete",
                data: "id="+id
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    userFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}

function updateStatus(id,text,status){
    bootbox.confirm("您确定"+text+"该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/user/updateStatus",
                data: "id="+id+"&status="+status
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "操作成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    userFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}

function addUser(){
    $.showCommonEditDialog("/user/toAdd","新增用户",600,500);
}
/**
 * 生产微信二维码
 * @param scode
 */
function wxqrcode(identify,username){
	$.ajax({
        type: "POST",
        url: "/user/wxqrcode",
        data: {"id":identify}
    }).done(function (data) {
        if (data.success) {
          //  $.dialog({title: '提示', content: "二维生产成功", icon: 'success.gif',lock:true ,ok: '确定'});
         // $("#tickedImg").attr('src',data.url);
          $("#spnUser").text(username);
          $("#tickedImg").attr('src',data.url);
          $('#modal-img-items').modal("toggle");
        	// window.open(data.url,"_blank");
        } else {
            $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
        }
    }).always(function () {
        //$("#submitBtn").removeClass("disabled");
    });
}
function wxdelBind(id){
	 if(!id){
		 $.dialog({title: '提示', content: "请选择操作记录", icon: 'success.gif',lock:true ,ok: '确定'});
		return; 
	 }
	$.post("/user/backend/weixinDelBind",{id:id},function(data){
		if(data!=null && data.success){
			$.dialog({title: '提示', content: "解除绑定成功", icon: 'success.gif',lock:true ,ok: '确定'});	
			checkFacade.query();
		    userFacade.query();
		}else{
			$.dialog({title: '提示', content: "解除绑定失败", icon: 'success.gif',lock:true ,ok: '确定'});
		}
		$("#delBindBtn").removeClass("disabled");
	},"json")
}
$(function() {
	checkFacade.query();
    userFacade.query();
    $("#searchBtn").click(userFacade.query);

    $("#addBtn").click(function(){
        addUser()
    });
    $('#modal-img-items').on('hidden.bs.modal', function () {
    	checkFacade.query();
	    userFacade.query();
    })
    
    $("#searchCheckBtn").click(checkFacade.query);
});