webpackHotUpdate(0,{

/***/ 187:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vue = __webpack_require__(75);

var _vue2 = _interopRequireDefault(_vue);

var _vueResource = __webpack_require__(110);

var _vueResource2 = _interopRequireDefault(_vueResource);

var _vueRouter = __webpack_require__(13);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _vueScroll = __webpack_require__(111);

var _vueScroll2 = _interopRequireDefault(_vueScroll);

var _state = __webpack_require__(43);

var _router = __webpack_require__(100);

var _router2 = _interopRequireDefault(_router);

var _store = __webpack_require__(107);

var _store2 = _interopRequireDefault(_store);

var _App = __webpack_require__(109);

var _App2 = _interopRequireDefault(_App);

var _fastclick = __webpack_require__(108);

var _fastclick2 = _interopRequireDefault(_fastclick);

var _router_v = __webpack_require__(103);

var _router_v2 = _interopRequireDefault(_router_v);

var _router_empty = __webpack_require__(101);

var _router_empty2 = _interopRequireDefault(_router_empty);

var _router_v3new = __webpack_require__(104);

var _router_v3new2 = _interopRequireDefault(_router_v3new);

var _router_v2new = __webpack_require__(102);

var _router_v2new2 = _interopRequireDefault(_router_v2new);

var _axios = __webpack_require__(74);

var _axios2 = _interopRequireDefault(_axios);

var _urlParse = __webpack_require__(106);

var _urlParse2 = _interopRequireDefault(_urlParse);

var _getUid = __webpack_require__(105);

var _getUid2 = _interopRequireDefault(_getUid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueResource2.default);
_vue2.default.use(_vueRouter2.default);
_vue2.default.use(_vueScroll2.default);

/*********************************刘洋新增配置********************************/


// var VConsole = require('vconsole');
// var vConsole = new VConsole();

_fastclick2.default.attach(document.body);

//首页图片轮播跳外链后，如果是同域的跳转，查询本地存储是否有用户信息，决定跳转后的登陆状态
if (localStorage.user) {
    _store2.default.commit('CHANGE_ISLOGIN', 1);
}

var params = (0, _urlParse2.default)();

if (params.viewSourceUrl) {
    sessionStorage.setItem('viewSourceUrl', params.viewSourceUrl);
} else {
    sessionStorage.setItem('viewSourceUrl', document.referrer);
}

// if (params.viewSourceUrl) {
//     store.commit('CHANGE_VIEW_SOURCE_URL', params.viewSourceUrl);
// }
var routerMap;
var routerNew = { 'v2_new': _router_v2new2.default, 'v3_new': _router_v3new2.default
    //判断学校版本
};var i = window.location.href.indexOf('scode=');
var SCODE;
if (i == -1) {
    SCODE = '';
    routerMap = _router2.default;
    new _vue2.default({
        el: "#app",
        router: routerMap,
        store: _store2.default,
        render: function render(h) {
            return h(_App2.default);
        }
    });
} else {
    SCODE = window.location.href.substr(i + 6, 6);

    var uidObj = (0, _getUid2.default)();
    var uid = uidObj.uid;

    localStorage.setItem('scode', SCODE);
    sessionStorage.setItem('uid', uid ? uid : '');

    if (uidObj.spreadToken) {
        //就算地址栏有spreadToken，也要通过请求判断是否是该用户的第一次扫码的spreadToken
        _axios2.default.get(_state.state.host + '/front/spread/bindUserAndSpread?frontUserId=' + (uid ? uid : '') + '&spreadToken=' + uidObj.spreadToken).then(function (res) {
            console.log(res);
            // alert('请求接口为：'+(state.host + '/front/spread/bindUserAndSpread?frontUserId=' + (uid?uid:'') + '&spreadToken=' + uidObj.spreadToken))
            // alert('接口返回值为：'+res.data.data)
            sessionStorage.setItem('spreadToken', res.data.data);
            // alert('sessionStorage中的spreadToken为：'+sessionStorage.spreadToken)
        });
    } else {
        _axios2.default.get(_state.state.host + '/front/spread/getSpreaderByUserId?frontUserId=' + (uid ? uid : '') + '&sCode=' + localStorage.scode).then(function (res) {
            if (res.data.data) {
                sessionStorage.setItem('spreadToken', res.data.data);
            } else {
                sessionStorage.setItem('spreadToken', '');
            }
        });
    }

    _axios2.default.get(_state.state.host + '/front/template/findSchool/' + SCODE).then(function (res) {

        _store2.default.commit('CHANGE_ALLSCHOOLINFO', res.data);
        console.log(res.data.mobTemplate);
        if (i == -1) {
            routerMap = _router2.default;
        } else {
            if (JSON.stringify(res.data) == "{}") {
                routerMap = _router_empty2.default;
            } else if (res.data.mobTemplate == 'v3') {
                routerMap = _router_v2.default;
            } else if (res.data.mobTemplate == 'v2') {
                routerMap = _router2.default;
            } else {
                _store2.default.commit('CHANGE_VERSION', res.data.mobTemplate);
                sessionStorage.setItem('mVersion', res.data.mobTemplate);
                routerMap = routerNew[res.data.mobTemplate];
            }
        }

        new _vue2.default({
            el: "#app",
            router: routerMap,
            store: _store2.default,
            render: function render(h) {
                return h(_App2.default);
            }
        });
    });
}

/**************************************************************************/

/***/ })

})
//# sourceMappingURL=0.e92201d608805b5fa764.hot-update.js.map