define(["jquery", "qrcode", "nicescroll"], function($){
	(function() {
		var curIndex = $('#index').val();
		var curEle = $('#menu_' + curIndex);

		curEle.parents('.m-level2').children('ul').show().end().
		                            children('p.txt').addClass('active').end().end().
		       parents('.m-level1').children('ul').show().end().
		                            children('p.txt').addClass('active');
		curEle.addClass('active');

	})();

	/*菜单展开折叠效果*/
	$('.txt').click(function(e) {
		//让所有菜单处于未激活状态
		//获取同级的菜单
		var li = $(this).parent().siblings();
		li.children('.txt').removeClass('active');
		li.children('ul').hide();
		if(!$(this).hasClass('active')) {
			$(this).addClass('active');
			$(this).parent().children('ul').show();
		} else {
			$(this).removeClass('active');
			$(this).parent().children('ul').hide();
		}
		
		e.stopPropagation();
	});

	$('.m-level3').click(function() {
		$('.m-level3').removeClass('active');
		$(this).addClass('active');
	});

	/* 菜单滚动条美化 */
	$("#menu-conent").css('maxHeight', $(window).height() - 220 + 'px')
		.niceScroll({
			railpadding: { top: 0, right: -13, left: 0, bottom: 0 },
			zindex: 20000,
			autohidemode: false,
			cursorcolor: "#aaa"
		});

	/*回到顶部*/
	$('#backToTop').click(function(){$('html,body').animate({scrollTop: '0px'}, 800);});
});
