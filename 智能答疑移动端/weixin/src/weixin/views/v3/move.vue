<template>
    <div class="move">
        <div class="move-place" :style="{'height':height,'top':top}">
            <i class="icon-touchmove-v2 jiantou"></i>
            <i class="icon-touchmove-v2 jiantou"></i>
            <i class="icon-touchmove-v2 jiantou"></i>
            <i class="icon-touchmove-v2 jiantou"></i>
            <i class="icon-shoushi-v2"></i>
            <img ref="huadong" :style="{'position':'absolute','top':-imgHeight+'px','left':'15%'}" src="./images/huadong.png" alt="" class="huadong">
            <p class="iknow" @click="$emit('close')">
                <img src="./images/iknow.png" alt="">
            </p>
        </div>
    </div>
</template>
<script>
    export default{
        props:['top','height'],
        data(){
            return {
                imgHeight:''
            }
        },
        mounted(){
            this.imgHeight=this.$refs.huadong.height;
        }
    }
</script>
<style lang="scss" scoped>
    @import 'css/common_v3';
    .move {
        position: fixed;
        z-index: 19999999999;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color:rgba(0,0,0,.7);
        .move-place{
            display:flex;
            align-items:center;
            position:absolute;
            border:pxToRem(2) dashed #fff;
            width:98%;
            border-radius:pxToRem(8);
            box-sizing:border-box;
            left:50%;
            transform:translateX(-50%);
            p.iknow{
                position:absolute;
                bottom:pxToRem(-180);
                padding:pxToRem(32) pxToRem(80);
                border:pxToRem(2) dashed #fff;
                border-radius:pxToRem(8);
                left:50%;
                transform:translateX(-50%);
            }
            i.icon-shoushi-v2{
                color:#fff;
                position:absolute;
                left:50%;
                top:50%;
                font-size:pxToRem(90);
            }
            i.jiantou:nth-child(1){
                font-size:pxToRem(50);
                transform:rotate(180deg);
                position:absolute;
                left:10%;
                color:#fff;
            }
            i.jiantou:nth-child(2){
                font-size:pxToRem(35);
                transform:rotate(180deg);
                position:absolute;
                left:28%;
                color:#aaa;
            }
            i.jiantou:nth-child(3){
                font-size:pxToRem(35);
                position:absolute;
                right:28%;
                color:#aaa;
            }
            i.jiantou:nth-child(4){
                font-size:pxToRem(50);
                position:absolute;
                right:10%;
                color:#fff;
            }
        }
    }
</style>