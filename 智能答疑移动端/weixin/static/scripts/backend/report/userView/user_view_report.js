var userViewReport = {

    chart : null,  //迁徙图
    barChart : null, //柱状图
    chartUrl : '/userViewReport/getReportStats',
    sourceData : [],
    series : [],
    barSeriesData : [],
    schoolProvinceName : '',
    planePath : 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
    color : '#a6c84c',
    totalNum : 0,

    init : function(){
        userViewReport.loadChartDetail();
        userViewReport.loadBarChartDetail();
    },

    loadChartDetail : function () {
        if(userViewReport.chart) {
            echarts.dispose(userViewReport.chart);
        }
        userViewReport.chart = echarts.init($('#userViewChart')[0]);
        window.onresize = userViewReport.chart.resize;
        // 过渡---------------------
        userViewReport.chart.showLoading({
            text : '正在努力的读取数据中...', // loading话术
            effect : 'whirling'
        });
        // 调用图表请求
        var params = {};
        params['startDate'] = $("#startDate").val();
        params['endDate'] = $("#endDate").val();
        $.ajax({
            type : 'POST',
            url : userViewReport.chartUrl,
            data : params,
            dataType : 'json',
            success : function(data){
                if(data && data.length > 0){
                    //加载图表
                    //构建折线图series
                    userViewReport.buildSourceData(data);
                    userViewReport.buildSeries();
                    userViewReport.loadChart(userViewReport.chart);

                }else{
                    userViewReport.chart.showLoading({
                        text : '暂无数据',
                        effect : 'bubble',
                        textStyle : {
                            fontSize : 30
                        }
                    });
                }
            }
            }
        );
    },

    buildSourceData : function(data){
        userViewReport.sourceData = [];
        userViewReport.totalNum = 0;
        userViewReport.schoolProvinceName = data[0].schoolProvinceName;
        $.each(data, function (index, obj) {
            var dataItem = [];
            if(obj.viewProvinceName != '' && $.inArray(obj.viewProvinceName, coordinate.provinceList) != -1){
                var sourceParams = {};
                sourceParams['name'] = obj.schoolProvinceName;
                var userViewParams = {};
                userViewParams['name'] = obj.viewProvinceName;
                userViewParams['value'] = obj.viewNum;
                dataItem.push(sourceParams);
                dataItem.push(userViewParams);
                userViewReport.sourceData.push(dataItem);
                userViewReport.totalNum += obj.viewNum;
            }
        })
    },

    buildSeries : function () {
        userViewReport.series = [];
        userViewReport.series.push({
                name: userViewReport.schoolProvinceName ,
                type: 'lines',
                zlevel: 1,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.7,
                    color: '#fff',
                    symbolSize: 3
                },
                lineStyle: {
                    normal: {
                        color: userViewReport.color,
                        width: 0,
                        curveness: 0.2
                    }
                },
                data: userViewReport.convertData(userViewReport.sourceData)
            },
            {
                name: userViewReport.schoolProvinceName,
                type: 'lines',
                zlevel: 2,
                symbol: ['none', 'arrow'],
                symbolSize: 10,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0,
                    symbol: userViewReport.planePath,
                    symbolSize: 15
                },
                lineStyle: {
                    normal: {
                        color: userViewReport.color,
                        width: 1,
                        opacity: 0.6,
                        curveness: 0.2
                    }
                },
                data: userViewReport.convertData(userViewReport.sourceData)
            },
            {
                name: userViewReport.schoolProvinceName,
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                symbolSize: function (val) {
                    if(val[2] < 400){
                        return Math.sqrt(val[2]);
                    }else{
                        return 20;
                    }
                },
                itemStyle: {
                    normal: {
                        color: userViewReport.color
                    }
                },
                data: userViewReport.sourceData.map(function (dataItem) {
                    if(coordinate.province[dataItem[1].name]) {
                        return {
                            name: dataItem[1].name,
                            value: coordinate.province[dataItem[1].name].concat([dataItem[1].value])
                        };
                    }
                })
            });
    },

    loadChart : function (chart) {
        chart.hideLoading();
        var option = {
            backgroundColor: '#404a59',
            title : {
                text: '用户访问统计图（' + userViewReport.totalNum +  '次）',
                subtext: '',
                left: 'center',
                textStyle : {
                    color: '#fff'
                }
            },
            tooltip : {
                trigger: 'item',
                formatter: function(params, ticket, callback){
                    console.log(params);
                    return params.data.toName + '<br>' + params.data.fromName + ': ' + params.data.coords[2] + '次'
                }
            },
            legend: {
                orient: 'vertical',
                top: 'bottom',
                left: 'right',
                data:[userViewReport.schoolProvinceName],
                textStyle: {
                    color: '#fff'
                },
                selectedMode: 'single'
            },
            geo: {
                map: 'china',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#323c48',
                        borderColor: '#404a59'
                    },
                    emphasis: {
                        areaColor: '#2a333d'
                    }
                }
            },
            //backgroundColor:'grey',
            series: userViewReport.series
        };
        chart.setOption(option);
        /*$("#userViewChart").resize(function(){
            $(chart).resize({width:window.innerWidth, height:window.innerHeight});
        })*/
    },

    convertData : function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = coordinate.province[dataItem[1].name];
            var toCoord = coordinate.province[dataItem[0].name];
            if (fromCoord && toCoord) {
                res.push({
                    fromName: dataItem[1].name,
                    toName: dataItem[0].name,
                    coords: [fromCoord, toCoord, dataItem[1].value]
                });
            }
        }
        return res;
    },

    loadBarChartDetail : function () {
        if(userViewReport.barChart) {
            echarts.dispose(userViewReport.barChart);
        }
        userViewReport.barChart = echarts.init($('#userViewBarChart')[0]);
        window.onresize = userViewReport.barChart.resize;
        // 过渡---------------------
        userViewReport.barChart.showLoading({
            text : '正在努力的读取数据中...', // loading话术
            effect : 'whirling'
        });
        // 调用图表请求
        var params = {};
        params['startDate'] = $("#startDate").val();
        params['endDate'] = $("#endDate").val();
        $.ajax({
                type : 'POST',
                url : userViewReport.chartUrl,
                data : params,
                dataType : 'json',
                success : function(data){
                    if(data && data.length > 0){
                        //加载图表
                        userViewReport.loadBarChart(userViewReport.barChart, data);

                    }else{
                        userViewReport.barChart.showLoading({
                            text : '暂无数据',
                            effect : 'bubble',
                            textStyle : {
                                fontSize : 30
                            }
                        });
                    }
                }
            }
        );
    },
    buildBarSeriesData : function(data){
        userViewReport.barSeriesData = [];
        $.each(data, function (index, obj){
            userViewReport.barSeriesData.push(obj.viewNum);
        });
    },

    loadBarChart : function (chart, initData) {
        var data = [];
        $.each(initData, function (index, obj){
            if(obj.viewProvinceName != ''){
                data.push(obj);
            }
        });
        //访问量排序--倒序
        data.sort(function(a,b){
            return b.viewNum-a.viewNum;
        });
        userViewReport.buildBarSeriesData(data);
        chart.hideLoading();
        var legendData = [];
        var yAxisData = [];
        legendData.push(data[0].schoolProvinceName);
        $.each(data, function (index, obj){
            yAxisData.push(obj.viewProvinceName);
        });
        var option = {
            title: {
                text: '用户访问统计',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: legendData
            },
            grid: {
                left: '2%',
                right: '2%',
                bottom: '12%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: yAxisData,
                axisLabel : {
                    rotate: 60,
                    interval: 0
                },
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            series: [{
                name: data[0].schoolProvinceName,
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                data: userViewReport.barSeriesData
            }]
        };
        chart.setOption(option);
    },

}
$(function () {
    //初始化时间控件
    dateParamsUtil.initDatePicker($("#dateRange"), new Date(), userViewReport.init);
    userViewReport.init();
});