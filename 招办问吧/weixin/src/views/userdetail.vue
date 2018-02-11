<template>
  <div class="userinfo userdetail" id="wrap" :class="{notLogined: !isLogined}">
    <path-nav :current="'个人详情页'">
    <a href="javascript:void(0);" @click="$router.push('/')">首页</a>
      &gt;  
    <a href="javascript:void(0);" @click="$router.push('/userinfo')">个人信息</a>
    &gt; 
    </path-nav>
    <div class="main">
      <a class="list clear avatar">
        <div class="text fl">
          头像
        </div>
        <img :src="arrowRight" class="arrow arrow-right fr" v-show="isEdit">
        <label v-show="images.length>0 && isEdit" for="checkPhoto" class="photo-item fr list-avatar">
          <img :style="{backgroundImage: 'url(' + images[0] + ')',backgroundSize:'cover',backgroundRepeat: 'no-repeat'}" class="photo-item" />
          <input @change="getFile($event)" id="checkPhoto" type="file" accept="image/*"/>
        </label>
        <label v-if="images.length===0 && isEdit" for="checkPhoto" class="photo-item fr">
          <div class="list-avatar fr">
            <img :src="imgSrc" >
          </div>
          <input @change="getFile($event)" id="checkPhoto" type="file" accept="image/*"/>
        </label>
        <div class="list-avatar fr" v-show="!isEdit">
          <img :src="imgSrc" >
        </div>
      </a>
      <a class="list clear account">
        <div class="text fl">
          账户
        </div>
        <div class="value fr"  >
          <span class="text" :class="{edited: isEdit}">{{saveuserinfo.account}}</span>
        </div>
      </a>
      <a class="list clear nickname">
        <div class="text fl">
          昵称
        </div>
        <div class="value fr"  >
          <div class="edited" v-show="isEdit">
            <input type="text" maxlength="8" v-model="inputnickName">
          </div>
          <span class="text" v-show="!isEdit">{{saveuserinfo.nickName.substring(0,8)}}</span>
        </div>
      </a>
      <a class="list clear realname">
        <div class="text fl">
          真实姓名
        </div>
        <div class="value fr"  >
          <div class="edited" v-show="isEdit">
            <input type="text" v-model="inputrealName">
          </div>
          <span class="text" v-show="!isEdit">{{saveuserinfo.realName}}</span>
        </div>
      </a>
      <a class="list clear sex">
        <div class="text fl">
          性别
        </div>
        <img :src="arrowDown" class="arrow arrow-down fr" v-show="isEdit">
        <div class="value fr">
          <span class="text" v-show="!isEdit" v-if="saveuserinfo.sex === 0 || saveuserinfo.sex === 1">{{saveuserinfo.sex === 0?'女':'男'}}</span>
          <span class="text" v-show="!isEdit" v-else></span>
          <span class="text select" v-show="isEdit">{{sex}}</span>
          <span class="choose" v-show="isEdit" @click="show(1)"></span>
        </div>
      </a>
      <a class="list clear provincename">
        <div class="text fl">
          地区
        </div>
        <img :src="arrowDown" class="arrow arrow-down fr" v-show="isEdit">
        <div class="value fr">
          <span class="text" v-show="!isEdit">{{saveuserinfo.provinceName}}</span>
          <span class="text select" v-show="isEdit">{{provinceSelect}}</span>
          <span class="choose" v-show="isEdit" @click="show(0)"></span>
        </div>
      </a> 
      <a class="list clear signature">
        <div class="text fl">
          个性签名
        </div>
        <div class="value fr"  >
          <div class="edited" v-show="isEdit">
            <textarea name="" id="" maxlength="40" v-model="areaValue"></textarea>
            <div class="counter">{{areaValue?areaValue.length:'0'}}/40</div>
          </div>
          <span class="text" v-show="!isEdit">{{saveuserinfo.signature}}</span>
        </div>
      </a>
    </div>
    <!-- 按钮 -->
    <div class="btns clear" id="btns">
      <a href="javascript:void(0);"class="regBtn edit" @click="edit" v-show="!isEdit">编辑</a>
      <a href="javascript:void(0);" class="cancel fl" @click="cancel" v-show="isEdit" >取消编辑</a>
      <a href="javascript:void(0);" class="save fr" @click="save" v-show="isEdit" >保存</a>
    </div>
    <v-loading :isRequest="isRequest"></v-loading>
    <picker :slots="slots" @change="onValuesChange" :value-key="'name'" :show-toolbar="showToolbar">
      <span style="float:left" @click="close">取消</span> <span style="float:right" @click="confirm">确定</span>
    </picker>
  </div>
</template>

