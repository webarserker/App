$(document).ready(function(){
var oList = $("#list");
    var oRight = $("#right");
    var oLeft = $("#left");
    var oWidth = parseInt(oList.css('width')) / 5;      //计算图片的宽度从而达到自适应屏幕宽度
    var oSpan = $(".btns span");
    var len = 3;
    var index = 1;
    var interval = 3500;
    var timer = null;
    oList.css('left',-oWidth);              //图片加载完成时将图片向左偏移一张图片

    function animate(offset){                               //过渡效果
        var newLeft = parseInt(oList.css('left')) + offset;         //点击后的图片偏移量
        oList.animate({'left':newLeft + 'px'},function(){
            if(newLeft > 0){                                 //判断图片是否已经循环一次
                oList.css('left',-oWidth * len);
            }
            if(newLeft < -oWidth * 3){
                oList.css('left',-oWidth);
            }
        });
    }

    function showBtns(){                //按钮过渡
        oSpan.each(function(){                  //遍历每个按钮将其Class设置为空
            $(this).attr('class','');
        });
        $(".btns > span").eq(index - 1).addClass('on');          //将当前Span的索引Class设置为on
    }

    function autoplay(){                        //自动播放
        timer = setTimeout(function(){
            oRight.trigger('click');
            autoplay();
        },interval);
    }

    function stop(){
        clearInterval(timer);
    }

    oList.on('mouseover',function(){            //判断鼠标是否在容器上面
        stop();
    });

    oList.on('mouseout',function(){
        autoplay();
    });

    oRight.on('click',function(){
        if(oList.is(':animated')){
            return;
        }
        if(index == 4){         //向右点击 index索引+1
            index = 1;
        }else{
            index += 1;
        }
        animate(-oWidth);
        showBtns();
    });

    oLeft.on('click',function(){
        if(oList.is(':animated')){
            return;
        }
        if(index == 1){         //向左点击 index索引-1
            index = 4;
        }else{
            index -= 1;
        }
        animate(oWidth);
        showBtns();
    });

    oSpan.each(function(){                  //底部按钮点击切换图片
        $(this).on('click',function(){
            if(oList.is(":animated") || $(this).attr('class') == "on"){
                return;
            }
            var myIndex = $(this).attr('index');
            var offset = (myIndex - index) * -oWidth;
            index = myIndex;
            animate(offset);
            showBtns();
        })
    })

    autoplay();
});