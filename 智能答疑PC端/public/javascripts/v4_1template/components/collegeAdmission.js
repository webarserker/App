/**
 * Created by liuyang on 2017/7/28.
 */

var myChart=echarts.init(document.getElementById('lines'));
// myChart.showLoading({
//     text : '正在努力的读取数据中...', // loading话术
//     textColor:'#B7B7B7',
//     maskColor: '#FBFBFB',
//     effect : 'whirling'
// });


option = {
    title: {
        subtext: '学校录取平均分分差走势图'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['最低分分差','平均分分差']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['2016','2015','2014','2013']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name:'最低分分差',
            type:'line',
            data:[90,68,62,55]
        },
        {
            name:'平均分分差',
            type:'line',
            data:[95,74,71,64]
        }
    ]
};

myChart.setOption(option);