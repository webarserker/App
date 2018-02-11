<template>
    <div>
        <div :class="!endFlag?'loading':'hiding'">
            <span class="loadIcon comicon-29"></span> 正在加载中...
        </div>
        <div :class="endFlag&&showEnd?'loading':'hiding'">
            数据全部加载完成。
        </div>
    </div>
</template>
<script>
export default {
    props:['endFlag','showEnd']
}
</script>
<style lang="scss" scoped>
@import "../css/common.scss";
.loading {
    height: pxToRem(36);
    font-size: pxToRem(28);
    color: #333;
	display: flex;
	align-items:center;
	justify-content:center;
    margin: pxToRem(20);
}

.loadIcon {
    font-size: pxToRem(30);
    margin-right: pxToRem(10);
    animation: ro 1s infinite linear;
}

.hiding{
	display: none;
}

@keyframes ro {
    from {
        transform: rotate(0)
    }
    to {
        transform: rotate(360deg)
    }
}
</style>
