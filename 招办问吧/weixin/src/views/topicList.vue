<template>
    <div class="box box-ver h-p100 of-hide">
        <div class="box box-ac tab">
            <div @click="showSchoolList()" :class="actTabIndex==0?'act':''" class="tab-item box box-f1 box-fh box-ac box-pc">
                <div>高校</div>
                <div class="arrow icon icon-arrow-bot icon-arrow-top-act"></div>
            </div>
            <div @click="getDepartmentList()" :class="actTabIndex==1?'act':''" class="tab-item box box-f1 box-fh box-ac box-pc">
                <div>院系</div>
                <div class="arrow icon icon-arrow-bot icon-arrow-top-act"></div>
            </div>
            <div @click="getMajorList()" :class="actTabIndex==2?'act':''" class="tab-item box box-f1 box-fh box-ac box-pc">
                <div>专业</div>
                <div class="arrow icon icon-arrow-bot icon-arrow-top-act"></div>
            </div>
        </div>
        <div v-if="actTabIndex === 0" @click="actTabIndex = -1" class="tab-list-container">
            <div @click="$event.stopPropagation()" class="tab-list box box-ver animated bounceInDown">
                <div :class="item.code==sCode?'act':''" v-for="(item,index) in schoolList" @click="getTopicList(item.code)" class="list-item box box-ac">{{item.name}}</div>
            </div>
        </div>
        <div v-if="actTabIndex === 1" @click="actTabIndex = -1" class="tab-list-container">
            <div @click="$event.stopPropagation()" class="tab-list box box-ver animated bounceInDown">
                <div :class="{'act':item.id==departmentId,'error':item.type=='error'}" v-for="(item,index) in departmentList" @click="getTopicList(item.id)" class="list-item box box-ac">{{item.name}}</div>
            </div>
        </div>
        <div v-if="actTabIndex === 2" @click="actTabIndex = -1" class="tab-list-container">
            <div @click="$event.stopPropagation()" class="tab-list box box-ver animated bounceInDown">
                <div :class="{'act':item.id==majorId,'error':item.type=='error'}" v-for="(item,index) in majorList" @click="getTopicList(item.id)" class="list-item box box-ac">{{item.name}}</div>
            </div>
        </div>
        <div ref="scrollContent"  class="box box-ver topic-list box-f1">
            <div v-for="item in topicList" @click="goTopicDetail(item)" :style="{'background-image':'url('+$store.state.hostImg + item.imgUrl+')'}"  class="box topic-item box-ver" >
                <div class="create-user box box-ac">
                    <div v-text="showStatus(item.status)" class="box">
                    </div>
                    <div class="box box-f1"></div>
                    <a class="link" >{{item.schoolName}}</a>
                </div>
                <div class="box-f1"></div>
                <div class="box-pc box title tx-c">
                    {{item.title}}
                </div>
                <div class="box box-ac">
                    <div class="create-college box box-ac box-f1 box-fh">
                        <div :style="{'background-image':'url('+$store.state.hostSchoolLogo + item.schoolLogo+')'}" class="icon icon-head" ></div>
                        <div class="name ellipsis box-f1">{{item.belongName}}</div>
                    </div>
                    <!--<div v-text="showStatus(item.status)" class="box box-ac box-pc box-f1 box-fh status">
                    </div>-->
                    <div class="box box-ac collect">
                        <div class="box-f1"></div>
                        <div  class="icon icon-collect-act"></div>
                        <div class="num">{{item.subscribeNum}}</div>
                    </div>
                </div>
            </div>
            <v-loading :isRequest="isRequest" :showEnd="showEnd" :msg="'没有更多话题了'"></v-loading>
        </div>
        <div v-if="$store.state.userInfo.isTopicAdmin == 1" :class="hideFooter?'hide-foot':''"  @click="checkLogin('./topicCreate')" class="topic-create box box-pc box-ac footer">
            <div class="icon icon-create-topic"></div>
            <div class="txt">我要创建话题</div>
        </div>
    </div>
</template>

