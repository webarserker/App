define(['getNoticeNum'], function() {
	return {
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
	        majorInfo.curPage = parseInt(pageIndex + 1);
	        $.ajax({
	            type:"POST",
	            url: '/front/index/getNoticePage',
	            data: params,
	            dataType: "json",
	            success: function(data){
	            	$('.news-list').find("dd").remove();
	                var _html = '';
	                if(data){
	                    if(data.data && data.data.length > 0){
	                        for(var notice in data.list){
	                        	var row = '';
	                        	row += '<dd class="g-p-r g-c-99 notice_div close '; 
	                        	if(notice.isRead == 0) {
	                        		row += 'unread "';
	                        	}
	                        	row += ' msgId="'+notice.id+'">';
	                        	row += '<div class="g-cf">';
	                        	row += '<div class="g-f-l news-desc">';
	                        	row += '<div class="g-f-l news-desc">';
	                        	row += '<p class="g-c-33 g-fw-b g-fz-18">'+notice.title+'</p>';
	                        	row += '<p class="g-ellipsis notice_content">'+notice.content+'</p></div></div><div class="pos-right"><p>';
	                        	row += '<span>'+notice.createTimeStr+'</span>';
	                        	row += '<p><span class="g-mt-10 arrowdownIcon icon arrow_icon"></span></p></p></div></dd>';
	                        	row += '';
	                        	row += '';
	                        }
	                    }
	                }

	                $('.news-list').append(_html);
	                _this.updateStatus();
	                if(data.needPage){
	                    utils.paginationPage($('#pager'), data.totalPage, parseInt(data.curPage-1), _this.getNoticeList,true);
	                }
	            },
	            error: function(data){
	                //alert("服务器发生错误");
	            }
	        });
	    },
		updateStatus : function() {
			var _this = this;
			$(".notice_div").click(function() {
				if($(this).hasClass('close')) {
					$(this).addClass('open');
					$(this).removeClass('close');
					$(this).find(".notice_content").removeClass('g-ellipsis');
					$(this).find(".arrow_icon").removeClass('arrowdownIcon');
					$(this).find(".arrow_icon").addClass('arrowupIcon');
					if($(this).hasClass("unread")) {
						$.post(contextPath + '/front/index/updateToRead',
								{id : $(this).attr('msgId')},
								function(data){
									if(data.success) {
										$(this).removeClass('unread');
										_this.queryNum();
									}
								},'json');
					}
				}else {
					$(this).addClass('close');
					$(this).removeClass('open');
					$(this).find(".notice_content").addClass('g-ellipsis');
					$(this).find(".arrow_icon").removeClass('arrowupIcon');
					$(this).find(".arrow_icon").addClass('arrowdownIcon');
				}
			});
		}
	}
	
});
