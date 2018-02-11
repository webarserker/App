<template>
  <div class="tels">
    <SlideMenu parentCatName="联系方式">
      <span>
        联系方式
      </span>
    </SlideMenu>
    <div class="tel-list-wrapper">
      <ul class="tel-list" v-infinite-scroll="loadMore"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="10">
        <li v-for="(item,index) in telList">
          <a @click="call(item.content)">
            <span class="idx">{{index+1}}</span>
            <div class="content">
              <h1>
                <span class="label">部门：</span>
                <p class="sub-content">{{item.title}}</p>
              </h1>
              <h1>
                <span class="label">电话：</span>
                <p class="sub-content">{{item.content}}</p>
              </h1>
            </div>
          </a>
        </li>

        <p>
          <span v-show="!hasNoMore" @click="loadMore">查看更多</span>
          <span v-show="hasNoMore">没有更多了</span>
        </p>
      </ul>
    </div>
    <mFooter :currentIndex="4" ></mFooter>
    <Warning></Warning>
  </div>
</template>
<script>
  import Warning from '../components/warning.vue'
  import mHeader from '../components/header.vue'
  import mFooter from '../components/footer.vue'
  import SlideMenu from '../components/slideMenu.vue'
  export default {
    components:{Warning,mHeader,mFooter,SlideMenu},
    created(){
      this.$store.commit('SET_LOADING_STATU',true);

      this.$http.get(`${this.$store.state.host}/front/findContactPage?curPage=${this.curPage}&pageSize=${this.pageSize}&userId=${localStorage.fuserid}`).then(res=>{
        res=res.body;
        if(res.code=='000000'){
          this.telList=res.data.data;
        }
        if(res.data.data.length<this.pageSize){
          this.hasNoMore=true;
        }

        this.$store.commit('SET_LOADING_STATU',false);
      })
    },
    data(){
      return{
        curPage:1,
        pageSize:7,
        hasNoMore:false,
        telList:[]
      }
    },
    methods:{
      call(tel){
        MCK.ready(function (sdk) {
          sdk.h5.call("callDial",tel);
        });
      },
      loadMore(){
        if(!this.hasNoMore){
          this.$store.commit('SET_LOADING_STATU',true);
          this.curPage++;
          this.$http.get(`${this.$store.state.host}/front/findContactPage?curPage=${this.curPage}&pageSize=${this.pageSize}&userId=${localStorage.fuserid}`).then(res=>{
            res=res.body;
            if(res.code=='000000'){
              this.telList=this.telList.concat(res.data.data);
            }
            console.log(res.data.data)
            if(res.data.data.length<this.pageSize){
              this.hasNoMore=true;
            }

            this.$store.commit('SET_LOADING_STATU',false);
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../common/css/mixin.scss";
  .tels{
    .tel-list-wrapper{
      position:fixed;
      top:pxToRem(68);
      left:0;
      width:100%;
      bottom:pxToRem(110);
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      ul{
        padding-left:pxToRem(20);
        padding-right:pxToRem(20);
        &>p{
          margin-top:pxToRem(70);
          padding-bottom:pxToRem(50);
          text-align:center;
          span{
            font-size:pxToRem(30);
            color:#666;
          }
        }
        li{
          @include border-1px(#eee);
          &>a{
            text-decoration:none;
            display:flex;
            color:#666;
            align-items:center;
            padding-top:pxToRem(15);
            padding-bottom:pxToRem(15);
            .idx{
              color:#666;
              margin-right:pxToRem(20);
              font-size:pxToRem(28);

            }
            .content{
              flex:1;
              h1{
                display:flex;
                font-size:pxToRem(28);
                line-height:1.5;
                .sub-content{
                  flex:1;
                }
              }
            }
          }

        }
      }
    }

  }
</style>