<script>
// import {mapGetters} from 'vuex'
import { Toast } from 'mint-ui'
import { scrollController } from '../utils/common'
var delay
export default {
  name: 'hello',
  components: {
    'v-header': require('../components/header.vue'),
    "v-loading": require('../components/loading.vue')
  },
  data () {
    return {
      actTabIndex: -1,
      schoolList: [{name: '全部', code: ''}],
      departmentList: [],
      topicList: [],
      showTabListFlag: false,
      curPage: 1,
      ArrStatus: ['待审核', '进行中...', '此话题已关闭'],
      hideFooter: false,
      isRequest: true,
      showEnd:false,
      sCode:'',
      departmentId: '',
      majorId: '',
      lastScrollTop: 0
    }
  },
  mounted () {
    var self = this
    scrollController({
      ele: self.$refs.scrollContent,
      delay: 33,
      scrollCb (lastScrollTop) {
        self.lastScrollTop = lastScrollTop
      },
      upCb () {
        self.hideFooter = true
      },
      downCb () {
        self.hideFooter = false
      },
      endCb () {
        self.loadMore()
      }
    })
    var subscribeList = self.$store.state.subscribeList
    if (window.sessionStorage.getItem(''+window.location.href)) {
      var data = JSON.parse(window.sessionStorage.getItem(''+window.location.href))
      for(var key in data){
        self[key] = data[key]
      }
      // 同步订阅数目
      self.topicList.forEach(function(item,index) {
        self.$store.state.subscribeList.forEach(function(topicId,index1) {
          if (item.id == topicId) {
            self.topicList[index].subscribeNum++
          }
        })
      })
      self.$store.state.subscribeList = []
      setTimeout(()=>{
        self.$refs.scrollContent.scrollTop = self.lastScrollTop
      },0)
      return
    }
    this.checkFrom()
    this.getTopicList()
    this.getSchoolList()
  },
  // beforeRouteEnter (to, from, next) {
  //     // ... this取不到
  //     var lastScrollTop = window.sessionStorage.getItem(''+window.location.href)
  //     if (lastScrollTop) {
  //       setTimeout(()=>{
  //         document.querySelector('.topic-list').scrollTop = lastScrollTop
  //       },0)
  //     }
  //     next()
  // },
  beforeRouteLeave (to, from, next) {
      var self = this
      window.sessionStorage.setItem(''+window.location.href,JSON.stringify(this.$data))
      //window.sessionStorage.setItem(''+window.location.href,self.lastScrollTop)
      next()
  },
  methods: {
    loadMore () {
      if (this.showEnd) return
      if (!this.isRequest) {
        this.curPage++
        this.getTopicList()
      }
    },
    // 判断页面从哪里过来的
    checkFrom () {
      if (this.$route.query.sCode) {
        // console.log('来自详情')
        this.sCode = this.$route.query.sCode
        this.departmentId = this.$route.query.departmentId
        this.majorId = this.$route.query.majorId
      } else {
        // console.log('来自返回或其他')
        this.sCode = this.$store.state.sCode
        this.departmentId = this.$store.state.departmentId
        this.majorId = this.$store.state.majorId
      }
    },
    checkLogin(router) {
      var self = this
      var state = self.$store.state
      self.$router.push(router)
      // if (!state.isLogin) {
      //   self.$store.commit('SET_LOGINNEXTROUTER', router)
      //   self.$router.push('/login')
      // } else {
      //   self.$router.push(router)
      // }
    },
    goTopicDetail (item) {
      var self = this
      self.checkLogin('/topicDetail?topicId=' + item.id)
    },
    showSchoolList () {
      this.actTabIndex = (this.actTabIndex === 0) ? -1 : 0;
    },
    getSchoolList () { 
      var self = this
      var state = self.$store.state
      self.schoolList = [{name: '全部', code: ''}]
      //console.log('>>>',state.sCode)
      this.$http.get(state.host + state.baseUrl + '/common/findSchoolList')
        .then(res => {
          var data = res.data.data
          self.schoolList = self.schoolList.concat(data)
        })
    },
    getDepartmentList () {
      var self = this
      var state = self.$store.state
      if (self.actTabIndex === 1) {
        self.actTabIndex = -1
        return false
      }
      if (!self.sCode) {
        self.departmentList = [{name: '请先选择高校', id: '', type:'error'}]
        self.actTabIndex = 1
        return false
      }
      self.departmentList = [{name: '全部', id: ''}]
      self.isRequest = true
      this.$http.get(state.host + state.baseUrl + '/common/findDepartmentList?sCode=' + self.sCode)
        .then(res => {
          var data = res.data.data
          self.isRequest = false
          self.departmentList = self.departmentList.concat(data)
          self.actTabIndex = 1
        })
    },
    getMajorList () {
      var self = this
      var state = self.$store.state
      if (self.actTabIndex === 2) {
        self.actTabIndex = -1
        return
      }
      if (!self.sCode) {
        self.majorList = [{name: '请先选择高校', id: '', type:'error'}]
        self.actTabIndex = 2
        return
      }
      if (!self.departmentId) {
        self.majorList = [{name: '请先选择院系', id: '', type:'error'}]
        self.actTabIndex = 2
        return
      }
      self.isRequest = true
      self.majorList = [{name: '全部', id: ''}]    
      this.$http.get(state.host + state.baseUrl + '/common/findMajorList?departId=' + self.departmentId)
        .then(res => {
          var data = res.data.data
          self.isRequest = false
          self.majorList = self.majorList.concat(data)
          self.actTabIndex = 2
        })
    },
    showStatus (status) {
      return this.ArrStatus[status]
    },
    getTopicList (code) {
      var self = this
      var actTabIndex = self.actTabIndex
      var state = self.$store.state
      if (actTabIndex === 0) {
        if (!this.$route.query.sCode) {
          self.$store.commit('SET_SCODE', code)
          self.$store.commit('SET_DEPARTMENTID', '')
          self.$store.commit('SET_MAJORID', '')
        }
        this.sCode = code
        this.departmentId = ''
        this.majorId = ''
      } else if (actTabIndex === 1) {
        if (!this.$route.query.sCode) {
          self.$store.commit('SET_DEPARTMENTID', code)
          self.$store.commit('SET_MAJORID', '')
        }
        this.departmentId = code
        this.majorId = ''
      } else if (actTabIndex === 2) {
        if (!this.$route.query.sCode) {
          self.$store.commit('SET_MAJORID', code)
        }
        this.majorId = code
      }
      if (self.actTabIndex >= 0) {
        self.curPage = 1
        self.showEnd = false
      }
      self.actTabIndex = -1
      self.isRequest = true
      var url = state.host + state.baseUrl + '/topic/findTopicList?sCode=' + self.sCode + '&departmentId=' + self.departmentId + '&majorId=' + self.majorId + '&curPage=' + self.curPage + '&pageSize=5'
      this.$http.get(url).then(res => {
        var data = res.data.data.data
        setTimeout(()=>{
          self.isRequest = false
        },Math.random*1000)
        if (!data || data.length === 0) {
          if (self.curPage === 1) {
            Toast({message: '还没有题主创建话题', duration: 1000})
            self.topicList = []
          } else {
            self.showEnd = true
          }
          self.curPage--
        } else {
          if (self.curPage === 1) self.topicList = []
          self.topicList = self.topicList.concat(data)
        }
      }, err => {
        self.isRequest = false
        self.curPage--
        // console.log(err)
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import '../css/color.scss';
    @import '../css/mixins.scss';
    @import '../css/topicList.scss';
    .arrow{
        width: .30rem;
        height: .16rem;
        margin-left:.3rem;
    }
    .tab{
        height:.72rem;
        position:absolute !important;
        top:1.1rem;
        width:100%;
        background-color:$theme-bg;
        z-index:10;
        @include border-1px($border-color);
        .tab-item{
            border-right:2px solid $theme-color;
            &:last-child{
                border:0;
            }
            &.act{
                color:$theme-color;
                .icon-arrow-bot{
                  @include bg-image('../img/icon-arrow-top-act');
                }
                .icon-category{
                  @include bg-image('../img/icon-category-act');
                }
            }
            
        }
    }
    .tab-list-container{
        position:absolute;
        z-index:20;
        top:1.83rem; 
        width:100%;
        height:calc(100% - 1.11rem - .74rem);
        background-color:rgba(0,0,0,.3);
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .tab-list{
            padding-left:.1rem;
            padding-right:.1rem;
            background-color:#FFF;
            .list-item{
                &.act{
                    color:$theme-color;
                }
                &.error{
                  color:$error-red;
                }
                height:.7rem;
                padding-left:.27rem;
                padding-right:.27rem;
                border-bottom:.01rem solid $border-color;
                color:#666;
            }
        }
    }
    .topic-list{
        margin-top:1.84rem;
        padding-bottom:1rem;
    }
    .topic-create{
        position:absolute;
        bottom:0;
        width:100%;
        height:1rem;
        background-color: #f9f9f9;
        border-top:.01rem solid $border-color;
        color:$theme-color;
        .txt{
            margin-left:.22rem;
        }
    }
    .icon-create-topic{
        width:.48rem;
        height:.48rem;
    }
</style>
