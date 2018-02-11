var faqFacade = {
    detailsGrid: null, // 数据详情
    url : '/faq/findAnsweringFaq',
    uploadUrl : '/faq/uploadPage',
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
                colNames : ['ID', /*'所属主题',*/ '问题', '答案' , '是否热点' , '修改时间', '修改人','操作'],
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
                }/*, {
                    name : 'catName'
                }*/,{
                    name : 'question'
                }, {
                    name : 'answer'
                }, {
                    name : 'isHot',
                    align :'center',
                    width : 50,
                    formatter : function(cellvalue, options, rowObject) {
                       if(cellvalue == 0){
                           return '否';
                       }else if(cellvalue == 1){
                           return '是';
                       }
                    }
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
                        retVal += '<button class="btn btn-xs btn-info" onclick="$.showCommonEditDialog(\'/faq/toUpdate?id='+rowObject.id+'\',\'修改FAQ\',500,400);"> ' +
                            '<i class="ace-icon fa fa-pencil bigger-120"></i> </button>' +
                            '<button class="btn btn-xs btn-danger" onclick="deleteFaq('+rowObject.id+')"> <i class="ace-icon fa fa-trash-o bigger-120"></i> </button> </div>';
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
    },
    openImport: function() {
        $.showCommonEditDialog(faqFacade.uploadUrl, '上传常见问题信息', 400, 200);
    },

    /**
     * 物料批量导出
     */
    export : function () {
        var url = '/faq/export?'
            + $("form").serialize();
        if ($("#downloadIfm").attr('src')) {
            $("#downloadIfm").attr('src', '');
        }
        $("#downloadIfm").attr('src', url);
    }
    
}

function deleteFaq(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/faq/delete",
                data: "id="+id
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    faqFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}

function addFaq(){
    $.showCommonEditDialog("/faq/toAdd","新增FAQ",500,400);
}

$(function() {
    faqFacade.query();
    $("#searchBtn").click(faqFacade.query);

    $("#addBtn").click(function(){
        addFaq()
    });
    $("#importBtn").click(function(){
    	faqFacade.openImport();
    });
    $("#exportBtn").click(function(){
    	faqFacade.export();
    });
});