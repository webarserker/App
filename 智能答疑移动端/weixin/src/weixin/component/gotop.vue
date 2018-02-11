<template>
    <div class="gotop"></div>
</template>
<script>
export default {
    mounted() {
        window.onscroll = function() {
            console.log(1)
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../css/common.scss";
.gotop{
	position: fixed;
	right: pxToRem(30);
	bottom: pxToRem(100);
	width: pxToRem(80);
	height: pxToRem(80);
	line-height: pxToRem(80);
	text-align: center;
	background: url('../img/top.png') no-repeat center/cover;
	background-size: pxToRem(60);
	font-size: pxToRem(30);
	border-radius: 50%;
	border: pxToRem(3) solid #000;
}
</style>
