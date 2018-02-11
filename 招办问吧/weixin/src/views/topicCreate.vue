<template>
  <div class="topcreate">
    <div class="introduce card">
      <div class="text">
        针对话题的自我简介：
      </div>
      <textarea v-model="title" maxlength="40" name="" id="" placeholder="如：我是某某大学研究生招办客服，如何报考我校？请问我吧！">
       </textarea>
      <div class="counter">{{title.length}}/40</div>
    </div>
    <div class="describe card">
      <div class="text">
        话题详细描述：
      </div>
      <textarea v-model="content" maxlength="300" name="" id="" placeholder="请输入话题描述">
      </textarea>
      <div class="counter">{{content.length}}/300</div>
    </div>
    <div class="img card clear">
      <div v-if="images.length>0" @click="checkPhoto" v-for="(item,index) in images" :style="{backgroundImage: 'url(' + item + ')'}" class="photo-item">
      </div>
      <image-cropper :cropperSize="{width:690,height:400}" :checkPhotoType="checkPhotoType" :checkPhotoFlag="checkPhotoFlag" :callback="loadImage"></image-cropper>
      <label @click="checkPhoto" v-if="images.length===0" for="checkPhoto" class="photo-item fl">
          <div class="uploadImg"></div>
          <!--<input @change="getFile($event)"  id="checkPhoto" type="file" multiple="multiple" accept="image/*"/>-->
      </label>
      <div v-if="images.length===0" class="decs fl">
        <p class="text">添加话题图片</p>
        <p class="sub">(建议尺寸:690*400px)</p>
      </div>
    </div>
    <!-- <select name="" id="" style="width:100%;height:50px;">
      <option value="">所属院系</option>
    </select> -->
    <div class="list clear" @click="show(1)">所属院系
      <img :src="arrow" alt="" class="arrow-right fr">
      <div id="department" class="select ellipsis">{{department}}</div>
      <!-- <select name="depart" id="depart" v-model="departmentId" class="ellipsis" style="opacity:0" @change="selectText('depart')">
        <option selected value>请选择</option>
        <template v-if="$store.state.userInfo.departmentId">
          <option v-if="$store.state.userInfo.departmentId == item.id" v-for="(item, index) in departmentList" :value="item.id">{{item.name}}</option>
        </template>
        <template v-else>
          <option v-for="(item, index) in departmentList" :value="item.id">{{item.name}}</option>
        </template>
      </select> -->
    </div>
    <div class="list clear" @click="show(0)">所属专业
      <img :src="arrow" alt="" class="arrow-right fr">
      <div id="major" class="select ellipsis">{{major}}</div>
      <!-- <select name="major" id="majorId" v-model="majorId" class="ellipsis" style="opacity:0" @change="selectText('major')" @click="getMajorList">
        <option selected value>请选择</option>
        <template v-if="$store.state.userInfo.majorId">
          <option v-if="$store.state.userInfo.majorId == item.id" v-for="(item, index) in majorList" :value="item.id">{{item.name}}</option>
        </template>
        <template v-else>
          <option v-for="(item, index) in majorList" :value="item.id">{{item.name}}</option>
        </template>
      </select> -->
    </div>
    <div class="error" v-show="isSubmit">{{error}}</div>
    <div class="btns clear">
      <div @click="back()" class="btn cancel fl">取消</div>
      <div @click="saveTopic()" class="btn submit fr">提交</div>
    </div>
    <picker :slots="slots" @change="onValuesChange" :value-key="'name'" :show-toolbar="showToolbar">
      <span style="float:left" @click="close">取消</span> <span style="float:right" @click="confirm">确定</span>
    </picker>
  </div>
</template>

