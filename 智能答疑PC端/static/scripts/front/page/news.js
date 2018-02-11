require.config({
	baseUrl:"../../../static/scripts/front/"
});
require(["../../../static/scripts/front/config.js"],function(){
	require(["jquery", "getNoticeNum"],function($, getNoticeNum){
		var news = {
			/*页面绑定事件*/
			bindEvent: function() {
				var me = this;
				/*头部个人信息下拉框*/
				$('#userPhoto').hover(function(e){
					$('#dropDown').show();
				}, function() {
					$('#dropDown').hide();
				});
				
				$('.news-list dd').mouseover(function() {
					$(this).addClass('hover');
				}).mouseout(function() {
					$(this).removeClass('hover');
				})
			},
			getNoticeNum : function(){
				getNoticeNum.queryNum();
			},
			/*页面初始化入口*/
			init: function() {
				var me = this;
				me.bindEvent();
				me.getNoticeNum();
				getNoticeNum.updateStatus();
				getNoticeNum.getNoticeList();
			}
		}
		news.init();
	});
});