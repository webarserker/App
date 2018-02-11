var faqFacade = {
    detailsGrid: null, // 数据详情
    url : '/answerlog/findAnsweringLog',
    query : function() {
        var queryString = faqFacade.getParams();
        if(!queryString) {
        	return false;
        }
        $('#data-list').show();
        // 加载详情
        faqFacade.loadDetails(queryString);
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
                url : faqFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : faqFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID','提问人', 'forwordUser','provinceName','scienceClass','score','sourceType','问题', '答案' , '处理类型' , '处理人', '状态','意见','处理时间','操作'],
                jsonReader : {  
                    root: "data",  
                    page: "curPage",  
                    total: "totalPage",  
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                colModel : [{
                	name:'id',
                	width:80
                }, {
                    name : 'forwordUserName',
                    cellattr: function (rowId, val, rawObject, cm, rdata) {
                    	var title = 'title="生源地：';
                    	if(rawObject.provinceName && rawObject.provinceName != null){
                    		title += rawObject.provinceName;
                    	}
                    	if(rawObject.scienceClass && rawObject.scienceClass != null){
                    		title += ',科类：'+rawObject.scienceClass;
                    	}
                    	if(rawObject.score && rawObject.score != null){
                    		title += ',分数：'+rawObject.score;
                    	}
                    	if(rawObject.sourceType && rawObject.sourceType != null){
                    		title += ',考生类型：'+rawObject.sourceType;
                    	}
                	   return title+'"';
                    },
                    align :'center',
                    formatter : function(cellvalue, options, rowObject) {
                    	if(cellvalue && cellvalue.length > 15){
                    		return cellvalue.substring(0,10) + "...";
                    	}else{
                    		return cellvalue;
                    	}
                    },
                    width : 90
                },{
                    name : 'forwordUser',
                    hidden:true
                },{
                    name : 'provinceName',
                    hidden:true
                },{
                    name : 'scienceClass',
                    hidden:true
                },{
                    name : 'score',
                    hidden:true
                },{
                    name : 'sourceType',
                    hidden:true
                }, {
                    name : 'question'
                }, {
                    name : 'answer'
                }, {
                    name : 'isArtificial',
                    align :'center',
                    width : 60,
                    formatter : function(cellvalue, options, rowObject) {
                       if(cellvalue == 0){
                           return 'PC端智能';
                       }else if(cellvalue == 1){
                           return 'PC端人工';
                       }else if(cellvalue == 2){
                           return '微信端智能';
                       }else if(cellvalue == 3){
                           return '微信端人工';
                       }
                    }
                }, {
                    name : 'answerUserName',
                    formatter : function(cellvalue, options, rowObject) {
                        if(cellvalue){
                            return cellvalue;
                        }else {
                            return '暂未受理';
                        }
                    }
                },  {
                    name : 'status',
                    align :'center',
                    width : 60,
                    formatter : function(cellvalue, options, rowObject) {
                        if(cellvalue == -1){
                            return "已为FAQ";
                        }else if(cellvalue == 0){
                            return '已回答';
                        }else if(cellvalue == 1){
                            return '待处理';
                        }else if(cellvalue == 2){
                            return '审核中';
                        }else if(cellvalue == 4){
                            return '审核拒绝';
                        }
                    }
                }, {
                    name : 'remark'
                },{
                    name : 'modifyTime',
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(rowObject.modifyTime,"yyyy-MM-dd hh:mm:ss")
                    },
                    width :120,
                    align:'center'
                }, {
                    name : "id",
                    align :'center',
                    width :130,
                    formatter : function(cellvalue, options, rowObject) {
                    	var retVal = '';
                        //人工回答的可以设置为常用问题
                        if($("#type").val() == 0 && rowObject.status == 0 && (rowObject.isArtificial == 1 || rowObject.isArtificial ==3)){
                        	retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="addFaq('+rowObject.id+')">设为常用问题</button>';
                        	retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="$.showCommonEditDialog(\'/answerlog/toUpdate?id='+rowObject.id+'\',\'修改答复\',600,300);">修改答复</button>';
                        }
                        if($("#type").val() == 1){
                            retVal =  ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="$.showCommonEditDialog(\'/answerlog/toAnswer?id='+rowObject.id+'\',\'回答\',600,300);">回答</button>';
                                retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="$.showCommonEditDialog(\'/answerlog/toCusList?id='+rowObject.id+'\',\'找专家\',350,100);">找专家</button>';
                            if($("#examineType").val() != -1){   //需要审核的
                                retVal += '<button class="btn btn-minier btn-white btn-default btn-bold" onclick="submit('+rowObject.id+',\'/answerlog/submit\',\'提交审核\');">提交审核</button>';
                            }
                        }
                        if($("#type").val() == 2){
                            retVal +=  ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="$.showCommonEditDialog(\'/answerlog/toExamine?id='+rowObject.id+'\',\'审核\',600,300);">审核</button>';
                        }
                        if($("#type").val() == 3){
                            retVal +=  ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="receive('+rowObject.id+',\'/answerlog/receive\',\'认领\');">认领</button>';
                        }
                        if(rowObject.status == 0 || rowObject.status == -1){
                        	retVal += '<button class="btn btn-minier btn-white btn-default btn-bold" onclick="sendMsg('+rowObject.forwordUser+');">发送回访消息</button>';
                        }
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
function sendMsg(userid){
	$.showCommonEditDialog("/msg/toSendMsg?id="+userid,"发送消息",600,300)
}

/**
 * 提交审核
 * @param id
 * @param url
 * @param text
 */
function submit(id,url,text){
    bootbox.confirm("确定"+text+"该问题?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url:  url,
                data: "id="+id
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "操作成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    faqFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
            });
        }
    });
}

/**
 * 认领问题
 * @param id
 * @param url
 * @param text
 */
function receive(id,url,text){
    bootbox.confirm("确定"+text+"该问题?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url:  url,
                data: "id="+id
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "操作成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    $("#type").val("1")//认领后，跳转到待处理问题中
                    $(".active").html("待处理问题")
                    faqFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
            });
        }
    });
}
/**
 * 去除catId，给默认值
 * @param id
 */
function addFaq(id){
	$.ajax({
        type: "POST",
        url: "/answerlog/choiceCat",
        data: {'id':id,'catId':0}
    }).done(function (data) {
        if (data.success) {
            $.dialog({title: '提示', content: "操作成功", icon: 'success.gif',lock:true ,ok: '确定'});
            faqFacade.query();
        } else {
        	$.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
        }
    })
}


$(function() {
    faqFacade.query();
    $("#searchBtn").click(faqFacade.query);

    $("#submitBtn").click(function(){
        addFaq()
    });
});