<script>
import {Toast, Picker} from 'mint-ui'
export default {
  name: 'topicCreate',
  components: {
    'image-cropper': require('../components/imageCropper.vue'),
    Picker
  },
  data() {
    return {
      uploadImg: require('../img/upload.png'),
      arrow: require('../img/icon-arrow-bot.png'),
      images: [],
      error: ' ',
      isSubmit: true,
      file: '',
      title: '',
      content: '',
      departmentList: [],
      majorList: [],
      mydepart: '',
      mydepartid: '',
      departmentId: '',
      department: '',
      mymajor:'',
      mymajorid:'',
      majorId: '',
      major:'',
      checkPhotoFlag:0,
      checkPhotoType:1,
      isRequest: false,
      arr: [{'name':'请选择','value':null}],
      showToolbar: true,
      flag: 1
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
    this.checkLogin()
    this.close()
  },
  methods: {
    show(flag) {
      var arr = [{'name':'请选择','id':null}]
      if(flag) {
        var arr1 = this.departmentList
      } else {
        var arr1 = this.majorList
      }
      this.flag = flag
      this.arr = arr.concat(arr1)
      document.querySelector('.picker').style.bottom = 0
    },
    onValuesChange(picker, values) {
      if (this.flag === 1) {
        this.mydepart = values[0].name
        this.mydepartid = values[0].id
      } else if(this.flag === 0) {
        this.mymajor = values[0].name
        this.mymajorid = values[0].id
      }
      console.log(values[0].id)
    },
    close() {
      document.querySelector('.picker').style.bottom = '-5rem'
    },
    confirm() {
      if(this.mydepartid && this.flag === 1) {
        this.department = this.mydepart
        this.departmentId = this.mydepartid
        this.majorId = ''
        this.major = ''
        this.loadMajor ()
      } else if(this.mymajorid && this.flag === 0) {
        this.major = this.mymajor
        this.majorId = this.mymajorid
      }
      if(!this.mydepartid) {
        this.department = ''
        this.departmentId = ''
        this.majorId = ''
        this.major = ''
        this.majorList = ''
      }
      if(!this.mymajorid) {
        this.major = ''
        this.majorId = ''
      }
      this.close()
    },
    back () {
      this.$router.go(-1)
    },
    checkLogin () {
      var self = this
      var state = self.$store.state
      if (!state.isLogin || state.userInfo.isTopicAdmin !== 1) {
        self.$router.replace('/')
      }
    },
    checkPhoto () {
      if (this.checkPhotoFlag > 0) {
        this.checkPhotoType = 2
      } 
      this.checkPhotoFlag++
    },
    // image-cropper组件的回调
    loadImage (data) {
      this.images = []
      this.images.push(data)
      this.file = this.dataURLtoBlob(data)
    },
    dataURLtoBlob (dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type:mime});
    },
    getFile (event) {
      var self = this
      var ele = event.currentTarget
      self.file = ele.files[0]
      self.images.push(window.URL.createObjectURL(self.file))
    },
    saveTopic () {
      var self = this
      var state = self.$store.state
      var title = self.title
      var content = self.content
      var file = self.file
      if (self.isRequest) return
      if (title.length === 0) {
        self.error = '请填写标题'
        return
      }
      if (content.length === 0) {
        self.error = '请填写内容'
        return
      }
      if (file === '') {
        self.error = '请先上传图片'
        return
      }
      if (this.departmentId == null) {
        this.departmentId = ''
      }
      if (this.majorId == null) {
        this.majorId = ''
      }
      this.isSubmit = false
      var formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('content', content)
      formData.append('sCode', state.userInfo.sCode)
      formData.append('creatorId', state.userId)
      formData.append('creator', state.userName)
      formData.append('departmentId', this.departmentId)
      formData.append('majorId', this.majorId)
      // console.log(formData)
      self.isRequest = true
      this.$http.post(state.host + state.baseUrl + '/topic/saveTopic', formData, {
        progress(event) {
          let progress = Math.floor(event.loaded / event.total * 100) + '%'
          Toast({message: '图片上传中' + progress, duration: 166})
        }
      }).then(res => {
        var data = res.data
        Toast({message: '创建成功', duration: 3000})
        setTimeout(() => {
          self.isRequest = false
          self.$router.push('/')
        }, 1500)
      })
    },
    getDepartmentList () {
      var self = this
      var state = self.$store.state
      this.$http.get(state.host + state.baseUrl + '/common/findDepartmentList?sCode=' + state.userInfo.sCode)
        .then(res => {
          var data = res.data.data
          if (self.$store.state.userInfo.departmentId) {
            var id = self.$store.state.userInfo.departmentId
            var name
            for (var i=0; i < data.length; i++) {
              if (data[i].id === id) {
                name = data[i].name
              }
            }
            self.departmentList = [{'name': name, 'id': id}]
          } else {
            self.departmentList = data
          }
        })
    },
    getMajorList () {
      var self = this
      var state = self.$store.state
      if(!self.departmentId) {
        Toast({message: '请先选择院系', duration: 3000})
        return
      }
      this.loadMajor()
    },
    loadMajor () {
      var self = this
      var state = self.$store.state

      this.$http.get(state.host + state.baseUrl + '/common/findMajorList?departId=' + self.departmentId)
        .then(res => {
          var data = res.data.data
          if (self.$store.state.userInfo.majorId) {
            var id = self.$store.state.userInfo.majorId
            var name
            for (var i=0; i < data.length; i++) {
              if (data[i].id === id) {
                name = data[i].name
              }
            }
            self.majorList = [{'name': name, 'id': id}]
          } else {
            self.majorList = data
          }
        })
    }
  },
  created() {
    this.getDepartmentList()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import '../css/color.scss';
    @import '../css/mixins.scss';
    
    * {
      padding: 0;
      margin: 0;
    }
    .list {
      position: relative;
    }
    select {
      width: 100%;
      height: 80%;
      position: absolute;
      left: 0;
    }
    .select {
      position: absolute;
      width: 70%;
      top: .21rem;
      left: 1.5rem;
    }
    .topcreate {
      margin-top: 1.1rem !important;
      .card {
        padding: .2rem;
        border-bottom: 1px solid #DCDCDC;
        position: relative;
        .text {
          margin-bottom: .12rem;
        }
        textarea {
          box-sizing:border-box;
          width: 100%;
          height: 1.5rem;
          padding: .2rem .3rem;
          border: 1px solid #DCDCDC;
          border-radius: .2rem;
          background-color: #FAFAFA;
          font-size: .26rem;
          -webkit-appearance: none; 
          box-shadow: none;
        }
        .counter {
          position: absolute;
          right: .3rem;
          bottom: .3rem;
          font-size: .28rem;
          color: #999;
        }
      }
      .photo-item{
          position:relative;
          width:1rem;
          height:1rem;
          @include bg-size(cover);
          #checkPhoto{
            opacity: 0
          }
          .uploadImg{
            width:100%;
            height:100%;
            @include bg-size(cover);
            @include bg-image('../img/upload')
          }
      }
      .img {
        .uploadImg {
          width: 1rem;
          height: 1rem;
        }
        .file {
          display: none;
        }
        .decs {
          display: inline-block;
          vertical-align: super;
          margin-left: .1rem;
          .text {
            margin-bottom: .24rem;
          }
          .sub {
            margin-top: -.1rem;
            color: #666;
            font-size: 0.24rem;
          }
        }
      }
      .list {
        margin: 0 .2rem;
        padding: .2rem 0;
        border-bottom: 1px solid #DCDCDC;
        .arrow-right {
          margin-top: .14rem;
          width: .3rem;
        }
      }
      .error {
        text-align: center;
        margin-top: .2rem;
        margin-bottom: -.2rem;
        // padding-left: .2rem;
        // background-color: $error-bg;
        color:$error-red;
        font-size: 0.3rem;
      }
      .btns {
        width: 4.9rem;
        margin: 0 auto;
        margin-top: .6rem;
        .btn {
          @include btn(1.8rem, .6rem, .3rem, $txt-color2)
          border-radius: 4px;
        }
        .btn.cancel {
          border-color: #999;
        }
        .btn.submit {
          color: $theme-color;
        }
      }
    }
    
</style>
