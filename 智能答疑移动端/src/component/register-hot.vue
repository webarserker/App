<style lang="stylus" scoped>

    $icon-width = 40px
    $icon-round = $icon-width/2
    $pane-height = 68px
    $pane-2height = $pane-height * 2
    $container-height = $pane-height * 2
    $arrow-top = $container-height / 2 - 53px

    .pane-height{
        height: $pane-height;
    }
    .pane-2height{
        height: $pane-2height;
    }

    .container {
        color: #666;
        width: 100%;
        overflow: hidden;
        position: relative;
        height : 80px;
    }
    .container_border {
        border-top: solid 2px #F6f6f6;
    }
    
    .animate .panes, 
    .animate .pane {
        transition: all .3s;
        -webkit-transition: all .3s;
    }

    .groups{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }
    
    .panes{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }
    
    .pane{
        text-align: center;
        width: 100%;
        height: $pane-height;
        text-align: left;
    }

    .pane a{
        display: inline-block;
        font-size: 12px;
        text-align: center;
        width: 25%;
        text-decoration none;
        padding-top: 5px;
        overflow: hidden;
    }

    .pane a .iconfont{
        width $icon-width
        height $icon-width
        display block
        font-size $icon-width - 10px
        margin 0 auto
    }

    .icon-arrow-left,
    .icon-arrow-right{
        position: absolute;
        top: $arrow-top;
        color: #CCC;
        font-size 30px;
        z-index: 99
    }
    .icon-arrow-left{
        left: 0;
        animation: arrow-left 2s infinite;
    }
    .icon-arrow-right{
        right: 0;
        animation: arrow-right 2s infinite;
    }

    @keyframes arrow-left
    {
        0% { margin-left: 0 }
        50% { margin-left: 2px }
        100% { margin-left: 0 }
    }

    @keyframes arrow-right
    {
        0% { margin-right: 0 }
        50% { margin-right: 2px; }
        100% { margin-right: 0 }
    }
</style>

<template>
    <div class="container container_border">
        <div class="groups">
            <div class="panes" v-for="pgs in groups" v-if="groups">
                <div class="pane" v-for="items in pgs" v-if="pgs">
                    <a href="{{item.url}}" class="slip-item" v-for="item in items">
                        <span class="iconfont {{item.icon}} w3-text-theme"></span>
                        {{item.name}}
                    </a>
                </div>
            </div>
        </div>
        <span v-if="current > 0" 
            class="iconfont icon-arrow-left"></span>
        <span v-if="current < groups.length - 1" 
            class="iconfont icon-arrow-right"></span>
    </div>
</template>

<script>
import Promise from 'promise'
import Hammer from '../lib/hammer'
import HammerCarousel from '../lib/hammer-carousel'
import { addClass, removeClass } from '../lib/util'

var vmData = {}, carousel, carouselIndex = 0, len, timer;

function renderCarousel(len, time){
    var vm = this;

    if(!len) return;

    if(time){
        timer = setInterval(function(){
            if(carouselIndex < len - 1){
                carouselIndex += 1;
            }else{
                carouselIndex = 0;
            };
            
            vm.current = carouselIndex;
            carousel.show(carouselIndex, 0, true);
        }, time);
    };
    
    carousel = new HammerCarousel(
        this.$el.querySelector('.groups'), 
        Hammer.DIRECTION_HORIZONTAL,
        {
            onPan: function(index){
                index = Math.max(0, Math.min(index, vm.groups.length - 1));
                carouselIndex = index;
                vm.current = index;
            }
        }
    );
};

// 把一个数组分成多个子数组
function arraySplit(array, size){
    var rst = [];
    array.forEach(function(n,i){
        if(!i || !(i%size)){
            rst.push([]);
        };
        var last = rst[rst.length-1];
        last.push(n);
    });
    return rst;
}

export default {
    props: ['time'],
    data: function(){
        return {
            pages: [],
            groups: [],
            current: 0,
        };
    },
    methods: {
        load: function(data){
            var vm = this;
            
            var pages = arraySplit(data, 4);
            pages.forEach(function(items){
                items.forEach(function(item){
                    item.icon = item.icon || 'icon-42';
                });
            });
            vm.pages = pages;
            vm.groups = arraySplit(pages, 1);

            //
            //if(pages.length > 1){
            //   removeClass('.container', 'pane-height');
            //    addClass('.container', 'pane-2height');
            //}else{
                removeClass('.container', 'pane-2height');
                addClass('.container', 'pane-height');
            //};

            // 等待dom更新
            this.$nextTick(function () {
                renderCarousel.call(vm, vm.groups.length, vm.time);
            });
        }
    },
    ready: function(){
        var vm = this;

        var list = [
            new Promise(function(resolve){
                vm.$on('register-hot-data', resolve)
            }),
            new Promise(function(resolve){
                vm.$on('page-show', resolve);
            })
        ];
        
        Promise.all(list).then(function(results){
            vm.load(results[0]);
            vm.$on('register-hot-data', function(data){
                vm.load(data);
            });
        });
    }
};
</script>