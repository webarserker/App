<template>
  <div class="secondCatList">
    <SlideMenu :currentCatId="currentCatId">
      <span>
        {{parentCatName ? parentCatName : ''}}
      </span>
    </SlideMenu>
    <div class="prompt-container" v-show="!hasList">
      <div class="prompt-box">
        <i class="icon-nonedata"></i>
        <h1>抱歉，此页面暂无数据</h1>
      </div>
    </div>
    <div class="accordion" v-show="hasList">
      <div v-for="(catItem,catIndex) in secondCatList" :class="{'active':currentIndex==catIndex}" v-if="catItem.status">
        <div class="accord-head">
          <p class="title" @click="$router.push({name:'ArticleList',query:{parentId:$route.query.parentId,catId:catItem.id}})">
            {{catItem.name}}
          </p>
          <div class="icon-space" @click="slideUp(catIndex)">
            <p class="icon-container">
              <i :class="[{'icon-jian':currentIndex==catIndex,'icon-jia':currentIndex!=catIndex}]"></i>
            </p>
          </div>
        </div>
        <ul class="accord-body" v-show="currentIndex==catIndex">
          <li v-for="(subItem,subIndex) in catItem.infoList!=null?catItem.infoList.slice(0,6):[]" @click="isReadSave(catItem.id,subItem.id)">
            <img src="../common/image/unread.png" v-if="!subItem.isRead">
            <p class="title">
              {{subItem.title}}
            </p>
            <p class="time">
              {{subItem.pulishTimeStr}}
            </p>
          </li>
          <div class="see-more" data-index="1">
            <p v-show="catItem.infoList!=null?catItem.infoList.length>6:false" @click="$router.push({name:'ArticleList',query:{parentId:parentId,catId:catItem.id}})">
              加载更多
            </p>
          </div>
        </ul>
      </div>
    </div>
    <mFooter></mFooter>
    <Warning></Warning>
  </div>
</template>
<script>
  import mHeader from '../components/header.vue'
  import mFooter from '../components/footer.vue'
  import SlideMenu from '../components/slideMenu.vue'
  import Warning from '../components/warning.vue'

  export default {
    watch:{
      '$route'(to, from) {
        this.parentCatName='';
        this.secondCatList=[];
        this.currentIndex=0;
        this.hasList=true;
        this.$store.commit('SET_LOADING_STATU', true);
        this.$http.get(this.$store.state.host + '/front/findCatListByCatId' + '?parentCatId=' + this.$route.query.parentId+'&userId='+localStorage.fuserid).then(res => {
          res = res.body;
          if(res.code=='000000'){

            let data=res.data;
            this.parentCatName=data.cat.name;
            this.secondCatList=data.page.data;
            if(data.page.data.length==0){
              this.hasList=false;
            }

            this.$store.commit('SET_LOADING_STATU', false);
            let _this=this;
            for(let i=0;i<this.secondCatList.length;i++){
              if(this.secondCatList[i].infoList!=null){
                if(this.secondCatList[i].infoList.length>0){
                  _this.currentIndex=i;
                  _this.currentCatId=_this.secondCatList[i].id;
                  return;
                }
              }
            }
          }
        })
      }
    },
    filters: {
      dateFormat(time) {
        time = new Date(Number(time));
        var month = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1);
        var date = time.getDate() < 10 ? ('0' + time.getDate()) : time.getDate();
        return time.getFullYear() + '-' + month + '-' + date;
      }
    },
    components: {mHeader, SlideMenu, mFooter,Warning},
    created() {
      this.$store.commit('SET_LOADING_STATU', true);
      this.$http.get(this.$store.state.host + '/front/findCatListByCatId' + '?parentCatId=' + this.$route.query.parentId+'&userId='+localStorage.fuserid).then(res => {
        res = res.body;

        if(res.code=='000000'){
          let data=res.data;
          this.parentCatName=data.cat.name;
          this.secondCatList=data.page.data;
          if(data.page.data.length==0){
            this.hasList=false;
          }

          this.$store.commit('SET_LOADING_STATU', false);


          let _this=this;
          for(let i=0;i<this.secondCatList.length;i++){
            if(this.secondCatList[i].infoList!=null){
              if(this.secondCatList[i].infoList.length>0){
                _this.currentIndex=i;
                _this.currentCatId=_this.secondCatList[i].id;
                return;
              }
            }
          }
        }
      })
    },
    methods:{
      slideUp(catIndex){
        if(this.currentIndex==catIndex){
          this.currentIndex=-1
        }else{
          this.currentIndex=catIndex;
          this.currentCatId=this.secondCatList[catIndex].id;
        }
      },
      isReadSave(catId,articleId) {
//        this.$http.get(this.$store.state.host + '/front/infoContentUser/save?id=' + articleId + '&userId=' + localStorage.fuserid).then(res => {
//          res = res.body;
          //该接口是保存已读，然后就是跳转到相应的详情页面
          this.$router.push({path: `/articleDetail?parentId=${this.$route.query.parentId}&catId=${catId}&articleId=${articleId}`})
//        })
      },
    },
    computed: {
      parentId() {
        return this.$route.query.parentId;
      }
    },
    data(){
      return {
        parentCatName:'',
        secondCatList:[],
        currentIndex:0,
        currentCatId:-1,
        hasList:true
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../common/css/mixin.scss";
  .secondCatList{
    .prompt-container{
      position: fixed;
      top: pxToRem(68);
      left: 0;
      width:100%;
      bottom: pxToRem(110);
      background-color:#fff;
      display:flex;
      align-items:center;
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
    .accordion{
      background-color:#eee;
      position: fixed;
      top: pxToRem(68);
      left: 0;
      bottom: pxToRem(110);
      width: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      &>div.active{
        .accord-head{
          @include border-1px(#ddd);
          background-color:#fff;
          .title{
            color:$themeColor;
          }
          i{
            color:$themeColor;
          }
          p.icon-container{
            border-color:$themeColor;
          }
        }
        .accord-body{
          background-color:#fff;
        }
      }
      .accord-head{
        display:flex;
        height:pxToRem(74);
        align-items:center;
        @include border-1px(#fff);
        padding-left:pxToRem(30);
        padding-right:pxToRem(30);
        p.title{
          font-size:pxToRem(30);
          flex:8;
          height:100%;
          line-height:pxToRem(74);
        }
        .icon-space{
          height:100%;
          flex:2;
          display:flex;
          justify-content: flex-end;
          align-items:center;
          .icon-container{
            border:pxToRem(1) solid #999;
            width:pxToRem(42);
            height:pxToRem(42);
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content: center;
            i{
              line-height:pxToRem(74);
              font-size:pxToRem(28);
            }
          }
        }
      }
      .accord-body{
        .see-more{
          text-align:center;
          p{
            padding-left:pxToRem(40);
            padding-right:pxToRem(40);
            display:inline-block;
            height:100%;
            line-height:pxToRem(76);
            font-size:pxToRem(26);
            color:#666;
          }
        }
        &>li{
          padding-left: pxToRem(35);
          padding-right: pxToRem(20);
          padding-bottom: pxToRem(20);
          padding-top: pxToRem(12);
          display: flex;
          align-items: center;
          img {
            width: pxToRem(50);
            height: pxToRem(50);
            margin-right: pxToRem(10);
          }
          .title{
            margin-right: pxToRem(18);
            flex: 1;
            color: #333;
            font-size: pxToRem(28);
            line-height: 1.2;
            max-height: pxToRem(72);
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .time{
            color:#7f7f7f;
            font-size:pxToRem(24);
          }
        }
      }
    }
  }
</style>
