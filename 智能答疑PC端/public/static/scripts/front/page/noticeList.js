/**
 * 专业简介
 * @type {{curPage: number, pageSize: number, init: Function, initOperator: Function, initLoad: Function, getMajorList: Function, toMajorDetail: Function, toEnrollPlan: Function, oEnrollHistory: Function}}
 */
var noticeList = {

    curPage : 1,
    pageSize : 10,

    /**
     * 页面初始化入口
     */
    init: function() {
        noticeList.initOperator();
        noticeList.initLoad();
    },
    /**
     页面绑定事件
     */
    initOperator: function() {
    	/*头部个人信息下拉框*/
		$('#userPhoto').click(function(e){
			$('#dropDown').toggle();
			$(document).one("click", function(){
		        $('#dropDown').hide();
		    });
		    e.stopPropagation();
		});
		
		$('.news-list dd').mouseover(function() {
			$(this).addClass('hover');
		}).mouseout(function() {
			$(this).removeClass('hover');
		})
		noticeList.updateStatus();
    },

    /**
     * 加载专业数据
     */
    initLoad : function() {
    	noticeList.queryNum();
        noticeList.getNoticeList(0);
    },

    queryNum : function(){
    	var params = {};
    	params['sCode']=$("#sCode").val();
    	$.ajax({
    		type:"POST",
            url: '/front/index/getNoticeNum',
            data: params,
            dataType: "json",
            success: function(data){
            	var _html = '';
            	if(data){
            		if(data && data.num > 0) {
            			$("#noticeNum").html(data.num);
            			$("#noticeIcon").html(data.num);
            			$("#noticeNum").show();
            			$("#noticeIcon").show();
            		}else {
            			$("#noticeNum").hide();
            			$("#noticeIcon").hide();
            			$("#noticeNum").html('');
            			$("#noticeIcon").html('');
            		}
            	}
            },
            error: function(data){
            }
        });
    },
    getNoticeList : function(pageIndex){
    	var _this = this;
        var params = {};
        params['pageSize'] = 10;
        params['curPage'] = parseInt(pageIndex + 1);
        params['sCode']=$("#sCode").val();
        noticeList.curPage = parseInt(pageIndex + 1);
        $.ajax({
            type:"POST",
            url: '/front/index/getNoticeList',
            data: params,
            dataType: "json",
            success: function(data){
            	$('.news-list').find("dd").remove();
                if(data){
                    if(data.data && data.data.length > 0){
                        for(var i = 0; i < data.data.length; i++){
                        	var row = '';
                        	var notice = data.data[i];
                        	row += '<dd class="g-p-r g-c-99 notice_div close '; 
                        	if(notice.isRead == 0) {
                        		row += 'unread "';
                        	}
                        	row += ' msgId="'+notice.id+'">';
                        	row += '<div class="g-cf">';
                        	row += '<div class="g-f-l news-desc">';
                        	row += '<p class="g-c-33 g-fw-b g-fz-18">';
                        	if(notice.isRead == 0) {
                        		row += '<font class="unread_tag" color="red">[未读]</font>';
                        	}else {
                        		row += '<font color="green">[已读]</font>';
                        	}
                        	row += notice.title+'</p>';
                        	row += '<p class="g-ellipsis notice_content"><font color="black">招办回复</font>：'+notice.content+'</p></div></div><div class="pos-right"><p>';
                        	row += '<span>'+notice.createTimeStr+'</span>';
                        	row += '<p><span class="g-mt-10 arrowupIcon icon arrow_icon"></span></p></p></div></dd>';
                        	row += '';
                        	row += '';
                        	$('.news-list').append(row);
                        }
                    }else {
                    	$('.news-list').append('<p style="text-align:center;">暂无消息</p>');
                    }
                }

                noticeList.initOperator();
                if(data.needPage){
                    utils.paginationPage($('#pager'), data.totalPage, parseInt(data.curPage-1), noticeList.getNoticeList,true);
                }
            },
            error: function(data){
                //alert("服务器发生错误");
            }
        });
    },
    updateStatus : function() {
    	$(".notice_div").click(function() {
    		var _this = this;
    		if($(_this).hasClass('close')) {
    			$(_this).addClass('open');
    			$(_this).removeClass('close');
    			$(_this).find(".notice_content").removeClass('g-ellipsis');
    			$(_this).find(".arrow_icon").removeClass('arrowupIcon');
    			$(_this).find(".arrow_icon").addClass('arrowdownIcon');
    			if($(_this).hasClass("unread")) {
    				$.post(contextPath + '/front/index/updateToRead',
    						{id : $(_this).attr('msgId')},
    						function(data){
    							if(data.success) {
    								$(_this).removeClass('unread');
    								$(_this).find(".unread_tag").attr('color', 'green');
    								$(_this).find(".unread_tag").html('[已读]');
    								noticeList.queryNum();
    							}
    						},'json');
    			}
    		}else {
    			$(_this).addClass('close');
    			$(_this).removeClass('open');
    			$(_this).find(".notice_content").addClass('g-ellipsis');
    			$(_this).find(".arrow_icon").removeClass('arrowdownIcon');
    			$(_this).find(".arrow_icon").addClass('arrowupIcon');
    		}
    	});
    }
}