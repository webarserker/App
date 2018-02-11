import Vue from 'vue'
import Router from 'vue-router'

import Home from '../container/home.vue'
import ArticleList from '../container/articleList.vue'
import ArticleDetail from '../container/articleDetail.vue'
import SearchPage from '../container/searchPage.vue'
import Tels from '../container/tels.vue'
import ArticleListByType from '../container/articleListByType.vue'
import ArticleDetailByType from '../container/ArticleDetailByType.vue'
import SecondCatList from '../container/secondCatList.vue'



Vue.use(Router)

export default new Router({
  // mode:'history',
  routes: [{
    path:'/',
    redirect:'/home'
  },{
    path:'/home',
    name:'Home',
    component:Home
  },{
    path:'/secondCatList',
    name:'SecondCatList',
    component:SecondCatList
  },{
    path:'/articleList',
    name:'ArticleList',
    component:ArticleList
  },{
    path:'/articleDetail',
    name:'ArticleDetail',
    component:ArticleDetail
  },{
    path:'/searchPage',
    name:'SearchPage',
    component:SearchPage
  },{
    path:'/tels',
    name:'Tels',
    component:Tels
  },{
    path:'/articleListByType',
    name:'ArticleListByType',
    component:ArticleListByType
  },{
    path:'/articleDetailByType',
    name:'ArticleDetailByType',
    component:ArticleDetailByType
  }]
})
