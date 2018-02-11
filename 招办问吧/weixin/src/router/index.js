import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home.vue'
import topicList from '../views/topicList.vue'
import topicCreate from '../views/topicCreate.vue'
import topicDetail from '../views/topicDetail.vue'
import topicDetail1 from '../views/topicDetail1.vue'
import commentsList from '../views/commentsList.vue'
import userCommentsList from '../views/userCommentsList.vue'
import userTopicDetail from '../views/userTopicDetail.vue'
import userNews from '../views/userNews.vue'
import userAbout from '../views/userAbout.vue'
import userTopicList from '../views/userTopicList.vue'
import userSubscribe from '../views/userSubscribe.vue'
import Login from '../views/login.vue'
import Register from '../views/register.vue'
import ForgetPwd from '../views/forgetPwd.vue'
import Updatepwd from '../views/updatePwd.vue'
import Userinfo from '../views/userinfo.vue'
import Userlist from '../views/userlist.vue'
import Userdetail from '../views/userdetail.vue'
import usertab1 from '../views/userlistTab1.vue'
import usertab2 from '../views/userlistTab2.vue'
import usertab3 from '../views/userlistTab3.vue'
import userFriendAdmin from '../views/userFriendAdmin.vue'
import userFriend from '../views/userFriend.vue'
import friends from '../views/friends.vue'

Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}
Vue.use(Router)

export default new Router({
  history: true,
  saveScrollPosition: true,
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/',
          component: topicList,
          meta: {
            pageTitle: '招办问吧',
            keepAlive: true // 需要被缓存
          }
        },
        {
          path: '/topicDetail',
          component: topicDetail,
          meta: {
            pageTitle: '加载中...'
          }
        },
        {
          path: '/commentsList',
          
          component: commentsList,
          meta: {
            pageTitle: '加载中...',
            //keepAlive: true // 需要被缓存
          }
        },
        {
          path: '/topicCreate',
          component: topicCreate,
          meta: {
            pageTitle: '创建话题'
          }
        }
      ]
    },
    {
      path: '/topicDetail1',
      component: topicDetail1,
      meta: {
        pageTitle: '加载中...'
      }
    },
    {
      path: '/userNews',
      component: userNews,
      meta: {
        pageTitle: '我的消息'
      }
    },
    {
      path: '/userSubscribe',
      component: userSubscribe,
      meta: {
        pageTitle: '已订阅的话题'
      }
    },
    {
      path: '/userCommentsList',
      component: userCommentsList,
      meta: {
        pageTitle: '我的问答记录'
      }
    },
    {
      path: '/userTopicDetail',
      component: userTopicDetail,
      meta: {
        pageTitle: '加载中...'
      }
    },
    {
      path: '/userTopicList',
      component: userTopicList,
      meta: {
        pageTitle: '我的坐席'
      }
    },
    {
      path: '/userAbout',
      component: userAbout,
      meta: {
        pageTitle: '关于'
      }
    },
    {
      path: '/login',
      component: Login,
      meta: {
        pageTitle: '登录'
      }
    },
    {
      path: '/register',
      component: Register,
      meta: {
        pageTitle: '注册'
      }
    },
    {
      path: '/forgetpwd',
      component: ForgetPwd,
      meta: {
        pageTitle: '忘记密码'
      }
    },
    {
      path: '/updatepwd',
      component: Updatepwd,
      meta: {
        pageTitle: '修改密码'
      }
    },
    {
      path: '/userinfo',
      component: Userinfo,
      meta: {
        pageTitle: '个人信息'
      }
    },
    {
      path: '/userdetail',
      component: Userdetail,
      meta: {
        pageTitle: '个人详情'
      }
    },
    {
      path: '/userlist',
      component: Userlist,
      meta: {
        pageTitle: '用户列表'
      },
      redirect: '/userlist/usertab1',
      children: [
        {
          path: '/userlist/usertab1',
          component: usertab1,
          meta: {
            pageTitle: '用户列表'
          }
        },
        {
          path: '/userlist/usertab2',
          component: usertab2,
          meta: {
            pageTitle: '我的好友'
          }
        },
        {
          path: '/userlist/usertab3',
          component: usertab3,
          meta: {
            pageTitle: '好友动态'
          }
        }
      ]
    },
    {
      path: '/userfriendadmin',
      component: userFriendAdmin,
      meta: {
        pageTitle: '好友资料'
      }
    },
    {
      path: '/userfriend',
      component: userFriend,
      meta: {
        pageTitle: '好友资料'
      }
    },
    {
      path: '/friend',
      component: friends,
      meta: {
        pageTitle: '我的好友'
      },
      children: [
        {
          path: '/friend',
          component: usertab2,
          meta: {
            pageTitle: '我的好友'
          }
        }
      ]
    }
  ]
})
