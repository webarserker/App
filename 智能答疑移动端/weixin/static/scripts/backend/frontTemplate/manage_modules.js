var frontTemplateModuleFacade = {
    detailsGrid: null, // 数据详情
    url : '/frontTemplate/findModules',
    query : function() {
        // 加载详情
        frontTemplateModuleFacade.loadDetails();
    },
    // 加载数据详情
    loadDetails : function() {
        var _this = this;
        var grid_selector = "#table-data-list";
        // var pager_selector = "#table-data-list-pager";
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : frontTemplateModuleFacade.url+'?templateId='+$("#templateId").val(),
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : frontTemplateModuleFacade.url+'?templateId='+$("#templateId").val(),
                datatype : 'json',
                colNames : ['ID', '名称', '模块唯一标识', '关联类型', '分类限制数量', '分类下级限制数量', '是否自允许拖拽叶子节点','操作'],
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
                    width : 50
                }, {
                    name : 'name',
                    width : 80
                }, {
                    name : 'keyNum',
                    width : 80
                }, {
                    name : 'moduleTypeStr',
                    width : 100
                }, {
                    name : 'higherLevelNum',
                    width : 100,
                    align:'center'
                }, {
                    name : 'lowerLevelNum',
                    width : 120,
                    align:'center'
                }, {
                    name : 'leafnodeEndrag',
                    width : 150,
                    align:'center',
                    formatter : function(cellvalue, options, rowObject) {
                        return cellvalue==1?'是':'否';
                     }
                }, {
                    name : "id",
                    width : '80',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-primary btn-bold" onclick="openUpdate('+cellvalue+',\'编辑\',680,350);">编辑</button>';
                        retVal += ' <button class="btn btn-minier btn-danger btn-bold" onclick="deleteObj('+cellvalue+');">删除</button>';
                        retVal += ' <button class="btn btn-minier btn-info btn-bold" onclick="showImg(\''+rowObject.moduleImg+'\');">查看模板样图</button>';
                        return retVal;
                    }
                }],
                // rowNum : 5,
                // rowList : [ 5, 10],
                // pager : pager_selector,
                // pagerpos : 'left',
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
//查看模块样图
function showImg(url) {
	parent.$.dialog({content:'url:'+$('#imgServer').val()+url+"?x-oss-process=image/resize,w_400", width:420,height:window.innerHeight-190});
}
function openUpdate(id) {
    var url = '/frontTemplate/updateModule?templateId='+$('#templateId').val()+'&id='+((id == null || id == 'null') ? '' : id);
    parent.$.dialog({
        id : 'openWin',
        lock: true,
        title : '模块管理',
        content : "url:"+url,
        width: 850,
        height: 550,
        drag: true,
        resize: true,
    });
}

function deleteObj(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/frontTemplate/deleteModule",
                data: "id="+id
            }).done(function (data) {
                if (data.code == '000000') {
                    parent.$.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    frontTemplateModuleFacade.query();
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
	frontTemplateModuleFacade.query();
    $("#searchBtn").click(frontTemplateModuleFacade.query);
});