require.config({
	baseUrl:"../../src/js/"
});
require(["../../src/js/config.js"],function(){
	require(["jquery"],function($){
		var news = {
			/*页面绑定事件*/
			bindEvent: function() {
				var me = this;
				
				$('.news-list dd').mouseover(function(e) {
					$(this).addClass('hover');
				}).mouseout(function(e) {
					$(this).removeClass('hover');
				}).click(function(e) {
					var sum = $(this).find('.sum');
					var detail = $(this).find('.detail');
					var icon = $(this).find('.icon')

					if(detail.is(':hidden')){
						detail.show();
						sum.hide();
						icon.removeClass('arrowdownIcon').addClass('arrowupIcon');
					} else {
						detail.hide();
						sum.show();
						icon.removeClass('arrowupIcon').addClass('arrowdownIcon');
					}
				});

			},
			/*页面初始化入口*/
			init: function() {
				var me = this;
				me.bindEvent();
			}
		}
		news.init();
	});
});