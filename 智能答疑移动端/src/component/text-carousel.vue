<style scoped>
    .text-carousel{
        width: 100%;
        height: 50px;
        line-height: 50px;
        position: relative;
        font-size: 13px;
        color: #666;
        border-top: 1px solid #EEE;
        border-bottom: 1px solid #EEE;
        background: #F6F6F6;
    }
    .container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
    }

    .text-carousel-label{
        position: absolute;
        left: 1em;
        top: 0;
    }

    .text-carousel-label .iconfont{
        font-size: 1em;
    }
    
    .animate .pane {
        transition: all 1s;
        -webkit-transition: all 1s;
    }

    .pane {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        text-align: left;
        overflow: hidden
    }

    .pane a{
        display: inline-block;
        margin-left: 6em;
        color: red
    }

</style>

<template>
    <div class="text-carousel">
        <div class="container">
            <div class="pane" v-for="item in data">
                <a class="w3-theme-important" :href="item.href">{{item.text}}</a>
            </div>
        </div>
        <div class="text-carousel-label w3-text-theme">
            <span class="iconfont icon-62"></span>
            公告：
        </div>
    </div>
</template>

<script>
    import Hammer from '../lib/hammer.js'
    import HammerCarousel from '../lib/hammer-carousel.js'
    var vmData = {}, carousel, carouselIndex = 0, timer;

    function renderCarousel(len, time){
        var vm = this;
        if(!len) return;
        
        carouselIndex = 0;
        clearInterval(timer);

        timer = setInterval(function(){
            if(carouselIndex < len - 1){
                carouselIndex += 1;
            }else{
                carouselIndex = 0;
            };
            
            carousel.show(carouselIndex, 0, true);
        }, time);
        
        carousel = new HammerCarousel(
            this.$el.querySelector('.container'), 
            Hammer.DIRECTION_DOWN,
            {
                // onPan: function(index){
                //     index = Math.max(0, Math.min(index, vm.data.length - 1));
                //     carouselIndex = index;
                // }
            }
        );
    };

    export default {
        props: ['data', 'time'],
        data: function(){
            return {};
        },
        methods: {
            render: function(){
                var vm = this;
                // 等待dom更新
                vm.$nextTick(function () {
                    renderCarousel.call(vm, vm.data.length, vm.time);
                });
            }
        },
		created: function(){
            var vm = this;

            var list = [
                new Promise(function(resolve){
                    vm.$on('page-show', resolve);
                }), 
                new Promise(function(resolve){
                    vm.$watch('data', resolve);
                })
            ];
            
            Promise.all(list).then(function(){
                vm.render();
                vm.$watch('data', function(){
                    vm.render();
                });
            });
		}
    };
</script>