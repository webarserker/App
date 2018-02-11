<template>
    <div v-show="$store.state.loadingFlag" class="loading"></div>
</template>
<style lang="scss" scoped>
    @import "../css/common.scss";
    .loading{
        position: fixed;
        left: 0;
        right: 0;
        top: pxToRem(100);
        bottom: 0;
        background: #fff url('../img/loading2.gif') center no-repeat;
        background-size: pxToRem(300);
        z-index: 9999;
    }
</style>