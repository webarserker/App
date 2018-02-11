var schoolPicFacade = {
    detailsGrid: null, // 数据详情
    url : '/schoolPic/queryList',
    query : function() {
        var queryString = schoolPicFacade.getParams();
        if(!queryString) {
        	return false;
        }
        // 加载详情
        schoolPicFacade.loadDetails(queryString);
    },
    getParams : function() {
        return $("Form").serialize();
    },
    // 加载数据详情
    loadDetails : function(params) {
    	var _this = this;
        var grid_selector = "#table-data-list";
        var pager_selector = "#table-data-list-pager";
        if(_this.detailsGrid) {
            // 根据搜索条件，重新加载
            $(grid_selector).jqGrid('setGridParam',{
                url : schoolPicFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : schoolPicFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID', '图片', '标题', '图片描述','点击URL','序号','修改人','操作'],
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
                    name : 'imgUrl',
                    align :'center',
                    width : 300
                }, {
                    name : 'title',
                    align :'center',
                    width : 100
                }, {
                    name : 'picDesc',
                    align :'center',
                    width : 200
                }, {
                    name : 'clickUrl',
                    align :'center',
                    width : 100
                }, {
                    name : 'sortNum',
                    align:'center',
                    width : 90
                },
                {
                    name : 'modifier',
                    align:'left',
                    formatter : function(cellvalue, options, rowObject) {
                        return rowObject.modifier + "<br>" + $.dateFormat(rowObject.modifyTime,"yyyy-MM-dd hh:mm:ss");
                    }
                }, {
                    name : "id",
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="editSchoolPic('+rowObject.id+');">修改</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-default btn-bold" onclick="deleteSchoolPic('+rowObject.id+');">删除</button>';
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
                     // 自适应宽度
	            	    $.resizeGrid(grid_selector);
                    }, 0);
                }
            });
        }
        // 自适应宽度
        $.resizeGrid(grid_selector);
    }
}
function deleteSchoolPic(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/schoolPic/delete",
                data: "id="+id
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    schoolPicFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}
function editSchoolPic(id){
    $.showCommonEditDialog("/schoolPic/addOrUpdate?sCode="+$("#sCode").val()+"&id="+id,"新增",600,500);
}
$(function() {
    $("#searchBtn").click(schoolPicFacade.query);
    $('#searchBtn').click();
});