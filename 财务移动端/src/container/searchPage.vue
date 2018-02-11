<template>
  <div class="searchPage">
    <!--<SearchHeader :showResult="showResult" @toggle="toggle"></SearchHeader>-->
    <div class="search-link">
      <div class="input-box">
        <input id="searchInput" type="text" v-model="keywords" @keyup.enter="goToSearch">
        <div class="icon-container" v-show="keywords" @click="clean">
          <i class="icon-cha" ></i>
        </div>
        <a @click="goToSearch">搜索</a>
      </div>
      <div class="byKeywords" v-show="!showResult">
        <div class="search-history">
          <i class="icon-fabushijian"></i>
          <div class="search-history-list">
            <h1>搜索历史</h1>
            <ul>
              <li v-for="(item,index) in searchHistoryList" @click="fastByHistory(item)">
                <i class="icon-search"></i>
                {{item}}
              </li>
            </ul>
          </div>
        </div>
        <div class="fast-search">
          <h1><i class="icon-kuaijiesousuo"></i>快捷搜索 <span class="hidden" id="hiddenInput"></span></h1>
          <ul>
            <li v-for="(item,index) in contentTypeList"
                @click="$router.push({name:'ArticleListByType',query:{contentType:item.contentType}})">
              {{item.name}}
            </li>

            <li @click="$router.push({name:'Tels'})">联系方式</li>

            <li v-for="(item,index) in normalModule"
                @click="$router.push({name:'ArticleList',query:{parentId:item.parentCatId,catId:item.catId}})">
              {{item.name}}
            </li>
          </ul>
        </div>
      </div>
    </div>


    <div v-show="showResult" class="searchResultList" @scroll="scrollUl($event,3)">

      <div v-if="initNoData" class="initNoData">
        <div class="words">
          <div class="level1">抱歉，没有找到 “ <span>{{newKeyWords}}</span> ” 相关信息</div>
          <div class="level2">您可以尝试更换关键字重新搜索</div>
        </div>
        <img src="../common/image/sousuokong.png" alt="">
      </div>

      <ul v-if="!initNoData">
        <li v-for="(item,index) in resultList"
            @click="$router.push({name:'ArticleDetail',query:{parentId:item.parentCatId,catId:item.catId,articleId:item.infoId}})">
          <h1 v-html="item.title"></h1>
          <p v-html="item.content"></p>
        </li>
        <p class="no-data-text" v-show="hasNoMore">没有更多了</p>
      </ul>
    </div>
    <Warning></Warning>
  </div>

