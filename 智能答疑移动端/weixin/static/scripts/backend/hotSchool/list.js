var hotSchoolFacade = {
    detailsGrid: null, // 数据详情
    url : '/hotSchool/findHotSchool',
    query : function() {
        var queryString = hotSchoolFacade.getParams();
        if(!queryString) {
        	return false;
        }
        $('#data-list').show();
        // 加载详情
        hotSchoolFacade.loadDetails(queryString);
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
                url : hotSchoolFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : hotSchoolFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID', '学校名称', '学校CODE','学校标识','招录类型','热门类型','排序','操作'],
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
                    width : 60
                }, {
                    name : 'name'
                },{
                    name : 'code',
                    align :'center',
                },{
                    name : 'identify',
                    align :'center',
                    formatter : function(cellvalue, options, rowObject) {
                        var url = "/"+cellvalue
                        return "<a href='"+url+"' target='_blank'>"+cellvalue+"</a>"
                    }
                },{
                    name : 'isPostGraduate',
                    align :'center',
                    formatter : function(cellvalue, options, rowObject) {
                        return cellvalue==0?'高考招录':'研究生招录';
                    }
                },{
                    name : 'hotType',
                    align :'center',
                    formatter : function(cellvalue, options, rowObject) {
                        if(cellvalue == 10){
                            return '普通热门';
                        }else if(cellvalue == 20){
                            return '推广热门';
                        }
                    }
                },{
                    name : 'sortNum',
                    align :'center',
                    width : 60
                },{
                    name : "id",
                    align :'center',
                    width : 100,
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = '<div class="hidden-sm hidden-xs btn-group">';
                        retVal += '<button class="btn btn-xs btn-info" onclick="$.showCommonEditDialog(\'/hotSchool/toUpdate?id='+rowObject.id+'\',\'修改热点高校\',350,180);"> 修改 </button>';
                        retVal += '<button class="btn btn-xs btn-danger" onclick="deleteHotSchool('+rowObject.id+')"> 删除 </button>';
                        retVal += '</div>';
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

function deleteHotSchool(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/hotSchool/delete",
                data: "id="+id
            }).done(function (data) {
                if (data && data.code == '000000') {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    hotSchoolFacade.query();
                } else {
                    $.dialog({title: '提示', content: "删除失败", icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}

function addHotSchool(){
    $.showCommonEditDialog("/hotSchool/toAdd","新增热点高校",350,180);
}

$(function() {
    hotSchoolFacade.query();
    $("#searchBtn").click(hotSchoolFacade.query);

    $("#addBtn").click(function(){
        addHotSchool();
    });
});