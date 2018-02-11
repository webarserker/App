<template>
    <div class="tip" v-if="show" transition="fadeIn">
        <div class="content">{{ options.content }}</div>
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
.tip{
    width: 100%;
    position: fixed;
    z-index: 10000;
    top: 50%;
    display: flex;
    justify-content:center;
    .content{
        font-size: pxToRem(28);
        background-color: rgba(0,0,0,0.6);
        border-radius: 5px;
        color: #fff;
        text-align: center;
        padding: pxToRem(10);
    }
}
</style>
