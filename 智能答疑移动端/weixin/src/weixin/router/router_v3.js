import VueRouter from "vue-router"

// const App = resolve => require(["../views/App.vue"],resolve)
import layoutV3 from "../views/v3/layout_v3.vue"
import homeV2 from "../views/v3/home_v3.vue"
import articleList from "../views/articleList.vue"
import articleDetail from "../views/articleDetail.vue"
import articleDetail2 from "../views/articleDetail2.vue"
import quickAsk from "../views/quickAsk.vue"
import normalQuestion from "../views/normalQuestion.vue"
import search from "../views/search.vue"
import videoList from "../views/videoList.vue"
import onlineAsk from "../views/onlineAsk.vue"
import login from "../views/login.vue"
import register from "../views/register.vue"
import updateUser from "../views/updateUser.vue"
import updatePwd from "../views/updatePwd.vue"
import msgNotice from "../views/msgNotice.vue"
import sendQuestion from "../views/sendQuestion.vue"
import noticeList from "../views/noticeList.vue"
import schListHeader from "../views/schListHeader.vue"
import schListCollected from "../views/schListCollected.vue"
import schListHot from "../views/schListHot.vue"
import schListAll from "../views/schListAll.vue"


export default new VueRouter({
    routes: [{
        path: '/',
        component: layoutV3,
        children: [{
            path: '/', //首页
            component: homeV2
        }, {
            path: '/articleList', //二级文章列表
            component: articleList
        }, {
            path: '/quickAsk', //快速查询
            component: quickAsk
        }, {
            path: '/normalQuestion', //常见问题
            component: normalQuestion
        }, {
            path: '/search', //搜索
            component: search
        }, {
            path: '/videoList', //视频列表
            component: videoList
        }, {
            path: '/onlineAsk', //在线问答
            component: onlineAsk
        }, {
            path: '/login', //登录
            component: login
        }, {
            path: '/register', //注册
            component: register
        }, {
            path: '/updateUser', //个人中心（修改）
            component: updateUser
        }, {
            path: '/updatePwd', //修改密码（找回）
            component: updatePwd
        }, {
            path: '/msgNotice', //消息通知
            component: msgNotice
        }, {
            path: '/sendQuestion', //留言咨询
            component: sendQuestion
        }, {
            path: '/noticeList', //留言咨询
            component: noticeList
        }]
    }, {
        path: '/articleDetail', //二级文章详情
        component: articleDetail
    }, {
        path: '/articleDetail2', //二级文章详情
        component: articleDetail2
    }, {
        path: '/schList',
        component: schListHeader,
        children: [{
            path: '/schList/collected',
            component: schListCollected
        }, {
            path: '/schList/hot',
            component: schListHot
        }, {
            path: '/schList/all',
            component: schListAll
        }, {
            path: '/schList/all/:openGroudId',
            component: schListAll
        }]
    }]
})