</template>
<script>
  import Warning from '../components/warning.vue'
  import SearchHeader from '../components/searchHeader.vue'

  export default {
    components: {Warning, SearchHeader},
    data() {
      return {
        initNoData: false,
        searchHistoryList: localStorage.searchHistoryList ? JSON.parse(localStorage.searchHistoryList).slice(0, 5) : [],
        resultList: [],
        keywords: '',
        newKeyWords: '',
        normalModule: sessionStorage.getItem('normalModule') ? JSON.parse(sessionStorage.getItem('normalModule')) : [],
        showResult: false,
        curPage: 1,
        pageSize: 10,
        hasNoMore: false,
        contentTypeList: [{
          name: '部门动态',
          contentType: 7
        }, {
          name: '紧急通知',
          contentType: 5
        }, {
          name: '财务通知及公告',
          contentType: 8
        }]
      }
    },
    watch: {
      keywords(curVal, oldVal) {
        if (curVal == '') {
          this.showResult = false;
        }
      }
    },
    methods: {
      clean() {
        this.keywords = '';
        this.showResult = false;
        document.getElementById('searchInput').blur();
        document.getElementById('hiddenInput').focus();
        this.keywords = '';
      },

      fastByHistory(word) {
        this.keywords = word;
        this.goToSearch();
      },
      scrollUl(event, distance) {
        var ele = event.currentTarget;
        var scrollTop = ele.scrollTop;
        var scrollHeight = ele.scrollHeight;
        var offsetHeight = ele.offsetHeight;
        if (scrollTop + offsetHeight + distance > scrollHeight) {
          this.loadMore();
        }
      },
      loadMore() {
        if (!this.hasNoMore) {
          this.$store.commit('SET_LOADING_STATU', true);

          this.curPage++;
          this.$http.get(this.$store.state.host + '/front/search/searchByKeyWordFromApp' + '?keyWord=' + this.keywords + '&curPage=' + this.curPage + '&pageSize=10' + '&userId=' + localStorage.fuserid).then(res => {
            res = res.body;
            this.resultList = this.resultList.concat(res.data);
            if (res.data.length < this.pageSize) {
              this.hasNoMore = true;
            }

            this.$store.commit('SET_LOADING_STATU', false);
          })
        }
      },
      toggle() {
        this.showResult = false;
      },
      goToSearch() {
//        每次点击都应该初始化data里的一些数据，从0开始计算
        this.curPage = 1;
        this.hasNoMore = false;
        this.resultList = [];
//        将搜索的关键字 纳入本地存储 并去重
        var searchHistoryList = localStorage.getItem('searchHistoryList') ? JSON.parse(localStorage.getItem('searchHistoryList')) : [];
        var num = 0;
        var _this = this;

        if (_this.keywords != '') {
          searchHistoryList.forEach(function (v, i) {

            if (v == _this.keywords) {
              searchHistoryList.splice(i, 1);
              searchHistoryList.unshift(_this.keywords)
              num++;
              return;
            }
          })
          if (num == 0) {
            searchHistoryList.unshift(this.keywords);
          }
          this.searchHistoryList = searchHistoryList.slice(0, 5);
          localStorage.setItem('searchHistoryList', JSON.stringify(searchHistoryList));
        }


        this.showResult = true;

        this.$store.commit('SET_LOADING_STATU', true);
//        alert('开始搜索……'+this.jiekou)
        this.$http.get(this.$store.state.host + '/front/search/searchByKeyWordFromApp' + '?keyWord=' + this.keywords + '&curPage=' + this.curPage + '&pageSize=10' + '&userId=' + localStorage.fuserid).then(res => {
//          alert('即将展示搜索结果……')
          res = res.body;
          console.log(res);
          this.resultList = res.data;
          this.newKeyWords = this.keywords;

          if (res.data.length == 0) {
            this.initNoData = true;
          } else {
            this.initNoData = false;
          }

          this.$store.commit('SET_LOADING_STATU', false);
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../common/css/mixin.scss";

  .searchPage {
    .searchResultList {
      position: fixed;
      top: pxToRem(107);
      left: 0;
      width: 100%;
      bottom: 0;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .initNoData {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .words {
          position: absolute;
          width: 100%;
          left: 0;
          top: pxToRem(100);
          .level1, .level2 {
            font-size: pxToRem(28);
            color: #666;
            text-align: center;
            line-height: 2.2;
          }
          .level1 {
            span {
              color: #3399FF;
              font-size: pxToRem(28);
            }
          }
        }
        img {
          width: pxToRem(350);
        }
      }
      ul {
        padding-left: pxToRem(30);
        padding-right: pxToRem(30);
      }
      li {
        @include border-1px(#ccc);
        padding-top: pxToRem(26);
        padding-bottom: pxToRem(26);
        h1 {
          font-size: pxToRem(30);
          color: #333;
          line-height: 1.4;
        }
        p {
          margin-top: pxToRem(4);
          font-size: pxToRem(26);
          color: #333;
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .search-link {
      padding-left: pxToRem(30);
      padding-right: pxToRem(30);
      padding-top: pxToRem(10);
      .fast-search {
        .hidden {
          display: inline-block;
          width: 2px;
          height: 2px;
          opacity: 0;
        }
        margin-top: pxToRem(30);
        ul {
          font-size: 0;
          margin-top: pxToRem(40);
          li {
            display: inline-block;
            width: 33.33%;
            text-align: center;
            vertical-align: top;
            font-size: pxToRem(28);
            color: #3399ff;
            margin-bottom: pxToRem(40);
          }
        }
        h1 {
          font-size: pxToRem(28);
          color: #666;
          i {
            font-size: pxToRem(28);
            margin-right: pxToRem(10);
          }
        }
      }
      .search-history {
        display: flex;
        padding-top: pxToRem(30);
        padding-bottom: pxToRem(20);
        @include border-1px(#7f7f7f);
        & > i {
          font-size: pxToRem(28);
          margin-right: pxToRem(10);
          color: #666;
        }
        .search-history-list {
          h1 {
            font-size: pxToRem(28);
            color: #666;
          }
          ul {
            margin-top: pxToRem(12);
            li {
              margin-top: pxToRem(20);
              color: #999;
              font-size: pxToRem(26);
              i {
                color: $themeColor;
                font-size: pxToRem(26);
              }
            }
          }
        }
      }
      .input-box {
        height: pxToRem(75);
        display: flex;
        align-items: center;
        @include border-1px($themeColor);

          input {
            flex:1;
            height: pxToRem(70);
            padding-left: pxToRem(12);
            padding-right: pxToRem(85);
            font-size: pxToRem(28);
            color: #333;
            line-height: pxToRem(44);
            border: none;
            outline: none;
            background-color: transparent;
          }
          .icon-container {
            margin-right:pxToRem(24);
            width: pxToRem(44);
            height: pxToRem(44);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid $themeColor;
            @include extend-click();
            i {
              color: $themeColor;
              font-size: pxToRem(24);
            }
          }



        a {
          color: #fff;
          background-color: $themeColor;
          width: pxToRem(74);
          height: pxToRem(50);
          border-radius: pxToRem(6);
          line-height: pxToRem(50);
          text-align: center;
          font-size: pxToRem(24);
          text-decoration: none;
        }
      }
    }

  }
</style>
