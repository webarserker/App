<template>
    <div class="contentList">
      <Notice></Notice>
      <Tab entryName="其他"></Tab>
      <ul>
        <router-link :to="{name:'Feedback'}" tag="li">
          <div class="title">
            <p>
              用户反馈
            </p>
          </div>
          <div class="time">
            <i class="icon-right"></i>
          </div>
        </router-link>
        <router-link :to="{name:'Forum'}" tag="li">
          <div class="title">
            <p>
              招办论坛
            </p>
          </div>
          <div class="time">
            <i class="icon-right"></i>
          </div>
        </router-link>
        <router-link :to="{name:'AboutUs'}" tag="li">
          <div class="title">
            <p>
              关于我们
            </p>
          </div>
          <div class="time">
            <i class="icon-right"></i>
          </div>
        </router-link>
      </ul>

      <MFooter entryIndex="3"></MFooter>

        <router-view></router-view>
    </div>

</template>
<script>
  import  Tab from '../components/tab.vue'
  import MFooter from '../components/footer'
  import Notice from '../components/notice'
  import {wxShare} from '../common/js/mixin'

  export default {
    mixins:[wxShare],
    components: {Tab, MFooter, Notice}
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../common/css/mixin";

  .contentList {
    padding-top: .72rem;
    li {
      .border-1px(#ddd);
      height: .43rem;
      line-height: .42rem;
      display: flex;
      padding: 0 .1rem;
      &:active {
        background-color: #eee;
      }
      .title {
        flex: 1;
        font-size: .13rem;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
          position: relative;
          max-width: 100%;
          .red {
            position: absolute;
            width: .04rem;
            height: .04rem;
            right: 0px;
            top: .06rem;
            background: #E15B53;
            border-radius: 50%;
          }
        }
      }
      .time {
        width: 1rem;
        text-align: right;
      }
    }
  }
</style>
