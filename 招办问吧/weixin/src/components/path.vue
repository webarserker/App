<template>
  <div class="path box box-ac">
      <div class="back" @click="$router.goBack()">
        <i class="comicon-17 icon1-return" ></i>
      </div>
      <slot></slot>
      <span v-if="current">{{current}}</span>
  </div>
</template>

<script>
  import '../css/path.scss'
  export default {
    props: ['current']
  }
</script>

