<template>
  <div style="height:100%;">
    <path-nav :current="'我的好友'">
    <a href="javascript:void(0);" @click="$router.push('/')">首页</a>
      &gt;  
    <a href="javascript:void(0);" @click="$router.push('/userinfo')">个人信息</a>
    &gt; 
    </path-nav>
    <div id="wrap" style="height:100%;padding-top:.7rem;">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import pathNav from '../components/path.vue'

  export default {
    components: {
      pathNav
    }
  }
</script>