<script>
  import pathNav from '../components/path.vue'
  import { MessageBox, Toast, Picker } from 'mint-ui'

  export default {
    components: {
      pathNav,
      MessageBox,
      Toast,
      Picker,
      "v-loading": require('../components/loading.vue')
    },
    data() {
      return {
        isResize: false,
        isEdit: false,
        isLogined: true,
        arrowRight: require('../img/arrow-right.png'),
        arrowDown: require('../img/icon-arrow-bot.png'),
        areaValue: '',
        inputnickName: '',
        inputrealName: '',
        inputSex: '',
        inputLoc: '',
        images: [],
        saveuserinfo: {},
        province: [],
        isRequest: false,
        arr: [{'name':'请选择','value':null}],
        showToolbar: true,
        flag: 1,
        sex: '',
        mysex: '',
        mysexid: '',
        provinceSelect: '',
        myprovince: '',
        myprovinceid:''
      }
    },
    computed: {
      slots() {
        return [{
          flex: 1,
          values: this.arr,         
          className: 'slot1',
          textAlign: 'center'
        }]
      }
    },
    mounted () {
      this.close()
    },
    methods: {
      show(flag) {
        if(flag) {
          var arr = [{'name':'请选择','value':null}]
          var arr1 = [{'name':'男','value':1},{'name':'女','value':0}]
        } else {
          var arr = [{'name':'请选择','id':null}]
          var arr1 = this.province
        }
        this.flag = flag
        this.arr = arr.concat(arr1)
        document.querySelector('.picker').style.bottom = 0
      },
      onValuesChange(picker, values) {
        if (this.flag === 1) {
          if (values[0].value!=null) {
            this.mysex = values[0].name
            this.mysexid = values[0].value
          } else {
            this.mysex = ''
            this.mysexid = ''
          }
        } else if(this.flag === 0) {
          if (values[0].id!=null) {
            this.myprovince = values[0].name
            this.myprovinceid = values[0].id
          } else {
            this.myprovince = ''
            this.myprovinceid = ''
          }
        }
      },
      close() {
        document.querySelector('.picker').style.bottom = '-5rem'
      },
      confirm() {
        if (this.flag === 1) {
          this.sex = this.mysex
          this.inputSex = this.mysexid
        } else if(this.flag === 0) {
          this.provinceSelect = this.myprovince
          this.inputLoc = this.myprovinceid
        }
        this.close()
      },
      getFile (event) {
        var self = this
        var ele = event.currentTarget
        self.file = ele.files[0]
        self.images.push(window.URL.createObjectURL(self.file))
        if (self.images.length > 1) {
          self.images.splice(0, 1)
        }
      },
      // 使输入框有默认值
      init() {
        this.areaValue = this.saveuserinfo.signature
        this.inputnickName = this.saveuserinfo.nickName.substring(0,8)
        this.inputrealName = this.saveuserinfo.realName
        this.inputSex = this.saveuserinfo.sex
        this.provinceSelect = this.saveuserinfo.provinceName
        this.images = []
        this.file = []
      },
      edit() {
        this.sex = this.saveuserinfo.sex === 0?'女':'男'
        // this.sex = this.saveuserinfo.sex
        this.isEdit = true
      },
      cancel() {
        this.init()
        this.isEdit = false
      },
      save() {
        let that = this
        let state = this.$store.state
        let userinfo = state.userInfo
        let sex = ''
        if (that.inputnickName === '') {
          Toast({
            message: '昵称不能为空',
            position: 'middle',
            duration: 3000
          })
          return
        }
        var formData = new FormData()
        if (!that.file) {
          that.file = ''
        }
        if (that.inputSex == "0" || that.inputSex == "1") {
          sex = window.parseInt(that.inputSex)
        } else {
          sex = ''
        }
        if (!that.inputrealName) {
          that.inputrealName = ''
        }
        if (!that.inputLoc || typeof(that.inputLoc) === 'string') {
          that.inputLoc = ''
        }
        if (!that.areaValue) {
          that.areaValue = ''
        }
        that.isRequest = true
        formData.append('file', that.file)
        formData.append('id', userinfo.id)
        formData.append('nickName', that.inputnickName)
        formData.append('sex', sex)
        formData.append('realName', that.inputrealName)
        formData.append('signature', that.areaValue)
        formData.append('provinceId', that.inputLoc)
        let url = state.host + state.baseUrl + '/user/updateUserInfo'
        
        this.$http.post(url, formData, true).then(res => {
          that.isRequest = false
          let data = res.data
          if (data.code === '000000') {
            Toast({message: '提交成功', duration: 2000})
            this.update(userinfo.id)
          } else {
            Toast({
              message: '提交失败',
              position: 'middle',
              duration: 3000
            })
          }
        }, err => {
          that.isRequest = false
          Toast({message:'系统异常', duration: 2000})
        }).catch((e)=>{
          console.log(e)
          that.isRequest = false
        })
        this.isEdit = false
      },
      loadData() {
        let state = this.$store.state
        let userinfo = state.userInfo
        let photo = userinfo.userPhoto
        let arr = ['account', 'nickName', 'realName', 'sex', 'provinceName', 'signature']

        this.saveuserinfo = state.userInfo
        for (let i=0; i<arr.length; i++) {
          if (this.saveuserinfo[arr[i]] == null || this.saveuserinfo[arr[i]] == 'null') {
            this.saveuserinfo[arr[i]] = ''
          }
        }
        this.imgSrc = photo?this.$getRealImg(photo,this.$store.state.hostImg):this.$store.state.defaultPhoto
      },
      update(id) {
        let self = this
        let state = this.$store.state
        let userinfo = state.userinfo
        let url = state.host + state.baseUrl + '/user/getUserInfoById?userId=' + id

        this.$http.get(url).then((res) => {
          let data = res.data
          this.$store.commit('SET_USERINFO', data.data)
          this.saveuserinfo = data.data
          console.log(data.data)
          this.loadData()
        })
      }
    },
    created() {
      this.loadData()
      this.init()

      // 获取省份列表
      window.localStorage.removeItem('userSource')
      let state = this.$store.state
      let userinfo = state.userinfo
      let url = state.host + state.baseUrl + '/common/findProvinceList'
      console.log(url)

      this.$http.get(url).then((res) => {
        let data = res.data.data
        this.province = data
      })
      
      var h = document.body.scrollHeight;
      window.onresize = function(){
          var btns = document.getElementById('btns')
          if(!btns) {
            return
          }
          if (document.body.scrollHeight < h) {
              btns.style.display = "none";
          }else{
              btns.style.display = "block";
          }
      };
    }
  }
