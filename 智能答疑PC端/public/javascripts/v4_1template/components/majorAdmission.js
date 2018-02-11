/**
 * Created by liuyang on 2017/7/27.
 */
$(function () {
    $('ul.tabs li').on('click', function () {
        $(this).addClass('themeColor themeBorderBottom2').find('span.before').addClass('themeBottomColor');
        $(this).siblings().removeClass('themeColor themeBorderBottom2').find('span.before').removeClass('themeBottomColor');
        if($(this).index()==0){
            $('#table1').show();
            $('#table2').hide();
        }else{
            $('#table2').show();
            $('#table1').hide();
        }
    })


})