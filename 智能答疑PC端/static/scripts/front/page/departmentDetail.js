/**
 * 专业简介
 * @type {{curPage: number, pageSize: number, init: Function, initOperator: Function, initLoad: Function, getMajorList: Function, toMajorDetail: Function, toEnrollPlan: Function, oEnrollHistory: Function}}
 */
var majorInfo = {

    curPage : 1,
    pageSize : 10,

    /**
     * 页面初始化入口
     */
    init: function() {
        majorInfo.initOperator();
        majorInfo.initLoad();
    },
    /**
     页面绑定事件
     */
    initOperator: function() {
        $("#searchMajorBtn").click(function(){
            majorInfo.getMajorList(0);
        });
    },

    /**
     * 加载专业数据
     */
    initLoad : function() {
        majorInfo.getMajorList(0);
    },

    /**
     * 获取专业列表
     */
    getMajorList : function(pageIndex){
        var params = {};
        params['departId'] = $.trim($('#departId').val());
        params['curPage'] = parseInt(pageIndex + 1);
        params['pageSize'] = majorInfo.pageSize;
        majorInfo.curPage = parseInt(pageIndex + 1);
        $.ajax({
            type:"POST",
            url: '/front/info/getMajorList?needPage=false',
            data: params,
            dataType: "json",
            success: function(data){
                var _html = '';
                if(data){
                    if(data.data && data.data.length > 0){
                    	$("#majorInfoTable").show();
                        var majorList = data.data;
                        var show = {};
                        if(majorShow && majorShow !=''){
                        	show = eval('('+majorShow+")");
                        }
                        for(var key in majorList){
                            var major = majorList[key];
                            _html += '<tr>';
                            _html += '<td><a href="javascript:majorInfo.toMajorDetail(\''+ major.id +'\');">'+ major.name +'</a></td>';
                            _html += '<td>'+ (major.schoolYear==null?'':major.schoolYear) +'</td>';
                            _html += '<td>'+ (major.degree==null?'':major.degree) +'</td>';
                            /*_html += '<td>'+ (major.tuitionStandard==null?'':major.tuitionStandard) +'</td>';*/
                          /*  if(show.showDetail == 1){
                            	_html += '<td><a href="javascript:majorInfo.toMajorDetail(\''+ major.id +'\');">点击查看</a></td>';
                            }*/
                            if(show.showEntroll == 1){
                            _html += '<td><a href="javascript:majorInfo.toEnrollPlan(\''+ major.name +'\');">点击查看</a></td>';
                            }
                            if(show.showEntrollHistory == 1){
                            _html += '<td><a href="javascript:majorInfo.toEnrollHistory(\''+ major.name +'\');">点击查看</a></td>';
                            }
                            _html += '</tr>';
                        }
                    }else{
                    	$("#majorInfoTable").hide();
                    }
                }

                $('#majorInfoBody').html(_html);

                if(data.needPage){
                    utils.paginationPage($('#majorInfoListPage'), data.totalPage, parseInt(data.curPage-1), majorInfo.getMajorList,true);
                }
            },
            error: function(data){
                //alert("服务器发生错误");
            }
        });

    },
    /**
     * 显示院系详情
     * @param id
     */
    toDepartmentDetail : function(id){
        var contentId = $('#contentId').val();
        //window.location.href = '/front/info/majorDetail?id='+contentId + '&majorId=' + id;
        var url = '/front/info/departmentDetail?id='+contentId + '&departmentId=' + id;
        window.open(url);
    },

    /**
     * 显示专业详情
     * @param id
     */
    toMajorDetail : function(id){
        var contentId = $('#contentId').val();
        //window.location.href = '/front/info/majorDetail?id='+contentId + '&majorId=' + id;
        var url = '/front/info/majorDetail?id='+contentId + '&majorId=' + id;
        window.open(url);
    },

    /**
     * 跳转到专业招生计划
     * @param majorName
     */
    toEnrollPlan : function(majorName){
        //window.location.href = '/front/info/majorScore?majorName=' + majorName;
        var url = '/front/info/enrollPlanForMajor?majorName=' + majorName;
        window.open(url);
    },


    /**
     * 跳转到专业历史录取
     * @param majorName
     */
    toEnrollHistory : function(majorName){
        var url = '/front/info/majorScore?majorName=' + majorName;
        //window.location.href = '/front/info/?majorName=' + majorName;
        window.open(url);
    }
}

