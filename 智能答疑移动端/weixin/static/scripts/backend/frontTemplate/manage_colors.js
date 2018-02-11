var frontTemplateColorFacade = {
    detailsGrid: null, // 数据详情
    url : '/frontTemplate/findColors',
    query : function() {
        // 加载详情
        frontTemplateColorFacade.loadDetails();
    },
    // 加载数据详情
    loadDetails : function() {
        var _this = this;
        var grid_selector = "#table-data-list";
        var pager_selector = "#table-data-list-pager";
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : frontTemplateColorFacade.url+'?templateId='+$("#templateId").val(),
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : frontTemplateColorFacade.url+'?templateId='+$("#templateId").val(),
                datatype : 'json',
                colNames : ['名称', 'class值', '操作'],
                jsonReader : {  
                    root: "data",  
                    page: "curPage",  
                    total: "totalPage",  
                    records: "totalRows"
                },
                prmNames : {page:'curPage',rows:'pageSize', sort: 'sidx',order: 'sort'},
                cmTemplate: {sortable:true},
                colModel : [ {
                    name : 'colorName',
                    width : 150,
                    formatter : function(cellvalue, options, rowObject) {
                    	 var retVal = cellvalue ;
	                    	if(rowObject.colorHexRgb){
	                    		retVal += '<div class="btn-colorpicker" style="width: 50px;height:20px;margin-left:8px;background-color: #'+rowObject.colorHexRgb+'"></div>'
	                    	}
                         return retVal;
                       }
                }, {
                    name : 'colorValue',
                    width : 150
                }, {
                //     name : 'colorValue',
                //     width : 100,
                //     align : 'center',
                //     formatter : function(cellvalue, options, rowObject) {
                //         var retVal = '<div style="width: 50px;height:30px;background-color: #'+cellvalue+'"></div>';
                //         return retVal;
                //     }
                // }, {
                    name : "id",
                    width : '80',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-primary btn-bold" onclick="openUpdate('+cellvalue+',\'编辑\',480,250);">编辑</button>';
                        retVal += ' <button class="btn btn-minier btn-danger btn-bold" onclick="deleteObj('+cellvalue+');">删除</button>';
                        return retVal;
                    }
                }],
                rowNum : 5,
                rowList : [ 5, 10],
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
}

function openUpdate(id) {
    var url = '/frontTemplate/updateColor?templateId='+$('#templateId').val()+'&id='+((id == null || id == 'null') ? '' : id);
    parent.$.dialog({
        id : 'openWin',
        lock: true,
        title : '颜色管理',
        content : "url:"+url,
        width: 350,
        height: 230,
        drag: true,
        resize: true,
        icon: 'alert.gif'
    });
}

function deleteObj(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/frontTemplate/deleteColor",
                data: "id="+id
            }).done(function (data) {
                if (data.code == '000000') {
                    parent.$.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    frontTemplateColorFacade.query();
                } else {
                    parent.$.dialog({title: '提示', content: data.message, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}
$(function() {
	frontTemplateColorFacade.query();
    $("#searchBtn").click(frontTemplateColorFacade.query);
});