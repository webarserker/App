<template>
  <transition name="fade">
    <div class="toast">
      {{toastWords}}
    </div>
  </transition>
</template>
<script>
  export default{
    props: {
      toastWords: {
        type: String,
        default: ''
      }
    }
  }

</script>
<style lang="less" rel="stylesheet/less" scoped>
  .fade-enter-active, .fade-leave-active {
    transition: all .3s;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0;
  }

  .toast {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    z-index: 888;
    bottom: .6rem;
    padding: .1rem .1rem;
    border-radius: 6px;
    background: rgba(0, 0, 0, .7);
    color: #fff;
    text-align: center;
    font-size: .14rem;
  }
</style>
