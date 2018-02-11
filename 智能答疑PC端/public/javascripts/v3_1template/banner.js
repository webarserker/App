$(function(){
	var i=2;
	var LIWIDTH=$('.img li').outerWidth(); //»ñÈ¡Ô­Ê¼LIµÄ¿í¶È
	var INIT_LENGTH=$('.img li').length;   //»ñÈ¡Ô­Ê¼LIµÄ¸öÊý
	var timer=null;

	$('.num li').first().addClass('active'); //¸øµÚÒ»¸öÔ²µãÌí¼ÓÑùÊ½
	var firstimg=$('.img li').first().clone(); //¸´ÖÆµÚÒ»ÕÅÍ¼Æ¬
	var secondimg=$('.img li').eq(1).clone();
	var lastimg=$('.img li').last().clone();
	var lastsecondimg=$('.img li').eq($('.img li').length-2).clone();
	$('.img').prepend(lastimg).prepend(lastsecondimg).append(firstimg).append(secondimg).width($('.img li').length*LIWIDTH).css('left',-LIWIDTH*2+'px')
// ÏÂÒ»¸ö°´Å¥
	$('.next').click(function(){
		$('.img').stop().animate({left:-(i+1)*LIWIDTH+'px'},500,function(){
			i++;
			if (i==INIT_LENGTH+2) {
				i=2;
				$('.img').css({left:-LIWIDTH*2+'px'});
			};
			if (i==INIT_LENGTH+2) {
				$('.num li').eq(0).addClass('active').siblings().removeClass('active');
			}else{
				$('.num li').eq(i-2).addClass('active').siblings().removeClass('active');
			}
		});

	})
// ÉÏÒ»¸ö°´Å¥
	$('.prev').click(function(){
		if (i==2) {
			i=INIT_LENGTH+2;
			$('.img').css({left:-LIWIDTH*i}); //±£Ö¤ÎÞ·ìÂÖ²¥£¬ÉèÖÃleftÖµ
		};

		$('.img').stop().animate({left:-(i-1)*LIWIDTH},500,function(){
			i--;
			$('.num li').eq(i-2).addClass('active').siblings().removeClass('active');
		});

	})
//ÉèÖÃ°´Å¥µÄÏÔÊ¾ºÍÒþ²Ø
	$('.banner').hover(function(){
		$('.btn').show();
	},function(){
		$('.btn').hide();
	})
//Êó±êµã»÷Ô²µã
	$('.num li').click(function(){
		var _index=$(this).index();
		$('.img').stop().animate({left:-(_index+2)*LIWIDTH},500);
		$('.num li').eq(_index).addClass('active').siblings().removeClass('active');
		i=_index+2;
	})
//¶¨Ê±Æ÷×Ô¶¯²¥·Å
	timer=setInterval(function(){
		$('.img').stop().animate({left:-(i+1)*LIWIDTH},500,function(){
			i++;
			if (i==INIT_LENGTH+2) {
				i=2;
				$('.img').css({left:-LIWIDTH*2+'px'});
			};

			if (i==INIT_LENGTH+2) {
				$('.num li').eq(0).addClass('active').siblings().removeClass('active');
			}else{
				$('.num li').eq(i-2).addClass('active').siblings().removeClass('active');
			}
		});
	},3500)
//Êó±êÒÆÈë£¬ÔÝÍ£×Ô¶¯²¥·Å£¬ÒÆ³ö£¬¿ªÊ¼×Ô¶¯²¥·Å
	$('.banner').hover(function(){
		clearInterval(timer);
		timer=null;
	},function(){
		timer=setInterval(function(){
			$('.img').stop().animate({left:-(i+1)*LIWIDTH},500,function(){
				i++;
				if (i==INIT_LENGTH+2) {
					i=2;
					$('.img').css({left:-LIWIDTH*2+'px'});
				};

				if (i==INIT_LENGTH+2) {
					$('.num li').eq(0).addClass('active').siblings().removeClass('active');
				}else{
					$('.num li').eq(i-2).addClass('active').siblings().removeClass('active');
				}
			});
		},3500)
	})
})