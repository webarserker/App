/**
 * 专业简介
 * @type {{curPage: number, pageSize: number, init: Function, initOperator: Function, initLoad: Function, getMajorList: Function, toMajorDetail: Function, toEnrollPlan: Function, oEnrollHistory: Function}}
 */
var majorResearch = {

    curPage : 1,
    pageSize : 10,

    /**
     * 页面初始化入口
     */
    init: function() {
        majorResearch.initOperator();
        majorResearch.initLoad();
    },
    /**
     页面绑定事件
     */
    initOperator: function() {
        $("#majorName").change(function(){
            majorResearch.getMajorList(0);
        });
    },

    /**
     * 加载专业数据
     */
    initLoad : function() {
        majorResearch.getMajorList(0);
    },

    /**
     * 获取专业列表
     */
    getMajorList : function(pageIndex){
        var params = {};
        //params['name'] = $.trim($('#name').val());
        params['majorName'] = $.trim($('#majorName').val());
        params['curPage'] = parseInt(pageIndex + 1);
        params['pageSize'] = majorResearch.pageSize;
        majorResearch.curPage = parseInt(pageIndex + 1);
        $.ajax({
            type:"POST",
            url: '/front/info/getMajorResearchList',
            data: params,
            dataType: "json",
            success: function(data){
                var _html = '';
                if(data){
                    if(data.data && data.data.length > 0){
                        var majorList = data.data;
                        for(var key in majorList){
                            var major = majorList[key];
                            _html += '<tr>';
                            _html += '<td>'+major.majorCode+'</td>';
                            _html += '<td>'+ major.majorName +'</td>';
                            _html += '<td>'+ major.department +'</td>';
                            _html += '<td>'+ major.name +'</td>';
                            _html += '<td>'+ (major.mentors?major.mentors:'') +'</td>';
                            _html += '<td>'+ major.typeStr +'</td>';
                            _html += '<td><a href="javascript:majorResearch.toMajorResearchDetail(\''+ major.id +'\');">点击查看</a></td>';
                            //_html += '<td><a href="javascript:majorResearch.toMajorResearchDetail(\''+ major.majorId +'\');">点击查看</a></td>';
                            _html += '</tr>';
                        }
                    }
                }

                $('#majorResearchBody').html(_html);

                if(data.needPage){
                    utils.paginationPage($('#majorResearchListPage'), data.totalPage, parseInt(data.curPage-1), majorResearch.getMajorList,true);
                }
            },
            error: function(data){
                //alert("服务器发生错误");
            }
        });

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
    toMajorResearchDetail : function(id){
        var contentId = $('#contentId').val();
        //window.location.href = '/front/info/majorDetail?id='+contentId + '&majorId=' + id;
        var url = '/front/info/majorResearchDetail?id='+contentId + '&majorResearchId=' + id;
        window.open(url);
    },
}

