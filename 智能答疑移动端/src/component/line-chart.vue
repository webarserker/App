<style>

</style>

<template>
    <div>
        <div class="chart" style="width: 100%; height: 300px;"></div>
    </div>
</template>

<script>
    import {query, css} from '../lib/util.js';
    // 引入 ECharts 主模块
    var echarts = require('echarts/lib/echarts');
    // 引入柱状图
    require('echarts/lib/chart/line');
    require('echarts/lib/chart/bar');
    // 引入提示框和标题组件
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    require('echarts/lib/component/dataZoom');

    export default {
        props: ['options'],
        data: function(){
            return {
                renderd: false
            };
        },
        methods: {

        },
        created: function(){
            this.$watch('options', function(val){
                if(!val) return;
                if(!this.renderd){
                    // 在echarts初始化之前需手动为容器设置宽度
                    css('.chart', {
                        width: (document.body.clientWidth - 20) + 'px',
                        marginLeft: 'auto',
                        marginRight: 'auto' 
                    });
                    // 
                    this.chart = echarts.init(query('.chart', this.$el));
                    this.renderd = true;
                };

                this.chart.setOption(val);
                
            }, { deep: true });
            //
            if(this.options){
                this.options = JSON.parse(JSON.stringify(this.options));
            };
        }
    }
</script>