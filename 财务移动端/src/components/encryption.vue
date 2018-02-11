<template>
  <div class="encryption-wrapper">
    <div class="encryption">
      <h1>{{title}}</h1>
      <h3>请输入浏览密码</h3>
      <div class="input-box">
        <div class="bug-box">
          <input type="password" v-model="mima" ref="mima">
          <span class="icon-cha" @click="clean"></span>
        </div>

        <h3 class="checkWord">{{checkWord}}</h3>
      </div>

      <div class="btns">
        <a class="cancel" @click="$router.back()">取消</a>
        <a class="sure" @click="checkMima">确认</a>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    props:{
      infoId:{

      }
    },
    data(){
      return {
        title:'浏览此篇文章需要输入密码',
        mima:'',
        checkWord:''
      }
    },
    methods:{
      clean(){
        this.$refs.mima.value='';
        this.mima='';
      },
      checkMima(){
        if(this.mima==''){
          this.checkWord='密码不能为空'
        }else{
          this.$http.get(this.$store.state.host+'/front/checkInfoEncrypt'+'?infoId='+this.infoId+'&password='+this.mima+ '&userId=' + localStorage.fuserid).then(res=>{
            res=res.body;
            if(!res.content){
              this.checkWord="密码输入错误";
              this.mima='';
            }else{
              this.$emit('giveNewContent',res.content);
            }
          })
        }

      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../common/css/mixin.scss";
  .encryption-wrapper{
    position:fixed;
    background:rgba(0,0,0,.3);
    z-index:3999;
    top:0;
    left:0;
    right:0;
    bottom:0;
    display:flex;
    align-items:center;
    justify-content: center;
    .encryption{
      width:pxToRem(600);
      height:pxToRem(390);
      background-color:#fff;
      border-radius:pxToRem(10);
      padding:0 pxToRem(68);
      &>h1{
        margin-top:pxToRem(50);
        text-align:center;
        color:rgb(165,55,38);
        font-size:pxToRem(30);
      }
      &>h3{
        margin-top:pxToRem(48);
        padding-bottom:pxToRem(20);
        font-size:pxToRem(24);
        color:rgb(119,119,119);
      }
      .checkWord{
        padding-left:pxToRem(10);
        font-size:pxToRem(24);
        color:#d7000f;
        margin-top:pxToRem(20);
      }
      .input-box{
        width:pxToRem(400);
        height:pxToRem(90);
        position:relative;
        margin-left:pxToRem(30);
        .bug-box{
          width:pxToRem(400);
          height:pxToRem(50);
          border:1px solid #ccc;
          border-radius:pxToRem(10);
        }
        input{
          width:pxToRem(350);
          height:pxToRem(44);
          margin-top:pxToRem(1);
          padding-left:pxToRem(15);
          font-size:pxToRem(24);
          float:left;
          border:none;
          outline: none;
        }
        .icon-cha{
          float:right;
          font-size:pxToRem(25);
          margin-top:pxToRem(11);
          margin-right:pxToRem(12);
          font-weight:bold;
          color:#999;
        }
      }
      .btns{
        text-align:center;
        margin-top:pxToRem(28);
        a.cancel{
          display:inline-block;
          width:pxToRem(140);
          height:pxToRem(50);
          border-radius:pxToRem(25);
          background-color:rgb(179,179,179);
          text-align:center;
          line-height:pxToRem(50);
          color:#fff;
          font-size:pxToRem(26);
          text-decoration:none;
          &:active{
            text-decoration:none;
          }
        }
        a.sure{
          display:inline-block;
          width:pxToRem(140);
          height:pxToRem(50);
          border-radius:pxToRem(25);
          background-color:$themeColor;
          text-align:center;
          line-height:pxToRem(50);
          color:#fff;
          margin-left:pxToRem(110);
          font-size:pxToRem(26);
          text-decoration:none;
          &:active{
            text-decoration:none;
          }
        }
      }
    }
  }
</style>
