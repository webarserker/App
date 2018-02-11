/**
 * Created by liuyang on 2017/7/25.
 */
$(function () {
    // $('#menu ul.article-list').on('mouseover', 'li.article-item', function () {
    //     $(this).addClass('themeBackgroundColor').find('span.circle,span.themeColor').addClass('active');
    //     if ($(this).find('.next-menu').length) {
    //         $(this).find('.next-menu').show();
    //     }
    // });
    $('#menu ul.article-list').on('mouseover','li.article-item>a',function(){
        if($(this).parent().find('.content-list').length){
            $(this).parent().find('.content-list').hide();
        }
    })
    // $('#menu ul.article-list').on('mouseout', 'li.article-item', function () {
    //     $(this).removeClass('themeBackgroundColor').find('span').removeClass('active');
    //     if ($(this).find('.next-menu').length) {
    //         $(this).find('.next-menu').hide();
    //     }
    // });
})