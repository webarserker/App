<template>
  <div class="articleList">
    <SlideMenu :parentCatName="parentCatName">
      <span>
        {{(parentCatName ? parentCatName : '') + (parentCatName && infoCatName ? ' - ' : '') + (infoCatName ? infoCatName : '')}}
      </span>
    </SlideMenu>
    <div class="articleListScroll">
      <div class="prompt-container" v-show="!hasList">
        <div class="prompt-box">
          <i class="icon-nonedata"></i>
          <h1>抱歉，此页面暂无数据</h1>
        </div>
      </div>
      <ul v-show="hasList" v-infinite-scroll="loadMore"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="10">
        <li v-for="(item,index) in newsList" @click="isReadSave(item.id)">
          <img src="../common/image/unread.png" v-if="!item.isRead">
          <p>{{item.title}}</p>
          <h5>{{item.pulishTimeStr}}</h5>
        </li>
        <p class="no-data-text" v-show="noData">
          没有更多了
        </p>
      </ul>
    </div>
    <mFooter></mFooter>
    <Warning></Warning>
  </div>
</template>
<script>
  import Warning from '../components/warning.vue'
  import mHeader from '../components/header.vue'
  import mFooter from '../components/footer.vue'
  import SlideMenu from '../components/slideMenu.vue'

  export default {
    components: {Warning, mHeader, mFooter, SlideMenu},
    created() {
      this.$store.commit('SET_LOADING_STATU',true);

      this.$http.get(this.$store.state.host + '/front/findInfosByContentType' + '?contentType=' + this.$route.query.contentType + '&curPage=' + this.curPage + '&pageSize=' + this.pageSize+'&userId='+localStorage.fuserid).then(res => {
        res = res.body;
        if (res.code == '000000') {
          let data = res.data.page.data;
          this.newsList = data;
          if (this.newsList.length == 0) {
            this.hasList = false
          }
          if (data.length < this.pageSize) {
            this.noData = true;
          }
        }

        this.$store.commit('SET_LOADING_STATU',false);
      })
    },
    watch: {
      '$route'(to, from) {
        this.$store.commit('SET_LOADING_STATU',true);

        // 对路由变化作出响应...
        this.hasList = true
        this.noData = false
        this.newsList = []
        this.curPage = 1


        this.$http.get(this.$store.state.host + '/front/findInfosByContentType' + '?contentType=' + this.$route.query.contentType + '&curPage=' + this.curPage + '&pageSize=' + this.pageSize+'&userId='+localStorage.fuserid).then(res => {
          res = res.body;
          if (res.code == '000000') {
            let data = res.data.page.data;
            this.newsList = data;
            if (this.newsList.length == 0) {
              this.hasList = false
            }
            if (data.length < this.pageSize) {
              this.noData = true;
            }
          }

          this.$store.commit('SET_LOADING_STATU',false);
        })
      }
    },
    data() {
      return {
        parentCatName: '通知及公告',
        infoCatName: this.$route.query.contentType == 5 ? '紧急通知' : this.$route.query.contentType == 7 ? '部门动态' : '财务通知及公告',


        hasList: true,
        noData: false,
        newsList: [],
        curPage: 1,
        pageSize: 20
      }
    },
    methods: {
      isReadSave(id) {
//        this.$http.get(this.$store.state.host + '/front/infoContentUser/save?id=' + id+'&userId='+localStorage.fuserid).then(res => {
//          res = res.body;
          //该接口是保存已读，然后就是跳转到相应的详情页面
          this.$router.push({path: `/articleDetailByType?contentType=${this.$route.query.contentType}&articleId=${id}`})
//        })
      },
      loadMore() {
        if(!this.noData){

          this.$store.commit('SET_LOADING_STATU',true);

          this.curPage++;

          this.$http.get(this.$store.state.host + '/front/findInfosByContentType' + '?contentType=' + this.$route.query.contentType + '&curPage=' + this.curPage + '&pageSize=' + this.pageSize+'&userId='+localStorage.fuserid).then(res => {
            res = res.body;
            if (res.code == '000000') {
              let data = res.data.page.data;
              this.newsList = this.newsList.concat(data);
              if (data.length < this.pageSize) {
                this.noData = true;
              }
            }

            this.$store.commit('SET_LOADING_STATU',false);
          })
        }


      }
    },
    filters: {
      dateFormat(time) {
        time = new Date(Number(time));
        var month = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1);
        var date = time.getDate() < 10 ? ('0' + time.getDate()) : time.getDate();
        return time.getFullYear() + '-' + month + '-' + date;
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../common/css/mixin.scss";

  .articleList {
    .articleListScroll {
      position: fixed;
      top: pxToRem(68);
      left: 0;
      bottom: pxToRem(110);
      width: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .prompt-container {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .prompt-box {
          text-align: center;
          i {
            color: #A8372A;
            font-size: pxToRem(100);
          }
          h1 {
            font-size: pxToRem(36);
            color: #666;
            margin-top: pxToRem(50);
          }
        }
      }
      ul{
        padding-bottom:pxToRem(15);
        li {
          padding-left: pxToRem(20);
          padding-right: pxToRem(20);
          padding-bottom: pxToRem(12);
          padding-top: pxToRem(12);
          display: flex;
          align-items: center;
          img {
            width: pxToRem(50);
            height: pxToRem(50);
            margin-right: pxToRem(10);
          }
          p {
            margin-right: pxToRem(18);
            flex: 1;
            color: #333;
            font-size: pxToRem(30);
            line-height: 1.2;
            max-height: pxToRem(72);
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          h5 {
            font-size: pxToRem(24);
            color: #7f7f7f;
          }
        }
      }

    }
  }

</style>
