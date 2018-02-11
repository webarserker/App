<template>
  <div class="footer" id="mFooter">
    <ul>
      <li @click="$router.push('/home')" :class="{'active':currentIndex2==0}">
        <div>
          <i class="icon-zhuye"></i>
          <p>首页</p>
        </div>
        <!--<img src="../common/image/zhen.png" alt="">-->
      </li>

      <router-link v-for="(item,index) in footerList"
                   tag="li"
                   :key="index" :to="{name:'SecondCatList',query:{parentId:item.id}}"
                   :class="{'active':index+1==currentIndex2}" v-if="item.status">
        <div>
          <i :class="item.icon?item.icon:'icon-jingfei'"></i>
          <p>{{item.name}}</p>
        </div>
        <!--<img src="../common/image/zhen.png" alt="">-->
      </router-link>

      <li @click="$router.push('/tels')" :class="{'active':currentIndex==4}">
        <div>
          <i class="icon-huatong"></i>
          <p>联系方式</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: {
      'currentIndex': {
        type: Number,
        default: 0
      }
    },
    computed: {
      parentId() {
        return this.$route.query ? this.$route.query.parentId : -1;
      },
      footerList() {
        return this.$store.state.footerList;
      }
    },
    created() {
      let state = this.$store.state;
      let _this=this;
      state.footerList.forEach((value,index)=>{
        if(value.id==this.$route.query.parentId){
          _this.currentIndex2=index+1;
        }
      });
    },
    watch: {
      '$route' (to, from) {
        // 对路由变化作出响应...
        let state = this.$store.state;
        let _this=this;
        state.footerList.forEach((value,index)=>{
          if(value.id==this.$route.query.parentId){
            _this.currentIndex2=index+1;
          }
        });
      }
    },
    data() {
      return {
        currentIndex2: this.currentIndex
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../common/css/mixin.scss';

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 500;
    height: pxToRem(110);
    background-color: #fff;
    border-bottom:pxToRem(1) solid #fff;
    &:before {
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      border-top: pxToRem(1) solid #ddd;
      content: ' '
    }
    ul {
      width: 100%;
      height: 100%;
      display: flex;
      li {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        position: relative;
        &.active {
          background-color:$themeColor;
          i,p {
            color: #fff;
          }
        }
        img {
          top:50%;
          transform:translateY(-50%);
          position: absolute;
          right: 0;
          width: pxToRem(3);
        }
        i {
          font-size: pxToRem(40);
          /*color: #0C9BF7;*/
          color: $themeColor;
        }
        p {
          margin-top: pxToRem(10);
          font-size: pxToRem(28);
          color: rgb(102,102,102);
        }
      }
    }
  }
</style>
