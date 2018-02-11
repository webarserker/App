var switchFacade = {
    detailsGrid: null, // 数据详情
    url : '/switch/findList',
    query : function() {
        var queryString = switchFacade.getParams();
        if(!queryString) {
        	return false;
        }
        $('#data-list').show();
        // 加载详情
        switchFacade.loadDetails(queryString);
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
                url : switchFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : switchFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID', '生源地','开关', '修改时间', '修改人' , '操作'],
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
                    width : 50
                }, {
                    name : 'cityName',
                    align:'center'
                },  {
                    name : 'status',
                    formatter : function(cellvalue, options, rowObject) {
                        if(cellvalue == '0'){
                            return "关闭";
                        }else if(cellvalue == '1'){
                            return "打开";
                        }
                    },
                    align:'center'
                }, {
                    name : 'modifyTime',
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(cellvalue,"yyyy-MM-dd hh:mm:ss")
                    },
                    align:'center'
                }, {
                    name : 'modifier',
                    align :'center'
                }, {
                    name : "id",
                    align :'center',
                    width :100,
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = '<div class="hidden-sm hidden-xs btn-group">';
                        if(rowObject.status == '0'){
                            retVal += '<button class="btn btn-xs btn-info" onclick="update('+rowObject.id+',1,\'打开\')"> <i class="ace-icon fa fa-pencil bigger-120">打开</i> </button> </div>';
                        }else if(rowObject.status == '1'){
                            retVal += '<button class="btn btn-xs btn-info" onclick="update('+rowObject.id+',0,\'关闭\')"> <i class="ace-icon fa fa-pencil bigger-120">关闭</i> </button> </div>';
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

function update(id,status,text){
    bootbox.confirm("您确定"+text+"该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/switch/save",
                data: "id="+id+"&status="+status
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: text+"成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    switchFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}

$(function() {
    switchFacade.query();
    $("#searchBtn").click(switchFacade.query);
    $("#init").click(function(){
        initSwitch();
    });
    $("#open").click(function() {
        updateAll("1","打开")
    });
    $("#close").click(function() {
        updateAll("0","关闭")
    });
});

function updateAll(status,text){
    bootbox.confirm("您确定"+text+"全部开关?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/switch/updateAll",
                data: "status="+status
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: text+"成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    switchFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}

function initSwitch(){
    bootbox.confirm("您确定初始化数据?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/switch/init",
                data: ""
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "初始化成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    switchFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}