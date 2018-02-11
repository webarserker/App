<template>
    <div v-show="$store.state.sdecode" v-if="$store.state.scholl" class="sdecode">
        <div @click="$store.state.sdecode=false"></div>
        <img :src="$store.state.imgHost+$store.state.allSchoolInfo.wxSchoolOfficeQrcode" title="qrcode" alt="qrcode" />
        <!--<img :src="$store.state.imgHost+$store.state.scholl.schoolOfficeQrcode" title="qrcode" alt="qrcode" />-->
        <span class="comicon-27" @click="$store.state.sdecode=false"></span>
        <div @click="$store.state.sdecode=false"></div>
    </div>
</template>
<script type="text/javascript">
export default {
    data() {
        return {

        }
    }
}
</script>
<style lang="scss" scoped>
@import "../css/common.scss";
.sdecode {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 9999999999999;
    background: rgba(0, 0, 0, .6);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction:column;
    img {
        width: pxToRem(500);
        height: pxToRem(500);
        &:nth-of-type(2){
            position:absolute;
            width: pxToRem(500);
            height: pxToRem(500);
            left: pxToRem(-200);
            top: 0;
            opacity: 0;
        }
    }
    span{
        position:absolute;
        right: pxToRem(50);
        top: pxToRem(200);
        font-size: pxToRem(44);
        background:#fff;
    }
    div{
        flex:1;
        width: 100%;
    }
}
</style>
