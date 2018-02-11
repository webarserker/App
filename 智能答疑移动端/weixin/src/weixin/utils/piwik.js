export default {
    initPiwik:function(schoolid, userid) {
        var _paq = window._paq = window._paq || [];
        _paq.push(["setDomains", ["*.weixin.zhinengdayi.com"]]);

        //_paq.push(['setCustomVariable',1,"school",'${school.identify}',"page"]);
        _paq.push(['setCustomVariable', 1, "school", schoolid, "page"]);

        // <c:if test="${frontUser != null}">
        // _paq.push(['setUserId', '${frontUser.id}']);
        // </c:if>
        if (userid) {
            _paq.push(['setUserId', userid + '']);
        };

        if (location.pathname != '/article.html') {
            _paq.push(['trackPageView']);
        }
        _paq.push(['enableLinkTracking']);

        // console.info(schoolid, userid);

        (function() {
            var u = "//piwik.zhinengdayi.com/piwik/";
            _paq.push(['setTrackerUrl', u + 'piwik.php']);
            _paq.push(['setSiteId', '2']);
            var d = document,
                g = d.createElement('script'),
                s = d.getElementsByTagName('script')[0];
            g.type = 'text/javascript';
            g.async = true;
            g.defer = true;
            g.src = u + 'piwik.js';
            s.parentNode.insertBefore(g, s);
        })();
    },
    piwikReady:function (cb) {
        //
        if (typeof cb === 'function') {
            piwikReady._list = piwikReady._list || [];
            piwikReady._list.push(cb);
        };
        //
        if (!window.Piwik) {
            piwikReady._timer = piwikReady._timer || setInterval(piwikReady, 10);
        } else {
            clearInterval(piwikReady._timer);
            piwikReady._timer = null;
            //
            if (piwikReady._list) {
                piwikReady._list.forEach(function(fn) {
                    try {
                        fn();
                    } catch (e) {};
                });
                piwikReady._list = [];
            };
        };
    }
}
