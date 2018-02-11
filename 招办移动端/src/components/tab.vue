<template>
  <div class="tab">
    <i class="icon-fanhui" @click="$router.back()"></i>&nbsp;
    <router-link to="/home">
      <span class="home">首页</span> &nbsp;<i style="color:#555">&gt;&gt;</i>&nbsp;
    </router-link>
    <span class="entry-name">
        {{entryName}}
    </span>
    <span class="next" v-if="tabLast">
      &nbsp;&gt;&gt;&nbsp;
    </span>
    <p>
      {{tabLast}}
    </p>
  </div>
</template>
<script>
  export default{
    props: {
      entryName: {
        type: String,
        default: ''
      },
      tabLast: {
        type: String,
        default: ''
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../common/css/variable";

  .tab {
    position:fixed;
    z-index:300;
    width:100%;
    top:.36rem;
    left:0;
    height: .36rem;
    line-height: .36rem;
    background: #f6f6f6;
    color: #555;
    font-size: .13rem;
    padding: 0 .1rem;
    width: 100%;
    display:flex;
    align-items:center;
    a {
      line-height: .36rem;
    }
    span.home {
      color: @theme;
    }
    i.icon-fanhui {
      color: @theme;
      font-size: .23rem;
      font-weight: bold;
      vertical-align: middle;
      margin-right:.2rem;
    }
    span.entryName {
      color: @theme;
      font-size: .13rem;
    }
    p {
      color: #555;
      font-size: .13rem;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
