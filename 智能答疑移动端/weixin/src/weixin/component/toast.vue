<template>
    <div class="tip" v-if="show" transition="fadeIn">
        <slot name="tipIcon"></slot>
        <slot name="tip"></slot>
    </div>
</template>
<script>
export default {
    data () {
      return {
        timers: [],
        Myoptions: this.options,
        Myshow: this.show　
      } 
    },
    props: {
        options: {
            type: Object,
            default: () => {
                return {}
            }
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        close: function() {
          this.Myshow = false
          this.$emit("on-result-change")
        },
        countdown: function(val) {
            if(this.Myoptions.autoClose) {
                const t = setTimeout(() => {
                    this.close()
                }, this.Myoptions.showTime || 2000)
                this.timers.push(t)
            }
        }
    },
    watch: {
        show: function() {
            this.timers.forEach((timer) => {
                window.clearTimeout(timer)
            })
            this.timers = []
            this.countdown()
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../css/common.scss";
/*toast样式*/
.toast{
    position: fixed;
    z-index: 20000;
    background-color: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    padding: pxToRem(20) pxToRem(40);
    min-width: pxToRem(430);
    max-width: pxToRem(600);
    min-height: pxToRem(78);
    left:50%;
    top:50%;
    transform:translateX(-50%) translateY(-50%);

    color: #fff;
    font-size: pxToRem(34);
    border: 1px solid #fff;
    border-radius: pxToRem(10);
    .left{
        flex: 2;
        text-align: center;
    } 
    .right{
        flex: 8;
        text-align: center;
    }
    .iconWp{
        display: inline-block;
        width: pxToRem(70);
        height: pxToRem(70);
        line-height: pxToRem(70);
        text-align: center;
        border-radius: pxToRem(70);
    }
    i{
        font-size: pxToRem(50);
        vertical-align: middle;
    }  
}
.subStyle{
    .iconWp{
        background-color: #80c269;
    }
    .tip{
        color: #0f9e59;
    }
}
.cancelStyle{
    .iconWp{
        background-color: #f98080;
    }
    .tip{
        color: #f98080;
    }
}
</style>
