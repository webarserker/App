var schoolFacade = {
    detailsGrid: null, // 数据详情
    url : '/school/findSchool',
    query : function() {
        var queryString = schoolFacade.getParams();
        if(!queryString) {
        	return false;
        }
        $('#data-list').show();
        // 加载详情
        schoolFacade.loadDetails(queryString);
    },
    getParams : function() {
        return $("form").serialize();
    },
    goNext : function(sCode, name){
        window.parent.toPage('/schoolPic/toSchoolBgPage?sCode=" + sCode', "背景图片_"+name, sCode);
    },
    // 加载数据详情
    loadDetails : function(params) {
        var _this = this;
        var grid_selector = "#table-data-list";
        var pager_selector = "#table-data-list-pager";
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : schoolFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : schoolFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID', '学校名称', '学校CODE','学校标识','招录类型','状态' ,'审核方式' , '审核人数' /*, '修改人'*/,'操作'],
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
                    width : 30
                }, {
                    name : 'name'
                },{
                    name : 'code'
                },{
                    name : 'identify',
                    formatter : function(cellvalue, options, rowObject) {
                        var url = "/"+cellvalue
                        return "<a href='"+url+"' target='_blank'>"+cellvalue+"</a>"
                    }
                },{
                    name : 'isPostGraduate',
                    formatter : function(cellvalue, options, rowObject) {
                        return cellvalue==0?'高考招录':'研究生招录';
                    }
                },{
                    name : 'status',
                    formatter : function(cellvalue, options, rowObject) {
                        if(cellvalue == 10){
                            return "即将上线";
                        }else if(cellvalue == 20){
                            return "已经上线";
                        }else{
                            return "";
                        }
                    }
                }, {
                    name : 'examineType',
                    formatter : function(cellvalue, options, rowObject) {
                        if(cellvalue == 0){
                            return '无须审核';
                        }else if(cellvalue == 1){
                            return '单人审核';
                        }else if(cellvalue == 2){
                            return '联合审核';
                        }
                    }

                }, {
                    name : 'examineNum',
                    align :'center'
                }, /*{
                    name : 'modifyTime',
                    formatter : function(cellvalue, options, rowObject) {
                        return rowObject.modifier + $.dateFormat(cellvalue,"yyyy-MM-dd hh:mm:ss")
                    },
                    align:'center'
                },*/ {
                    name : "id",
                    align :'left',
                    width : 320,
                    formatter : function(cellvalue, options, rowObject) {
                        var wdSystem = "开通分答系统";
                    	if(rowObject.isOpenFD == 1){
                    	    wdSystem = "关闭分答系统";
                    	}
                    	var operWeixinAdmin = "开通招办移动端";
                    	if(rowObject.isAccessWeixinAdmin == 1){
                            operWeixinAdmin = "关闭招办移动端";
                        }
                        var retVal = '<div class="hidden-sm hidden-xs btn-group">';
                        retVal += '<button class="btn btn-xs btn-info" onclick="edit(\''+rowObject.id+'\')">修改 </button>' +
                       '<button class="btn btn-xs btn-danger" onclick="deleteSchool('+rowObject.id+')"> 删除 </button> '+
                            '<button class="btn btn-xs btn-warning" onclick="restPassword(\''+rowObject.code+'\')">重置密码</button>'+
                            '<button class="btn btn-xs btn-success" onclick="goSchoolMenu(\''+rowObject.code+'\', \''+rowObject.name+'\')">分配菜单</button>'+
                            '<button class="btn btn-xs btn-primary" onclick="wxqrcode(\''+rowObject.identify+'\')">微信二维码</button>'+
                            '<button class="btn btn-xs btn-info" onclick="openWdsystem('+rowObject.id+','+rowObject.isOpenFD+',\''+rowObject.code+'\')">'+wdSystem+'</button>'+
                            '<button class="btn btn-xs btn-success" onclick="switchAccessWeixinAdmin('+rowObject.isAccessWeixinAdmin+',\''+rowObject.code+'\')">'+operWeixinAdmin+'</button>'+
                            '</div>';
                        return retVal;
                    }
                }],
                rowNum : 10,
                rowList : [ 10, 30, 50 ],
                pager : pager_selector,
                pagerpos : 'left',
                viewrecords : true,
                height : 'auto',
                loadComplete : function() {
                    var table = this;
                    setTimeout(function() {
                        updatePagerIcons(table);
                        $.removeScrollX('#data-list');
                    }, 0);
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    }
}
function edit(id){
	$.showCommonEditDialog("/school/toEdit?id=" + id,"修改学校",650,550);
}

/**
 * 开通/关闭高校招办移动端
 *  * */
function switchAccessWeixinAdmin(flag,sCode){
    flag = flag == 1 ? 0 : 1;
    $.ajax({
        type: "POST",
        url: "/school/switchAccessWeixinAdmin",
        data:{isAccessWeixinAdmin:flag,sCode:sCode}
    }).done(function (data) {
        if (data.code == '000000') {
            $.dialog({title: '提示', content: "操作成功", icon: 'success.gif',lock:true ,ok: '确定'});
            schoolFacade.query();
        } else {
            $.dialog({title: '提示', content: data.message || "操作失败", icon: 'error.gif',lock:true, ok: '确定'});
        }
    })
}


/**
 * 开通分答系统
 *  * */
function openWdsystem(id,flag,sCode){
    flag = flag == 1 ? 0 : 1;
    if(!id){
        $.dialog({title: '提示', content: "请选择操作记录", icon: 'success.gif',lock:true ,ok: '确定'});
        return;
    }
    $.ajax({
        type: "POST",
        url: "/school/openWdsystem",
        data:{id:id,isOpenFD:flag,sCode:sCode}
    }).done(function (data) {
        if (data.success) {
            $.dialog({title: '提示', content: data.msg, icon: 'success.gif',lock:true ,ok: '确定'});
            schoolFacade.query();
        } else {
            $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
        }
    })
}
/**
 * 生产微信二维码
 * @param scode
 */
function wxqrcode(identify){
	$.ajax({
        type: "POST",
        url: "/school/wxqrcode",
        data: {"identify":identify}
    }).done(function (data) {
        if (data.success) {
            $.dialog({title: '提示', content: "二维生产成功", icon: 'success.gif',lock:true ,ok: '确定'});
            window.open(data.url,"_blank");
        } else {
            $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
        }
    }).always(function () {
        //$("#submitBtn").removeClass("disabled");
    });
}
/**
 * 跳转到学校菜单分配页面
 * @param scode
 */
function goSchoolMenu(scode, name){
	//window.location.href="/schoolMenu/toList?scode="+scode;
    window.parent.toPage("/schoolMenu/toList?scode="+scode, "分配菜单_"+name, scode);
}
/**
 * 重置用户密码
 */
function restPassword(scode){
	bootbox.confirm("您确定重置该用户密码?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/user/restSchoolAdminPassword",
                data: "scode="+scode
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
function deleteSchool(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/school/delete",
                data: "id="+id
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    schoolFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}

function addSchool(){
    $.showCommonEditDialog("/school/toAdd","新增学校",650,550);
}

$(function() {
    schoolFacade.query();
    $("#searchBtn").click(schoolFacade.query);

    $("#addBtn").click(function(){
        addSchool()
    });
});