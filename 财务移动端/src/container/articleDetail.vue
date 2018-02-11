<template>
  <div class="article-detail">
    <SlideMenu :parentCatName="parentCatName">
      <span>
        {{parentCatName+(infoCatName?' - '+infoCatName:'')+' - 文章'}}
      </span>
    </SlideMenu>
    <div class="article-content-wrapper" id="article-content-wrapper">
      <div class="article-content">
        <h1 id="article-title">
          {{articleContentJson.title}}
        </h1>
        <div id="other-info-box">
          <div id="other-info">
            <div class="time">
              <i class="icon-fabushijian"></i>
              {{articleContentJson.pulishTimeStr}}
            </div>
            <div class="see-num">
              <i class="icon-liulan"></i>
              {{articleContentJson.countReadNum}}
            </div>
          </div>
        </div>
        <div id="section-container">
          <div class="section" id="section" v-html="articleContentJson.content?articleContentJson.content:newContent" ref="articleContentWrapper">
          </div>
        </div>



        <div class="qrcode-box" id="qrcode-box">
          <img src="../common/image/er.jpeg" alt="" class="qrcode">
          <p>&copy;版权所有: 北京第二外国语学院财务处</p>
          <p>Copyright 2017 ALL Right Reserved | 京ICP备16030849号</p>
        </div>
      </div>
    </div>
    <mFooter></mFooter>
    <Warning></Warning>
    <Encryption :infoId="$route.query.articleId" v-show="showEncryption" @giveNewContent="giveNewContent"></Encryption>
  </div>
</template>
<script>
  import Warning from '../components/warning.vue'
  import mHeader from '../components/header.vue'
  import mFooter from '../components/footer.vue'
  import SlideMenu from '../components/slideMenu.vue'
  import Encryption from '../components/encryption.vue'
  import Vue from 'vue'
  export default{
    created(){
      this.$store.commit('SET_LOADING_STATU',true);

      this.$http.get(`${this.$store.state.host}/front/findArticlesList?parentCatId=${this.$route.query.parentId}&catId=${this.$route.query.catId}&userId=${localStorage.fuserid}`).then(res=>{
        res=res.body;
        if(res.code=='000000'){
          let data=res.data;
          this.parentCatName=data.cat.parentCatName;
          this.infoCatName=data.cat.name;
        }
      })
      this.$http.get(this.$store.state.host+'/front/findArticleDetail?id='+this.$route.query.articleId+'&userId='+localStorage.fuserid).then(res=>{
        res=res.body;
        if(res.code=='000000'){
          let data=res.data;
          if(data.isEncrypt){
            this.showEncryption=1;
          }else{
            this.$http.get(this.$store.state.host + '/front/infoContentUser/save?id=' + this.$route.query.articleId + '&userId=' + localStorage.fuserid).then(res => {

            })
            this.$http.get(this.$store.state.host+'/front/addReadNum?infoId='+this.$route.query.articleId+'&userId='+localStorage.fuserid).then(res=>{
              res=res.body;
            })
          }
          this.articleContentJson=data;
        }
        this.$nextTick(()=>{
          var iframes=this.$refs.articleContentWrapper.getElementsByTagName('iframe');
          for(let r=0;r<iframes.length;r++){
            var wrapperWidth=getComputedStyle(iframes[r].parentNode).width;
            var bili=iframes[r].height/iframes[r].width;
            iframes[r].style.width='100%';
            var iframeHeight=parseFloat(wrapperWidth)*bili;
            iframes[r].style.height=iframeHeight+'px';
            var xxx=iframes[r].getElementsByTagName('div');
          }



          var imgs=this.$refs.articleContentWrapper.getElementsByTagName('img');
          if(imgs.length>0){
            for(var i=0;i<imgs.length;i++){
              imgs[i].onload=function(){
                let bigHeight=window.innerHeight;
                var hSliderMenu=getComputedStyle(document.getElementById('sliderMenu')).height;
                var hFooter=getComputedStyle(document.getElementById('mFooter')).height;
                let h1=getComputedStyle(document.getElementById('article-title')).height;
                let h2=getComputedStyle(document.getElementById('other-info-box')).height;
                let h3=getComputedStyle(document.getElementById('qrcode-box')).height;
                let minHeight=parseFloat(bigHeight)-parseFloat(h1)-parseFloat(h2)-parseFloat(h3)-parseFloat(hSliderMenu)-parseFloat(hFooter);
                document.getElementById('section').style.minHeight=minHeight+'px'
              }
            }
          }else{
            let bigHeight=window.innerHeight;
            var hSliderMenu=getComputedStyle(document.getElementById('sliderMenu')).height;
            var hFooter=getComputedStyle(document.getElementById('mFooter')).height;
            let h1=getComputedStyle(document.getElementById('article-title')).height;
            let h2=getComputedStyle(document.getElementById('other-info-box')).height;
            let h3=getComputedStyle(document.getElementById('qrcode-box')).height;

            let minHeight=parseFloat(bigHeight)-parseFloat(h1)-parseFloat(h2)-parseFloat(h3)-parseFloat(hSliderMenu)-parseFloat(hFooter);
            document.getElementById('section').style.minHeight=minHeight+'px'
          }

          this.$store.commit('SET_LOADING_STATU',false);
        })




      })
    },
    data(){
      return{
        parentCatName:'',
        infoCatName:'',
        articleContentJson:{},
        showEncryption:0,
        newContent:''
      }
    },
    methods:{
      giveNewContent(content){
        this.newContent=content;
        this.showEncryption=0;
        this.$http.get(this.$store.state.host + '/front/infoContentUser/save?id=' + this.$route.query.articleId + '&userId=' + localStorage.fuserid).then(res => {

        })
        this.$http.get(this.$store.state.host+'/front/addReadNum?infoId='+this.$route.query.articleId+'&userId='+localStorage.fuserid).then(res=>{
          res=res.body;
        })
      }
    },
    components:{Warning,mHeader,mFooter,SlideMenu,Encryption}
  }
</script>
<style lang="scss" scoped>
  @import "../common/css/mixin.scss";
  .article-detail{
    .article-content-wrapper{
      position:fixed;
      z-index:600;
      top:pxToRem(68);
      left:0;
      bottom:pxToRem(110);
      width:100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .article-content{
        .qrcode-box {
          height: pxToRem(330);
          background-color: #A0A0A0;
          text-align: center;
          padding-top: pxToRem(16);
          padding-bottom: pxToRem(20);
          img.qrcode {
            width: pxToRem(206);
            height: pxToRem(206);
            margin-bottom: pxToRem(20);
          }
          p {
            color: #fff;
            line-height: 1.5;
            font-size: pxToRem(22);
          }
        }
        h1#article-title{
          text-align:center;
          line-height:1.1;
          padding-top:pxToRem(26);
          padding-left:pxToRem(25);
          padding-right:pxToRem(25);
          font-size:pxToRem(32);
          color:#666;
        }
        #other-info-box{
          display:flex;
          justify-content: center;
          padding-top:pxToRem(30);
          #other-info{
            width:50%;
            .time{
              float:left;
              color:#999;
              line-height:pxToRem(26);
              font-size:pxToRem(26);
              i{
                font-size:pxToRem(26);
              }
            }
            .see-num{
              color:#999;
              font-size:pxToRem(26);
              line-height:pxToRem(26);
              i{
                font-size:pxToRem(26);
              }
              float:right;
            }
          }
        }
        #section-container{
          padding-top:pxToRem(30);
          padding-left:pxToRem(25);
          padding-right:pxToRem(25);
          padding-bottom:pxToRem(30);

        }
      }
    }
  }
</style>
