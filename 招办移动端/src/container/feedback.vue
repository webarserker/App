<template>
  <div class="feedback">
    <Tab entryName="其他" tabLast="用户反馈"></Tab>
    <div class="scroll-wrap">
      <h2>请描述您所遇到的问题（必填）</h2>
      <div id="problem">
        <textarea name="" maxlength="300" id="write-problem" v-model="content"></textarea>
        <span>300字以内</span>
      </div>
      <h2>添加图片</h2>

      <div class="upload-group">
        <ul id="ossfile">
          <!--此处动态添加所上传图片的img-->
        </ul>
        <div id="container">
          <div id="selectfiles"></div>
          <i class="icon-add"></i>
        </div>
      </div>

      <h2>请留下联系方式（必填）</h2>
      <input type="text" id="contact" placeholder="手机号、QQ或邮箱，多条请用逗号隔开" v-model="contact">
      <p class="vali-words"><span v-show="showValiWords">请输入有效的联系方式</span></p>
      <button id="submit" @click="submit">提&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;交</button>
    </div>

    <Toast :toastWords="toastWords" v-show="showToast"></Toast>


    <div id="uploading">
      <span class="icon-loading"></span>
    </div>
  </div>

</template>
<script>
  import Loading from '../components/loading.vue'
  import Tab from '../components/tab.vue'
  import Toast from '../components/toast.vue'
  import {wxShare} from '../common/js/mixin'

  export default{
    mixins:[wxShare],
    components: {Tab, Toast, Loading},
    beforeDestroy(){
      this.toastTimer = null;
    },
    data(){
      return {
        hiddenValue: '',
        toastWords: '',
        showToast: false,
        toastTimer: null,
        initNum: 0,
        images: [],
        file: '',
        showValiWords: false,
        content: '',
        contact: ''
      }
    },
    methods: {
      vali(words){
        this.toastWords = words;
        this.showToast = true;
        var _this = this;
        this.toastTimer = setTimeout(function () {
          _this.showToast = false
        }, 2000)
      },
      submit(){
        var valiProblem = document.getElementById('write-problem').value.trim() !== '';
        var valicontact = document.getElementById('contact').value.trim() !== '';
        var contactArray = document.getElementById('contact').value.split(",");
        var subContactArray = [];
        contactArray.forEach(function (v, i) {
          if (i < 3) {
            v = v.replace(/\s/g, "");
            subContactArray.push(v);
            console.log(subContactArray)
          } else {
            return;
          }
        })

        var bool1 = false, bool2 = false, bool3 = false;
        var reg1 = /^1[0-9]{10}$/, reg2 = /[1-9]\d{4,}/,
          reg3 = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        if (subContactArray.length == 1) {
          bool1 = reg1.test(subContactArray[0]) || reg2.test(subContactArray[0]) || reg3.test(subContactArray[0]);
        } else if (subContactArray.length == 2) {
          bool2 = (reg1.test(subContactArray[0]) && reg2.test(subContactArray[1])) ||
            (reg1.test(subContactArray[0]) && reg3.test(subContactArray[1])) ||
            (reg2.test(subContactArray[0]) && reg3.test(subContactArray[1]))
        } else if (subContactArray.length == 3) {
          bool3 = reg1.test(subContactArray[0]) && reg2.test(subContactArray[1]) && reg3.test(subContactArray[2]);
        }


        if (!valiProblem) {
          this.vali('请输入问题内容');
        } else if (!valicontact) {
          this.vali('请输入联系方式');
        } else if (!(bool1 || bool2 || bool3)) {
          this.showValiWords = true;
        } else {

          var imgSrc = '';
          var imgs = document.getElementById('ossfile').getElementsByTagName('img');
          for (var i = 0; i < imgs.length; i++) {
            imgSrc += ';' + imgs[i].getAttribute('src');
          }
          imgSrc = imgSrc.substring(1);

          this.showValiWords = false;
          this.$store.commit('SET_LOADING_STATU', true);

          this.contact = this.contact.replace(/\s/g, "");
          this.$http.get(this.$store.state.host + '/sysUser/feedback' + '?userToken=' + localStorage.zb_userToken + '&sCode=' + localStorage.zb_sCode
            + '&content=' + this.content + '&imgUrl=' + imgSrc + '&contact=' + this.contact).then(res => {
            res = res.body;
            //如果账号被挤下去了的话
            if (res.code == '040004') {
              localStorage.setItem('zb_userToken', '');
              this.$router.push({
                path: '/login'
              })
            }

            this.$store.commit('SET_LOADING_STATU', false);
            if (res.code == '000000') {
              this.toastWords = '提交成功！即将返回上一页';
              this.showToast = true;
              var _this = this;
              this.toastTimer = setTimeout(function () {
                _this.showToast = false
                _this.$router.back();
              }, 2000)
            } else if (res.code == '999997') {
              this.vali('发生错误');
            } else if (res.code == '999998') {
              this.vali('参数错误');
            } else if (res.code == '999999') {
              this.vali('系统异常')
            } else if (res.code == '770002') {
              this.vali('请勿输入表情')
            } else {
              this.vali('系统异常')
            }
          })
        }
      }
    },
    created(){
      var upload = document.createElement('script');
      upload.src = '/static/upload.js';
      document.body.appendChild(upload);
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../common/css/variable";

  .feedback {
    position: fixed;
    z-index: 500;
    top: .72rem;
    left: 0;
    right: 0;
    bottom: .46rem;
    background: #fff;
    padding: 0 .1rem 0 .1rem;

    .scroll-wrap {
      position: absolute;
      top: 0;
      bottom: 0;
      left: .1rem;
      right: .1rem;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;

      h2 {
        font-weight: normal;
        font-size: .14rem;
        color: #333;
        padding-left: 5px;
        margin-top: .15rem;
      }
      #problem {
        position: relative;
        margin-top: .08rem;
        textarea {
          resize: none;
          width: 100%;
          height: 1.68rem;
          background: #f7f7f7;
          border: 1px solid #bfbfbf;
          border-radius: .1rem;
          box-sizing: border-box;
          outline: none;
          padding: 8px;
          padding-bottom: .24rem;
          font-size: .16rem;
        }
        span {
          position: absolute;
          right: 8px;
          bottom: 8px;
          color: #999;
          font-size: .12rem;
        }
      }
      .upload-group {
        margin-top: .1rem;
        display: flex;
        align-items: center;
        margin-top: .1rem;
        ul#ossfile {
          overflow: hidden;
          li {
            float: left;
            width: .54rem;
            height: .54rem;
            margin-right: .13rem;
            position: relative;
            i {
              position: absolute;
              right: 0;
              top: 0;
              font-size: .15rem;
              color: red;
              font-weight: bold;
            }
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        div#container {
          position: relative;
          #selectfiles {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
          }
          i {
            font-size: .3rem;
            color: #999;
          }
        }
      }

      #contact {
        width: 100%;
        height: .3rem;
        border-radius: .15rem;
        border: 1px solid #bfbfbf;
        background: #f4f4f4;
        margin-top: .08rem;
        padding-left: .1rem;
        outline: none;
        font-size: .13rem;
      }
      #submit {
        background: @theme;
        width: 2.6rem;
        height: .3rem;
        border: none;
        line-height: .3rem;
        border-radius: .15rem;
        color: #fff;
        font-size: .14rem;
        display: block;
        margin: 0 auto;
        outline: none;
      }
      p.vali-words {
        height: .3rem;
        line-height: .3rem;
        text-align: center;
        font-size: .13rem;
        color: #F00A08;
      }
    }

    #uploading {
      position: fixed;
      background: rgba(0, 0, 0, .3);
      z-index: 2000;
      top: 0;
      left: 0;
      width: 100%;
      height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      .icon-loading {
        font-size: .5rem;
        color: @theme;
        -moz-animation: whirly-loader 1.25s infinite linear;
        -webkit-animation: whirly-loader 1.25s infinite linear;
        animation: whirly-loader 1.25s infinite linear;
        -moz-transform-origin: 50% 50%;
        -ms-transform-origin: 50% 50%;
        -webkit-transform-origin: 50% 50%;
        transform-origin: 50% 50%;
      }
    }
    @-moz-keyframes whirly-loader {
      0% {
        -moz-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -moz-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    @-webkit-keyframes whirly-loader {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    @keyframes whirly-loader {
      0% {
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -moz-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
  }
</style>
