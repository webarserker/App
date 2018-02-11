<style lang="stylus" scoped>
    .page-content{
        margin: 1em;
    }
</style>

<template>
    <div class="page-content">
        <link rel="stylesheet" href="css/w3.css" />
        <link rel="stylesheet" href="css/w3-theme-blue.css">

        <!--页面内容-->
        <slot></slot>
        
    </div>
</template>

<script>
import qs from '../lib/querystring.js';
import { query, queryAll, css } from '../lib/util';

// 隐藏loading
function fadeOut(tag, time, callback){

    var second = time/1000;
    
    css(tag, {
        visibility: 'hidden',
        opacity: '0',
        transition: 'visibility 0s ' + second + 
            's, opacity ' + second + 's linear',
    });

    setTimeout(function(){
        css(tag, 'display', 'none');
        callback && callback();
    }, time);
}

//
export default {
    props: [],
    data: function(){
        return {
            
        };
    },
    methods: {
        show: function(){
            var vm = this;
            // 显示白色背景和loading图标至少500毫秒
            // loading图标立即隐藏，显示页面内容
            // 白色背景逐渐淡出（800毫秒）
            setTimeout(function(){
                css('#page-loading .page-loading-icon', 'display', 'none');
                css('#body', 'display', '');
                fadeOut('#page-loading', 800);
                vm.$broadcast('page-show');
            }, 500);
        },
    },
    watch: {
        
    },
    ready: function(){
        this.show();
    },
    components: {
        
    }
}    
</script>