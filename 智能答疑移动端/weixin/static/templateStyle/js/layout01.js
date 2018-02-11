$(document).ready(function(){
    //二级页面左边侧边栏，鼠标划过样式改变
    $(".side_content ul li a.sidebar_menu_level1").hover(function () {
        $(this).addClass("themeBlueBackgroundColor");
        $(this).children(".sidebar_menu_level2Items").show();
        $(this).parent().find(".sidebar_menu_level2Items").show();
    }, function () {
        $(this).removeClass("themeBlueBackgroundColor");
        $(this).parent().find(".sidebar_menu_level2Items").hide();
    });


    //首页导航栏菜单，鼠标划过样式改变
    $(".nav_container ul li a").hover(function(){
       $(this).addClass("on").siblings().removeClass("on");
    },function(){
       $(this).removeClass("on");
    });
})