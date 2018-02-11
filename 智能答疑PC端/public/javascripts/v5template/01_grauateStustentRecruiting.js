$(document).ready(function(){

    var i=0;
    var timer=null;
    //--------------------------------------------轮播图事件-------------------------------------------------------
    //首先根据图片的个数创建小圆点
    for (var j = 0; j < $('.img li').length; j++) {
        $('.num').append('<li></li>')
    }
    //给第一个圆点添加样式
    $('.num li').first().addClass('active');
    //复制第一张图片
    var firstimg=$('.img li').first().clone();
    //将复制的第一张图片加入到ul中,啊然后重新将ul的宽度更新
    $('.img').append(firstimg).width($('.img li').length*600); //将第一张图片放到最后一张图片后，设置ul的宽度为图片张数*图片宽度


    //鼠标划入圆点
    $('.num li').mouseover(function(){
        var _index=$(this).index();
        $('.img').stop().animate({left:-_index*$('.img img').width()},400);
        $('.num li').eq(_index).addClass('active').siblings().removeClass('active');
        i = _index;
    })

    //定时器自动播放
    timer=setInterval(function(){
        i++;
        if (i==$('.img li').length) {
            i=1;
            $('.img').css({left:0});
        };

        $('.img').stop().animate({left:-i*$('.img img').width()},600);
        if (i==$('.img li').length-1) {
            $('.num li').eq(0).addClass('active').siblings().removeClass('active');
        }else{
            $('.num li').eq(i).addClass('active').siblings().removeClass('active');
        }
    },3000)

    //鼠标移入，暂停自动播放，移出，开始自动播放
    $('.container').hover(function(){
        clearInterval(timer);
    },function(){
        timer=setInterval(function(){
            i++;
            if (i==$('.img li').length) {
                i=1;
                $('.img').css({left:0});
            };

            $('.img').stop().animate({left:-i*$('.img img').width()},600);
            if (i==$('.img li').length-1) {
                $('.num li').eq(0).addClass('active').siblings().removeClass('active');
            }else{
                $('.num li').eq(i).addClass('active').siblings().removeClass('active');
            }
        },4000)
    });
    var themeColor = "#{themeColor}";
    $(".num li").css("border-color",themeColor);
    $(".num li.active").css("background",themeColor);
    // m05左边公告通知蓝色部分     点击跳转到二级页面.文章详情
});