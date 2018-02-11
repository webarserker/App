<template>
    <div ref="header" class="box box-ac header">
        <div class="icon icon-user" @click="checkLogin('/userInfo')">
            <div v-if="$store.state.hasNews" class="news"></div>
        </div>
        <form class="box box-f1 box-ac" action="javascript: return true;" >
            <div class="icon icon-search"></div>
            <input @focus="showHistory = true"  v-model="searchWord" id="search"  type="search" class="box box-f1 box-ac"  placeholder="请输入您要搜索的话题" />
        </form>
        <div class="icon icon-user-list " @click="checkLogin('/userList')">
        </div>
          <div ref="searchMask" @click="searchWord='';showHistory=false"  :class="(searchWord.length>0 || (showHistory === true&&$store.state.searchHistory.length>0)) ? '':'hide'" class="search-container box-ver">
            <div  @click="$event.stopPropagation()" class="box box-ver">
                <div v-if="searchList.length>0" class="search-list box box-ver">
                    <div v-for="(item, index) in searchList" @click="goTopicDetail(item)" class="search-item box box-ac">
                        <div class="icon icon-search1"></div>
                        <div class="text box-f1 ellipsis">{{item.title}}</div>
                    </div>
                </div>
                <div v-if="searchList.length===0&&searchWord.length>0" class="search-none box box-ac">
                    <div class="box box-f1 box-pc">抱歉！没有搜索到您要找的话题。</div>
                    <div v-if="$store.state.userInfo.isTopicAdmin == 1" @click="checkLogin('/topicCreate')" class="topic-create box box-ac box-pc">创建话题</div>
                </div>
                <div v-if="$store.state.searchHistory.length>0 && showHistory === true" class="search-history">
                    <div class="box box-ac">
                        <div class="icon icon-history"></div>
                        <div>历史搜索记录</div>
                    </div>
                    <div class="list box box-ver">
                        <div @click="goTopicDetail(item)" v-for="item in $store.state.searchHistory" class="history-item">{{item.title}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      searchWord: '',
      searchList: [],
      showHistory:false
    }
  },
  mounted () {
    this.$refs.searchMask.style.height = document.body.clientHeight - this.$refs.header.clientHeight + 'px'
  },
  methods: {
    checkLogin (router) {
      // 全部用户页tab的active索引
      window.localStorage.setItem('activeIndex', 0)
      var self = this
      self.searchWord = ''
      self.$router.push(router)
    },
    goTopicDetail (item) {
      var self = this
      var item1 = {
          id: item.id,
          title: item.title?item.title:''
      }
      var locHistory = window.localStorage.getItem('searchHistory')
      var searchHistory = []
      self.searchWord = ''
      self.showHistory = false
      if (locHistory) {
        locHistory = JSON.parse(locHistory)
        locHistory.forEach(function(item,index) {
            if (item.id != item1.id) {
                // alert(item.id != item1.id)
                searchHistory.push(item)
            }
        })
        searchHistory.unshift(item1)
        searchHistory.slice(0,5)
      } else {
        searchHistory.push(item1)
      }
      console.log(searchHistory)
      self.$store.commit('SET_SEARCHHISTORY', searchHistory)
      self.checkLogin('/topicDetail?topicId=' + item.id)
    }
  },
  watch: {
    searchWord() {
      var self = this
      var state = self.$store.state
      if (self.searchWord.length === 0) {
          self.searchList = []
          return
      }
      var url = state.host + state.baseUrl + '/topic/findListByTitle?title=' + this.searchWord
      this.$http.get(url).then(res => {
        self.searchList = res.data.data// .slice(0,5)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
    @import '../css/color.scss';
    @import '../css/mixins.scss';
    .search-container{
        position:absolute !important;
        background-color:rgba(0,0,0,.3);
        z-index:1001;
        width:100%;
        top:1.1rem;
        left:0;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch; 
        .search-list{
            padding-left:1.2rem;
            background-color:#FFF;
            padding-top:.25rem;
            padding-bottom:.25rem;
            border-bottom:.01rem solid $border-color;
            .search-item{
                height:.52rem;
                .icon-search1{
                    width:.3rem;
                    height:.3rem;
                    margin-right:.2rem;
                }
            }
        }
        .search-none{
            padding:.3rem;
            font-size:.28rem;
            color:#686868;
            background-color:#FFF;
            border-bottom:.01rem solid $border-color;
            .topic-create{
                width:1.37rem;
                height:.5rem;
                background-color:#f19149;
                border-radius:.1rem;
                color:#FFF;
            }
        }
        .search-history{
            background-color:#FFF;
            padding:.25rem;
            color:$theme-color;
            .icon-history{
                width:.26rem;
                height:.26rem;
                margin-right:.1rem;
            }
            .list{
                color:#666;
                padding-left:.3rem;
                .history-item{
                    font-size:.24rem;
                    padding-top:.1rem;
                }
            }
        }
    }
    .header{
        position:absolute !important;
        background-color:$theme-bg;
        z-index:1000;
        width:100%;
        top:0;
        height:1.1rem;
        padding-left:.2rem;
        padding-right:.2rem;;
        @include border-1px($border-color);
        form{
            margin-left:.3rem;
            margin-right:.3rem;
            padding-right:.28rem;
            padding-left:.28rem;
            border-radius:.66rem;
            border:.02rem solid $theme-color;
            height:.66rem;
            overflow:hidden;
            .icon-search{
                width:.48rem;
                height:.48rem;
            }
            #search{
                margin-left:.1rem;
                font-size:.3rem;
            }
        }
    }

   .icon-user,.icon-user-list{
        width: .58rem;
        height: .58rem;
   }
   .icon-user{
       position:relative;
       .news{
           position:absolute;
           width:.1rem;
           height:.1rem;
           border-radius:50%;
           background-color: #e60012;
           right:-.05rem;
           top:-.05rem;
       }
   }
</style>

