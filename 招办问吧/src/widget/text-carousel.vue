<style scoped>
    .container {
        color: #666;
        border-top: 1px solid #EEE;
        border-bottom: 1px solid #EEE;
        background: #F6F6F6;
        width: 100%;
        height: 50px;
        line-height: 50px;
        overflow: hidden;
        position: relative;
    }
 
    .pane {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        text-align: left;
    }

    .pane a{
        display: inline-block;
        margin-left: 1em;
    }

</style>

<template>
    <div class="container">
        <div class="pane" v-for="item in data">
            <a :href="item.href">{{item.text}}</a>
        </div>
    </div>
</template>

<script>
    import Hammer from '../lib/hammer.js'
    import HammerCarousel from '../lib/hammer-carousel.js'
    var vmData = {}, carousel, carouselIndex = 0, len, timer;

    function renderCarousel(data, time){
        if(!data) return;

        len = data.length;

        if(!len) return;
        
        carouselIndex = 0;
        clearInterval(timer);

        timer = setInterval(function(){
            if(carouselIndex < len - 1){
                carouselIndex += 1;
            }else{
                carouselIndex = 0;
            };
            
            carousel.show(carouselIndex, 0, carouselIndex > 0);
        }, time);
        
        carousel = new HammerCarousel(
            this.$el, 
            Hammer.DIRECTION_HORIZONTAL,
            {
                onPan: function(index){
                    carouselIndex = index;
                    console.info(index)
                }
            }
        );
    };

    export default {
        props: ['data', 'time'],
        data: function(){
            return {};
        },
        watch: {
            data: function(newVal){
                renderCarousel.call(this, newVal, this.time || 3000);
            }
        }
    };
</script>