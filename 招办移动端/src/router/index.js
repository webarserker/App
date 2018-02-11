import Vue from 'vue'
import Router from 'vue-router'

import ContentList1 from '../container/contentList1'
import ContentList2 from '../container/contentList2'
import ContentList3 from '../container/contentList3'
import ContentList4 from '../container/contentList4'
import Entry from '../container/entry'
import News1 from '../container/news1'
import News2 from '../container/news2'
import News3 from '../container/news3'
import Login from '../container/login'
import Home from '../container/home'
import Feedback from '../container/feedback'
import Forum from '../container/forum'
import AboutUs from '../container/aboutUs'

import CodeLogin from '../container/codeLogin'
import About from '../container/about'


Vue.use(Router)

export default new Router({
  // mode:'history',
  routes: [{
    path: '/',
    redirect: '/login'
  },{
    name:'About',
    path:'/about',
    component:About
  },{
    name:'Login',
    path:'/login',
    component:Login
  },{
    name:'CodeLogin',
    path:'/codeLogin',
    component:CodeLogin
  },{
    path:'/home',
    component:Home,
    redirect:'/home/entry',
    children:[{
      name:'Entry',
      path:'entry',
      component:Entry
    },{
      name:'ContentList1',
      path:'contentList1',
      component:ContentList1,
      children:[{
        name:'News1',
        path:':newsid',
        component:News1
      }]
    },{
      name:'ContentList2',
      path:'contentList2',
      component:ContentList2,
      children:[{
        name:'News2',
        path:':newsid',
        component:News2
      }]
    },{
      name:'ContentList3',
      path:'contentList3',
      component:ContentList3,
      children:[{
        name:'News3',
        path:':newsid',
        component:News3
      }]
    },{
      name:'ContentList4',
      path:'contentList4',
      component:ContentList4,
      children:[{
        name:'Feedback',
        path:'feedback',
        component:Feedback
      },{
        name:'Forum',
        path:'forum',
        component:Forum
      },{
        name:'AboutUs',
        path:'aboutUs',
        component:AboutUs
      }]
    }]
  }]
})
