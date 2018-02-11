<template>
    <div class="empty">
        <h1>网站维护中…</h1>
    </div>
</template>
<script>

</script>
<style lang="scss" scoped>
    @import "../css/common.scss";
    .empty{
        position:fixed;
        left:0;
        right:0;
        top:0;
        bottom:0;
        background-color:#fff;
        display:flex;
        align-items:center;
        justify-content: center;
        h1{
            color:#000;
            font-size:pxToRem(40);
            font-weight:normal;
        }
    }
</style>