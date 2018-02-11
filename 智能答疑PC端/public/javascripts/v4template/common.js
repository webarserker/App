/**
 * Created by liuyang on 2017/7/24.
 */

// $('.news-list a').each(function(){
//     $(this).hover(function(){
//         $(this).addClass('themeColor')
//     },function(){
//         $(this).removeClass('themeColor');
//     })
// })

$('body').on('mouseover','.news-list a,.news-list2 a',function(){
    $(this).addClass('themeColor')
})
$('body').on('mouseout','.news-list a,.news-list2 a',function(){
    $(this).removeClass('themeColor');
})