/* 酷站代码整理 http://www.5icool.org */
/* 焦点图 */
//$(function(){
function slide(first) {
    var $root = $('#show'),
        root_w = $('#show .img img').width();
    var p = $root.find('> div.img > span');
	
    var btns = $('#show .btns li');
    if (first) {
        p.children().eq(0).clone().appendTo(p);
        si = null;
    }
    var n = p.children().length - 1;

    // slast -> 如果播放完最后1张，要如何处理
    //    true 平滑切换到第1张
    var cur = 0,
        max = n - 1,
        dur = .6 * 1000; /* ms */
    p.stop();
	p.css({left: -1 * root_w * cur});
	onoff(0);
	p.children().eq(p.children().length - 2).clone().appendTo('.mk1');
    if(si){
        clearInterval(si);
    }
    function go(dir, slast) {
        if (dir === 0) {
            onoff(cur, -1);
            p.css({left: -1 * root_w * cur});
            return;
        }
        var t;
        if (dir > 0) {
            t = cur + 1;
            if (t <= max) {
                return dgo(t);
            }
            return dgo(t, function () {
                p.css({left: 0});
            });
        } else {
            t = cur - 1;
            if (t < 0) {
                t = max;
                p.css({left: -1 * root_w * (max + 1)});
                return dgo(t);
            } else {
                return dgo(t);
            }
        }
    }
    function onoff(on, off) {
        btns.removeClass('on');
        (on !== -1) && btns.eq(on).addClass('on');
        //(off !== -1) && btns.eq(off).removeClass('on');
    }
    function dgo(n, comp) {
        var idx = n > max ? 0 : n;
        onoff(idx, cur);
        cur = idx;
        p.stop().animate({left: -1 * root_w * n}, {duration: dur, complete: comp});
        if (idx == 0) {
            p.children().eq(n - 2).clone().appendTo('.mk1');
        } else {
            $('.mk1').empty()
        }
        ;
    }

    var pn_btn = $('#show .prev, #show .next');
    $('#show .btns').delegate('li', 'click', function (ev) {
        dgo(parseInt($(this).attr('data')));
    });
    $('#show .btns').delegate('s', 'click', function (ev) {
        go($(this).is('.prev') ? -1 : 1, true);
    });

    // 自动播放
    //var ie6 = $.browser.msie && $.browser.version < '7.0';
    var ie6 = false;
    $root.hover(function (ev) {
        // $root[(ev.type == 'mouseenter' ? 'add' : 'remove') + 'Class']('show-hover');
        if (ie6) {
            pn_btn[ev.type == 'mouseenter' ? 'show' : 'hide']();
        } else {
            pn_btn.stop()['fade' + (ev.type == 'mouseenter' ? 'In' : 'Out')]('fast');
        }
    });
    if ($root.attr('rel') == 'autoPlay') {
        si = setInterval(function () {
            go(1, true);
        }, 5000);
        /*p.mouseover(function () {
            clearInterval(si);
        });
        p.mouseout(function () {
            si = setInterval(function () {
                go(1, true);
            }, 5000);
        });
		btns.mouseover(function () {
            clearInterval(si);
        });
        btns.mouseout(function () {
            si = setInterval(function () {
                go(1, true);
            }, 5000);
        });*/
    }
    var wid = $(document.body).width(), swid;
    swid = wid > 1366 ? (wid - 1200) / 2 : (wid - 1000) / 2;
    $('#show').css('width', wid);
    $('#show .img').css('width', wid);
    $('#show .btns').css('left', swid)
    $('.masks').css('width', swid);
    $('.mk2').css('right', 0);
    $('#show .img span').css(({paddingLeft: swid}));
    $(window).resize(function () {
        var wid = $(document.body).width(), swid;
        swid = wid > 1366 ? (wid - 1200) / 2 : (wid - 1000) / 2;
        $('#show').css('width', wid);
        $('#show .img').css('width', wid);
        $('#show .btns').css('left', swid)
        $('.masks').css('width', swid);
        $('.mk2').css('right', 0);
        $('#show .img span').css(({paddingLeft: swid}));
    });
}
        //$(#show .img)
//})();