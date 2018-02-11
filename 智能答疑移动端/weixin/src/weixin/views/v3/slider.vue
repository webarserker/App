<template>
    <div>
        <ul class="section-links">
            <li @click="sliderX(0)" :style="{color:$store.state.themeColor}" :class="{'link-active':currentPageIndex==0}">
                快讯
                <p class="underline" :style="{backgroundColor:$store.state.themeColor}"></p>
            </li>
            <li @click="sliderX(1)" :style="{color:$store.state.themeColor}" :class="{'link-active':currentPageIndex==1}">
                招录公告
                <p class="underline" :style="{backgroundColor:$store.state.themeColor}"></p>
            </li>
            <li @click="sliderX(2)" :style="{color:$store.state.themeColor}" :class="{'link-active':currentPageIndex==2}">
                视频在线
                <p class="underline" :style="{backgroundColor:$store.state.themeColor}"></p>
            </li>
        </ul>
        <div class="slider" ref="slider">
            <div class="slider-group" ref="sliderGroup">
                <slot>
                </slot>
            </div>
        </div>
    </div>

</template>
<script>
    import BScroll from 'better-scroll'
    import {addClass} from './utils/dom.js'
    export default {
        name: 'slider',
        props: {
            loop: {
                type: Boolean,
                default: false
            },
            autoPlay: {
                type: Boolean,
                default: false
            },
            interval: {
                type: Number,
                default: 3000
            }
        },
        data(){
            return {
                currentPageIndex: 0
            }
        },
        methods:{
            _play() {
                let pageIndex = this.currentPageIndex + 1
//                if (this.loop) {
//                    pageIndex += 1
//                }
                this.timer = setTimeout(() => {
                    this.slider.goToPage(pageIndex, 0, 400)
                }, this.interval)
            },
            setSliderWidth() {
                this.children = this.$refs.sliderGroup.children

                let width = 0
                let sliderWidth = this.$refs.slider.clientWidth
                for (let i = 0; i < this.children.length; i++) {
                    let child = this.children[i]
                    addClass(child, 'slider-item')

                    child.style.width = sliderWidth + 'px'
                    width += sliderWidth
                }
                this.$refs.sliderGroup.style.width = width + 'px'
            },
            initSlider() {
                this.slider = new BScroll(this.$refs.slider, {
                    scrollX: true,
                    scrollY: false,
                    momentum: false,
                    snap: true,
                    snapLoop: this.loop,
                    snapThreshold: 1,
                    snapSpeed: 300,
                    eventPassthrough : 'vertical'
                })

                this.slider.on('scrollEnd', () => {


                    let pageIndex = this.slider.getCurrentPage().pageX
//                    if (this.loop) {
//                        pageIndex -= 1
//                    }
                    this.currentPageIndex = pageIndex

                    var currentItem=document.getElementsByClassName('slider-item')[this.currentPageIndex];
                    var currentItemHeight=currentItem.offsetHeight;

                    var linkHeight=document.getElementsByClassName('section-links')[0].offsetHeight;
                    document.getElementById('slider-wrapper').style.height=(currentItemHeight+linkHeight)+'px'
                    document.getElementsByClassName('slider-group')[0].style.height=currentItemHeight+'px';

                    if (this.autoPlay) {
                        clearTimeout(this.timer)
                        this._play()
                    }
                })
            },
            sliderX(i){
                this.slider.goToPage(i, 0, 400)
            }
        },
        mounted(){
            setTimeout(() => {
                this.setSliderWidth()
                this.initSlider()

//                if (this.autoPlay) {
//                    this._play()
//                }
            }, 20)
        }
    }
</script>
<style lang="scss" scoped>

</style>