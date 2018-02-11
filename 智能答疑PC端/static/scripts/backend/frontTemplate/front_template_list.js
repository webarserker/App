var frontTemplateFacade = {
    manageColorDialog : null,
    manageModuleDialog : null,
    detailsGrid: null, // 数据详情
    url : '/frontTemplate/queryList',
    query : function() {
        var queryString = frontTemplateFacade.getParams();
        if(!queryString) {
        	return false;
        }
        // 加载详情
        frontTemplateFacade.loadDetails(queryString);
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
                url : frontTemplateFacade.url+'?'+params,
                page:1 
            }).trigger("reloadGrid");
        } else {
            // 首次加载
            _this.detailsGrid = $(grid_selector).jqGrid({
                url : frontTemplateFacade.url+'?'+params,
                datatype : 'json',
                colNames : ['ID','模板类型','模板名称','模板标识', '文件目录',/* '颜色',*/ '是否收费', '创建时间', '创建人','操作'],
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
                    width : 80
                }, {
                    name : 'type',
                    width : 100,
                    formatter : function(val, options, rowObject) {
                    	return val && val==2 ? '移动端':'pc端';
                    }
                }, {
                    name : 'templateName',
                    width : 150
                },{
                    name : 'templateKey',
                    width : 150
                }, {
                    name : 'filePath',
                    width : 150
                }, /* {
                    name : 'colors',
                    width : 150,
                    formatter : function(val, options, rowObject) {
                        var str = '';
                        if(val && val.length > 0) {
                            for(var i = 0; i < val.length; i++) {
                                str += val[i].colorName;
                                if(i < (val.length - 1)) {
                                    str += '、';
                                }
                            }
                        }
                        return str;
                    }
                }, */ {
                    name : 'needPayStr',
                    width : 150
                },  {
                    name : 'createTime',
                    align:'right',
                    formatter : function(cellvalue, options, rowObject) {
                        return $.dateFormat(cellvalue, 'yyyy-MM-dd hh:mm:ss');
                    }
                }, {
                    name : 'creator'
                }, {
                    name : "id",
                    width : '180',
                    formatter : function(cellvalue, options, rowObject) {
                        var retVal = ' <button class="btn btn-minier btn-white btn-primary btn-bold" onclick="$.showCommonEditDialog(\'/frontTemplate/addOrUpdate?id='+rowObject.id+'\',\'编辑\',620,350);">编辑</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-primary btn-bold" onclick="deleteObj('+rowObject.id+');">删除</button>';
                        if(rowObject.templateImg) {
                            retVal += ' <button class="btn btn-minier btn-white btn-primary btn-bold" onclick="showImg(\''+rowObject.templateImg+'\');">查看模板图</button>';
                        }
                        retVal += '<br>';
                        retVal += ' <button class="btn btn-minier btn-white btn-success btn-bold" onclick="openUploadIcons('+rowObject.id+');">上传Icon</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-success btn-bold" onclick="showIcons('+rowObject.id+');">查看Icon</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-warning btn-bold" onclick="manageColors('+rowObject.id+');">管理颜色</button>';
                        retVal += ' <button class="btn btn-minier btn-white btn-warning btn-bold" onclick="manageModules('+rowObject.id+');">管理模块</button>';
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
    },
}
function deleteObj(id){
    bootbox.confirm("您确定删除该记录?", function(result) {
        if(result) {
            $.ajax({
                type: "POST",
                url: "/frontTemplate/delete",
                data: "id="+id
            }).done(function (data) {
                if (data.success) {
                    $.dialog({title: '提示', content: "删除成功", icon: 'success.gif',lock:true ,ok: '确定'});
                    frontTemplateFacade.query();
                } else {
                    $.dialog({title: '提示', content: data.error, icon: 'error.gif',lock:true, ok: '确定'});
                }
            }).always(function () {
                //$("#submitBtn").removeClass("disabled");
            });
        }
    });
}

function showImg(url) {
    $.dialog({content:'url:'+$('#imgServer').val()+url+"?x-oss-process=image/resize,w_400", width:800,height:window.innerHeight-250});
}
function showIcons(templateId) {
    $.showCommonEditDialog("/frontTemplate/showIcons?templateId="+templateId,"查看模板图标",600,400);
}
function openUploadIcons(templateId) {
    $.showCommonEditDialog("/frontTemplate/manageIcons?templateId="+templateId,"上传模板图标",300,150);
}
function manageColors(templateId) {
    frontTemplateFacade.manageColorDialog = $.showCommonEditDialog("/frontTemplate/manageColors?templateId="+templateId,"模板颜色管理",600,500);
}
function manageModules(templateId) {
    frontTemplateFacade.manageModuleDialog = $.showCommonEditDialog("/frontTemplate/manageModules?templateId="+templateId,"模板颜色管理",900,500);
}
$(function() {
    frontTemplateFacade.query();
    $("#searchBtn").click(frontTemplateFacade.query);
});