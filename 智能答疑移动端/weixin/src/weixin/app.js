import Vue from "vue";
import VueResource from "vue-resource"
import VueRouter from "vue-router"
import vScroll from "vue-scroll"
import {state} from './vuex/state'

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(vScroll)
import routerV2 from "./router/router"
import store from "./vuex/store"
import App from "./views/App.vue"
import fastclick from 'fastclick'


/*********************************刘洋新增配置********************************/
import routerV3 from './router/router_v3'
import routerEmpty from './router/router_empty'
import routerV3New from './router/router_v3new'
import routerV2New from './router/router_v2new'
import axios from 'axios'
import urlParse from './utils/urlParse.js'
import getUidObj from './utils/getUid.js'


// var VConsole = require('vconsole');
// var vConsole = new VConsole();

fastclick.attach(document.body)

//首页图片轮播跳外链后，如果是同域的跳转，查询本地存储是否有用户信息，决定跳转后的登陆状态
if(localStorage.user){
    store.commit('CHANGE_ISLOGIN',1);
}



var params = urlParse();

if (params.viewSourceUrl){
    sessionStorage.setItem('viewSourceUrl',params.viewSourceUrl);
}else{
    sessionStorage.setItem('viewSourceUrl', document.referrer);
}



// if (params.viewSourceUrl) {
//     store.commit('CHANGE_VIEW_SOURCE_URL', params.viewSourceUrl);
// }
var routerMap;
var routerNew = {'v2_new': routerV2New, 'v3_new': routerV3New}
//判断学校版本
var i = window.location.href.indexOf('scode=');
var SCODE;
if (i == -1) {
    SCODE = '';
    routerMap = routerV2;
    new Vue({
        el: "#app",
        router: routerMap,
        store,
        render: h => h(App)
    })
} else {
    SCODE = window.location.href.substr(i + 6, 6);

    var uidObj = getUidObj();
    var uid = uidObj.uid;

    localStorage.setItem('scode',SCODE);
    sessionStorage.setItem('uid',uid?uid:'');


    if (uidObj.spreadToken) {
        //就算地址栏有spreadToken，也要通过请求判断是否是该用户的第一次扫码的spreadToken
        axios.get(state.host + '/front/spread/bindUserAndSpread?frontUserId=' + (uid?uid:'') + '&spreadToken=' + uidObj.spreadToken).then(res => {
            console.log(res);
            // alert('请求接口为：'+(state.host + '/front/spread/bindUserAndSpread?frontUserId=' + (uid?uid:'') + '&spreadToken=' + uidObj.spreadToken))
            // alert('接口返回值为：'+res.data.data)
            sessionStorage.setItem('spreadToken', res.data.data);
            // alert('sessionStorage中的spreadToken为：'+sessionStorage.spreadToken)
        })
    } else {
        axios.get(state.host + '/front/spread/getSpreaderByUserId?frontUserId=' + (uid?uid:'') + '&sCode=' + localStorage.scode).then(res => {
            if (res.data.data) {
                sessionStorage.setItem('spreadToken', res.data.data);
            } else {
                sessionStorage.setItem('spreadToken', '');
            }
        })
    }


    axios.get(state.host + '/front/template/findSchool/' + SCODE).then((res) => {

        store.commit('CHANGE_ALLSCHOOLINFO',res.data)
        console.log(res.data.mobTemplate);
        if (i == -1) {
            routerMap = routerV2;
        } else {
            if (JSON.stringify(res.data) == "{}") {
                routerMap = routerEmpty;
            } else if (res.data.mobTemplate == 'v3') {
                routerMap = routerV3;
            } else if (res.data.mobTemplate == 'v2') {
                routerMap = routerV2;
            } else {
                store.commit('CHANGE_VERSION', res.data.mobTemplate);
                sessionStorage.setItem('mVersion', res.data.mobTemplate);
                routerMap = routerNew[res.data.mobTemplate];
            }
        }

        new Vue({
            el: "#app",
            router: routerMap,
            store,
            render: h => h(App)
        })
    })
}


/**************************************************************************/