</script>

<style scoped lang="scss" src="../css/userinfo.scss"></style>
<style scoped lang="scss">
  .userdetail {
    .main {
      .list {
        position: relative;
        padding: 0;
        height: .84rem;
        line-height: .84rem;
        &.signature{
          height: inherit;
          line-height: inherit;
          padding: .15rem 0;
        }
        .choose {
          position: absolute;
          width: 5rem;
          height: .8rem;
          top: 0;
          right: 0;
        }
        .select.text {
          margin-right: .2rem;
          color:#999;
        }
        .text {
          margin-left: 0;
          // margin-top: .1rem;
        }
        #checkPhoto {
          opacity: 0;
        }
        input,textarea {
          width: 4.8rem;
          margin-right: .4rem;
          padding: 0 .1rem;
          box-sizing:border-box;
          border: none;
          border: 1px dashed #ddd;
          -webkit-appearance:none;
          background-color: #FDFDFD;
          font-size: .26rem;
          color:#999;
          text-align: right;
          font-family:Helvetica Neue,Tahoma,Arial,PingFangSC-Regular,Hiragino Sans GB,Microsoft Yahei,sans-serif;
        }
        label {
          input {
            margin-right: 0;
          }
        }
        input {
          height: .5rem;
          line-height: .5rem;
        }
        textarea {
          height: 1.1rem;
        }
        .counter {
          position: absolute;
          right: .5rem;
          bottom: .3rem;
          font-size: .24rem;
          color: #999;
        }
      }
      
      .provincename.list {
        .value {
          position: relative;
          width: 5rem;
          margin-right: -.2rem;
          .text {
            position: absolute;
            right: .2rem;
            top: -.02rem;
          }
          #province {
            opacity: 0;
          }
        }
      }
      .avatar {
        padding: .1rem 0;
        height: 1.2rem;
        overflow: hidden;
        .text,.arrow {
          margin-top: .3rem;
        }
        .arrow {
          margin-left: .2rem;
        }
      }
      .account {
        .text.edited {
          margin-right: .44rem;
        }
      }
      .arrow-down {
        width: .25rem !important;
        height: .16rem !important;
        margin-top: 0.3rem !important;
      }
      .list-avatar {
        // margin-top: .2rem;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        margin-right: 0;
        overflow: hidden;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        .photo-item {
          // background-size: contain;
          width: 1rem;
          height: 1rem;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
    .edit {
      color: #F98080;
      border-color: #F98080;
    }
    .save, .cancel {
      display: inline-block;
      font-size: 0.36rem;
      height: 0.8rem;
      line-height: 0.8rem;
      text-align: center;
      border: 1px solid #0f9e59;
      border-radius: 0.8rem;
      text-decoration: none;
      width: 2.5rem !important;
    }
    .regBtn {
      position: static;
      margin: 0 auto;
      // bottom: .7rem;
      // width: 80%;
      // left: 50%;
      // margin-left:-40%;
      &:hover {
        color: #fff;
        background-color: #F98080;
      }
    }
    .btns {
      position: absolute;
      bottom: .7rem;
      width: 80%;
      left: 50%;
      margin-left:-40%;
      // transform: translateX(-50%);
    }
    // @media (max-height: 400px) { 
    //   .regBtn, .btns  {
    //     display: none;
    //   }
    // }
    .cancel {
      border-color: #666;
      color: #666;
      &:hover {
        color: #fff;
        background-color: #666;
      }
    }
    .save {
      &:hover {
        color: #fff;
        background-color: #0f9e59;
      }
    }
  }
</style>

