<template>
    <div class="box box-ver h-p100" id="wrap">
        <nav-path>
            <a href="javascript:;" @click="$router.push('/')">首页</a>
            &gt;
            <a href="javascript:;" @click="$router.push('/userinfo')">个人信息</a>
            &gt;&nbsp;
            <div class="ellipsis box-f1">关于</div>
        </nav-path>
        <div class="box box-ver box-f1 about">
            <img class="logo" src="../img/logo.png">
            <div class="title box box-pc">关于招办问吧</div>
            <p class="desc">
              招办问吧是高考和研招领域最权威、最专业的报考咨询工具，是高校招办组织各院系和专业的专家，为考生提供分类、精细、精准咨询的服务平台。与院系专家对话精深了解专业来龙去脉、与招办专家对话精准掌握政策规则要点，科学报考，走好人生第一步！
            </p>
        </div>
    </div>
</template>

<script>
// import {mapGetters} from 'vuex'
import { Toast } from 'mint-ui'
export default {
  components: {
    'nav-path': require('../components/path.vue')
  },
  mounted () {
    // this.getTopicList()
  },
  data () {
    return {
    }
  },
  methods: {
  },
  destroyed(){
    // document.getElementById("wrap").style.display = 'none'
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import '../css/color.scss';
    @import '../css/mixins.scss';
    .about{
      margin-top:.71rem;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
    }
    .logo{
      width:3.6rem;
      height:3.6rem;
      display: block;
      margin:0 auto;
      margin-top:1.4rem;
    }
    .title{
      margin-top:.7rem;
      font-size:.36rem;
      color:#333;
      font-weight:700;
    }
    .desc{
      width: 90%;
      margin:.27rem auto;
      margin-right: 4%;
      color:#444;
      font-size:.32rem;
      line-height:.48rem;
      text-indent:2em;
      word-break:break-all;
    }
</style>
