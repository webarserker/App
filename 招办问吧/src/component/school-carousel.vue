<style lang="stylus" scoped>
	$dotted-width = 8px

    .container {
        margin: 0 auto;
        position relative
    }

    .panes.wrapper {
        background: #F9F9F9;
    }

    .panes {
        width: 100%;
        height: 150px;
        overflow: hidden;
        position: relative;
    }
    
    .animate .pane {
        transition: all .3s;
        -webkit-transition: all .3s;
    }

    .pane {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        text-align: center;
        color: #fff;
    }

    .panes.animate > .pane {
        transition: all .3s;
        -webkit-transition: all .3s;
    }
    
    .pane .panes{
		background-size 100% auto;
		background-repeat no-repeat;
		background-position 50% 50%;
    }
    
    .dotteds{
    	position absolute;
    	bottom 0;
    	right 5px;
    	z-index 9
    }
    .dotted{
    	display inline-block
    	margin 0
    }
    .dotted:before{
        text-shadow: 0 0 1px #fff;
    }
    .dotted.active{
    }
    .ad-title{
        font-size 15px;
        position absolute;
        left 10px;
        bottom 10px;
    }
</style>

<template>
	<div class="container">
	    <div class="panes wrapper">
	        <div class="pane" v-for="item in data">
	            <div class="panes" v-bind:style="itemStyle(item)" @click="item.onclick || null">
                    <div class="ad-title" v-if="item.title">{{item.title}}</div>
	            </div>
	        </div>
	    </div>
        <div class="dotteds">
        	<span class="dotted iconfont icon-dot {{index == itemIndex ? 'active w3-text-theme' : ''}}" 
                v-for="(itemIndex, item) in data"></span>
        </div>
	</div>
</template>

<script>
    import Promise from 'promise'
	import Hammer from '../lib/hammer'
	import HammerCarousel from '../lib/hammer-carousel'

	var vmData = {
		index: 0
	}, carousel, carouselIndex = 0, timer, resume = false;

    function renderCarousel(len, time){
        var vm = this;
        if(!len) return;
        
        carouselIndex = 0;
        clearInterval(timer);

        timer = setInterval(function(){
            if(resume) return;
            if(carouselIndex < len - 1){
                carouselIndex += 1;
            }else{
                carouselIndex = 0;
            };
            
            carousel.show(carouselIndex, 0, true);
			vmData.index = carouselIndex;
        }, time);
        
        carousel = new HammerCarousel(
            this.$el.querySelector(".panes.wrapper"), 
            Hammer.DIRECTION_HORIZONTAL,
            {
                onPan: function(index){
                    
                    index = Math.max(0, Math.min(index, vm.data.length - 1));

                	carouselIndex = index;
					vmData.index = index;
                    //
                    resume = true;
                    setTimeout(function(){
                        resume = false;
                    }, time);
                }
            }
        );
    };

	export default {
		props: ['data', 'time'],
		data: function(){
			return vmData
		},
		methods: {
			itemStyle: function(item){
				var style = '';
				if(item.image) style += 'background-image: url(' + item.image + ');';
				if(item.bgcolor) style += 'background-color: ' + item.bgcolor + ';';
				return style;
			},
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