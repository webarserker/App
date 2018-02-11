
/**
 * 专业简介
 * @type {{curPage: number, pageSize: number, init: Function, initOperator: Function, initLoad: Function, getMajorList: Function, toMajorDetail: Function, toEnrollPlan: Function, oEnrollHistory: Function}}
 */
var enrollPlan = {

    curPage : 1,
    pageSize : 10,

    /**
     * 页面初始化入口
     */
    init: function() {
        $('.tab-tit li').click(function() {
            $(this).closest('.tab').find('.tab-tit li').attr('class','notactive g-dropDownList drop-dwon');
            $(this).attr('class', 'cur g-dropDownList drop-dwon');
            $(this).closest('.tab').find('.tab-con').hide();
            $($(this).closest('.tab').find('.tab-con')[$(this).index()]).show();
        });
        enrollPlan.initLoad();

    },

    /**
     * 加载专业数据
     */
    initLoad : function() {
        enrollPlan.getMajorList(0);
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
        input['pageSize'] = enrollPlan.pageSize;
        enrollPlan.curPage = parseInt(pageIndex + 1);
        $.ajax({
            type:"POST",
            url: 'http://'+getApiServer()+'/front/enroll/findEnrollPlan',
            data: input,
            dataType: "json",
            success: function(data){
                var _html = '';
                if(data){
                    if(data.data && data.data.length > 0){
                        var majorList = data.data;
                        for(var key in majorList){
                            var plan = majorList[key];
                            _html += '<tr>';
                            _html += '<td>' + plan.totalNum + '</td>';
                            _html += '<td>' + plan.science + '</td>';
                            _html += '<td>' + plan.batch + '</td>';
                            _html += '<td>' + plan.enrollType + '</td>';
                            _html += '<td>' + plan.year + '</td>';
                            _html += '<td>' + plan.cityName + '</td>';
                            _html += '</tr>';
                        }
                    }
                }
                $('#majorInfoBody').html(_html);

                if(data.needPage){
                    utils.paginationPage($('#majorInfoListPage'), data.totalPage, parseInt(data.curPage-1), enrollPlan.getMajorList,true);
                }
            },
            error: function(data){
                //alert("服务器发生错误");
            }
        });
    }

}

/**
 * 专业简介
 * @type {{curPage: number, pageSize: number, init: Function, initOperator: Function, initLoad: Function, getMajorList: Function, toMajorDetail: Function, toEnrollPlan: Function, oEnrollHistory: Function}}
 */
var enrollPlanItem = {

    curPage : 1,
    pageSize : 10,

    /**
     * 页面初始化入口
     */
    init: function() {
        enrollPlanItem.initLoad();
    },

    /**
     * 加载专业数据
     */
    initLoad : function() {
        enrollPlanItem.getMajorList(0);
    },

    /**
     * 获取专业列表
     */
    getMajorList : function(pageIndex){
        var params = $("#form2").serialize().split("&");
        var input = {};
        for(var i = 0 ; i < params.length ; i++){
            var temp = params[i].split("=");
            input[temp[0]] =decodeURIComponent(temp[1]);
        }
        input['curPage'] = parseInt(pageIndex + 1);
        input['pageSize'] = enrollPlanItem.pageSize;
        enrollPlanItem.curPage = parseInt(pageIndex + 1);
        $.ajax({
            type:"POST",
            url: 'http://'+getApiServer()+'/front/enroll/findEnrollPlanDetail',
            data: input,
            dataType: "json",
            success: function(data){
                var _html = '';
                if(data){
                    if(data.data && data.data.length > 0){
                        var majorList = data.data;
                        for(var key in majorList){
                            var plan = majorList[key];
                            _html += '<tr>';
                            _html += '<td>' + plan.majorName + '</td>';
                            _html += '<td>' + plan.enrollNum + '</td>';
                            _html += '<td>' + plan.science + '</td>';
                            _html += '<td>' + plan.batch + '</td>';
                            _html += '<td>' + plan.enrollType + '</td>';
                            _html += '<td>' + plan.year + '</td>';
                            _html += '<td>' + plan.cityName + '</td>';
                            _html += '<td>' + (plan.remark?plan.remark : '') + '</td>';
                            _html += '</tr>';
                        }
                    }
                }
                $('#majorInfoBodyItem').html(_html);

                if(data.needPage){
                    utils.paginationPage($('#majorInfoListPageItem'), data.totalPage, parseInt(data.curPage-1), enrollPlanItem.getMajorList,true);
                }
            },
            error: function(data){
                //alert("服务器发生错误");
            }
        });
    }

}

