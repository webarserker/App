(function() {
    var TOUCHSTART, TOUCHMOVE, TOUCHEND;
    if(typeof(window.ontouchstart) != 'undefined') {
        TOUCHSTART = 'touchstart';
        TOUCHEND = 'touchend';
        TOUCHMOVE = 'touchmove';

    } else if(typeof(window.onmspointerdown) != 'undefined') {
        TOUCHSTART = 'MSPointerDown';
        TOUCHEND = 'MSPointerUp';
        TOUCHMOVE = 'MSPointerMove';
    } else {
        TOUCHSTART = 'mousedown';
        TOUCHEND = 'mouseup';
        TOUCHMOVE = 'mousemove';
    }

    function tap(node) {
        var x, y, startTime = 0,
            endTime = 0,
            in_dis = false;
        node.oncontextmenu = function() {
            return false;
        }
        node.addEventListener(TOUCHSTART, function(e) {
            x = e.touches[0].pageX;
            y = e.touches[0].pageY;
            startTime = (new Date()).getTime();
        });

        node.addEventListener(TOUCHEND, function(e) {
            e.stopPropagation();
            e.preventDefault();
            var curx = e.changedTouches[0].pageX;
            var cury = e.changedTouches[0].pageY;
            if(Math.abs(curx - x) < 6 && Math.abs(cury - y) < 6) {
                in_dis = true;
            } else {
                in_dis = false;
            }
            endTime = (new Date()).getTime();
            if(endTime - startTime > 300 && in_dis) {
                e.target.dispatchEvent(new CustomEvent('longtap', {
                    'detail': e
                }));
            } else {
                e.target.dispatchEvent(new CustomEvent('tap', {
                    'detail': e
                }));
            }
        });
    }

    tap(document);
})();