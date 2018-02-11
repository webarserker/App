/**
 * 专业简介
 * @type {{curPage: number, pageSize: number, init: Function, initOperator: Function, initLoad: Function, getMajorList: Function, toMajorDetail: Function, : Function, oEnrollHistory: Function}}
 */
var search = {

    curPage : 1,
    pageSize : 10,

    /**
     * 页面初始化入口
     */
    init: function() {
        search.initLoad();
    },

    /**
     * 加载专业数据
     */
    initLoad : function() {
        search.getMajorList(0);
    },

    /**
     * 获取专业列表
     */
    getMajorList : function(pageIndex){
        var params = $("#form1").serialize().split("&");
        var input = {};
        for(var i = 0 ; i < params.length ; i++){
            var temp = params[i].split("=");
            input[temp[0]] =decodeURIComponent(temp[1]);
        }
        input['curPage'] = parseInt(pageIndex + 1);
        input['pageSize'] = search.pageSize;
        search.curPage = parseInt(pageIndex + 1);
        $.ajax({
            type:"POST",
            url: '/front/search/findByKeyWordNew',
            data: input,
            dataType: "json",
            success: function(data){
                var _html = '';
                if(data){
                    if(data.data && data.data.length > 0){
                        var searchInfo = data.data;
                        _html = '<div style="text-align: left; font-color: grey; clear: both; padding: 20px;">';
                        _html += '<ul class="ans">';
                        var i = 1;
                        for(var key in searchInfo){
                            var ans = searchInfo[key];
                            _html += "<li>";
                            _html += '<a href='+ans.linkUrl+'>'+i+'、'+ans.title+'</a><br/>';
                            if(ans.shortContent != null && ans.shortContent != ''){
                                _html += '<p class="shortContent">'+ans.shortContent+'</p>';
                            }
                            _html += "</li>";
                            i++;
                        }
                        _html += "</ul></div>";
                    }else{
                        _html = ' <div style="text-align: center; font-color: grey; clear: both; padding: 20px;">没有找到您要的内容</div>'
                    }
                }
                $('#searchInfo').html(_html);

                if(data.needPage){
                    utils.paginationPage($('#searchInfoPage'), data.totalPage, parseInt(data.curPage-1), search.getMajorList,true);
                }
            },
            error: function(data){
                //alert("服务器发生错误");
            }
        });
    }

}