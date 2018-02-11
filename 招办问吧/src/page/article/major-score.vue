<style lang="stylus" scoped>
    .school-info-panel
        margin 0 10px 40px 10px
        padding 10px

        .school-info-title
            padding 1em
            font-weight: bold
</style>

<template>
    <a href="#major-plan" id="major-plan"></a>
    <div class="school-info-panel w3-card-4">
        <button class="w3-btn-block w3-left-align w3-theme-l1 school-info-title">
            各年度分专业录取情况
        </button>
        <grid2 v-ref:grid2 :auto-load="false"></grid2>
        <button class="w3-btn-block w3-left-align w3-theme-l1 school-info-title">
             多个专业横向向走势图
        </button>
        <line-chart v-if="lineChartOptions2" :options="lineChartOptions2"></line-chart>
    </div>


    <a href="#enroll-plan" id="enroll-plan"></a>
    <div class="school-info-panel w3-card-4">
        <button class="w3-btn-block w3-left-align w3-theme-l1 school-info-title">
            单个专业不同年度录取情况
        </button>
        <grid1 v-ref:grid1 :auto-load="false"></grid1>
        <button class="w3-btn-block w3-left-align w3-theme-l1 school-info-title">
            单个专业录取纵向走势图
        </button>
        <line-chart v-if="lineChartOptions1" :options="lineChartOptions1"></line-chart>
    </div>

</template>

<script>
    import $ from 'zeptor'
    import ajax from '../../lib/xhr'
    import Vue from 'vue'
    import Grid from '../../component/grid.vue'
    import querystring from '../../lib/querystring'
    import LineChart from '../../component/line-chart.vue'

    var vm;

    var scode = querystring('scode');
    var major = querystring('major');
    var filters = {
        cityName: {
            label: '生源地',
            type: 'select',
            data: []
        },
        scienceClass: {
            label: '科类',
            type: 'select',
            data: []
        },
        type: {
            label: '招录类型',
            type: 'select',
            data: []
        },
        batch: {
            label: '批次',
            type: 'select',
            data: []
        },
        majorName: {
            label: '专业',
            type: 'select',
            data: []
        }
    };

     var filters2 = {
        cityName: {
            label: '生源地',
            type: 'select',
            data: []
        },
        year: {
            label: '年度',
            type: 'select',
            data: []
        },
        scienceClass: {
            label: '科类',
            type: 'select',
            data: []
        },
        type: {
            label: '招录类型',
            type: 'select',
            data: []
        },
        batch: {
            label: '批次',
            type: 'select',
            data: []
        },
        
    };

    var columns = [
        { key :'majorName',label:'专业'},
        { key: 'year', label: '年度' },
        { key: 'scoreLine', label: '省线' ,formatter:function(row){
          return row.scoreLine ? row.scoreLine : '-' ;
        }},
        { key: 'enrollPlan', label: '计划招生' ,formatter:function(row){
          return row.enrollPlan && parseInt(row.enrollPlan) != 0 ? row.enrollPlan : '-' ;
        }},
        { key: 'enrollNum', label: '实际录取',formatter:function(row){
          return row.enrollNum ? row.enrollNum : '-';
        } },
        { key: 'hightScore', label: '最高分' ,formatter:function(row){
          return parseInt(row.hightScore)
        } },
        { key: 'lowScore', label: '最低分' ,formatter:function(row){
          return parseInt(row.lowScore);
        }},
        { key: 'avgScore', label: '平均分' ,formatter:function(row){
          return parseInt(row.avgScore) 
        } },
        { key: 'avgScorePoor', label: '平均分分差',formatter: function(row){
            return (row.avgScore == null || row.scoreLine == null) ? '-' : parseInt(row.avgScore - row.scoreLine)
        } },
    ];
    var pageField = 'curPage',
        pageSizeField = 'pageSize';
    var now = new Date();
    // 7月前默认查询去年数据，7月后默认查询今年数据
    var lastYear = now.getMonth() >= 6 ? now.getFullYear() : (now.getFullYear() - 1);
    var defaultsPostData1 = {
            sCode: scode,
            majorName: major,
            year: lastYear
        }, 
        defaultsPostData2 = {
            sCode: scode,
            year: lastYear
        };
        
    var adapter = {
        'default': function(){
            return function(json){
                this.pageCount = 1;
                return json;
            }
        }
    };
    var adapter2 = {
        'default': function(){
            return function(json){
                this.pageCount = 1;
                return json;
            }
        }
    };

    var Grid1 = Object.assign({}, Grid, {
        props: Object.assign({}, Grid.props, {
            filters: {
                type: Object,
                'default': function(){
                    return filters;
                }
            },
            columns: {
                type: Array,
                'default': function(){
                    return columns
                }
            },
            url: {
                type: String,
                'default': '/agent/findMajorScoreList'
            },
            postData: {
                type: Object,
                'default': function(){
                    return defaultsPostData1;
                }
            },
            adapter: adapter
        })
    });

   

    var Grid2 = Object.assign({}, Grid, {
        props: Object.assign({}, Grid.props, {
            filters: {
                type: Object,
                'default': function(){
                    return filters2;
                }
            },
            columns: {
                type: Array,
                'default': function(){
                    return columns
                }
            },
            url: {
                type: String,
                'default': '/agent/findMajorScoreCompareList'
            },
            postData: {
                type: Object,
                'default': function(){
                    return defaultsPostData2;
                }
            },
            adapter: adapter2
        })
    });

    function setFiltersData(filters, data){
        for(var n in data) if(data.hasOwnProperty(n) && filters[n]){
            filters[n].data = data[n];
        };
    };

    export default {
        data: function (){
            return {
                lineChartOptions1: null,
                lineChartOptions2: null
            };
        },
        components: {
            'grid1': Grid1,
            'grid2': Grid2,
            'line-chart': LineChart
        },
        events: {
            'school_user_info': function(e){
                this.initFilters(e.uid);
            }
        },
        methods: {
            initFilters: function(uid, city, year){
                var url = '/agent/majorScore?scode=' + scode;
                var params = {};
                if(typeof uid === 'number'){
                    params.userId = uid;
                };
                if(city){
                    params.city = city; 
                };
                if(year){
                    params.year = year; 
                };
                ajax({ url: url, type: 'post', data: params }).then(function(data){
                    // 默认值
                    data = Object.assign({
                        yearList: [],
                        batchList: [],
                        cityList: [],
                        majorList: [],
                        scienceList: [],
                        typeList: []
                    }, data);
                    // 
                    data.cityList = data.cityList.map(nameMap);
                    data.cityList.unshift('');
                    data.yearList.unshift('');
                    // 
                    var defaults = data['default'] || {};
                    var grid1 = vm.$refs.grid1;
                    var grid2 = vm.$refs.grid2;
                    if(defaults.city){
                         grid1.$set('postData.cityName', defaults.city);
                         grid2.$set('postData.cityName', defaults.city);
                    }else{
                         grid1.$set('postData.cityName', data.cityList[1]);
                         grid2.$set('postData.cityName', data.cityList[1]);
                    };
                    if(defaults.science){
                         grid1.$set('postData.scienceClass', defaults.science);
                         grid2.$set('postData.scienceClass', defaults.science);
                    };
                    if(defaults.type){
                         grid1.$set('postData.type', defaults.type);
                         grid2.$set('postData.type', defaults.type);
                    };
                    if(defaults.batch){
                         grid1.$set('postData.batch', defaults.batch);
                         grid2.$set('postData.batch', defaults.batch);
                    };
                    //
                    setFiltersData(filters, {
                        cityName: data.cityList,
                        scienceClass: data.scienceList || ['理科','文科'],
                        type: data.typeList,
                        batch: data.batchList,
                        majorName: data.majorList,
                    });
                    setFiltersData(filters2, {
                        year: data.yearList,
                        cityName: data.cityList,
                        scienceClass: data.scienceList || ['理科','文科'],
                        type: data.typeList,
                        batch: data.batchList,
                    });
                }).catch(function(e){
                    console.info(e);
                });
            },
            updateLineChart: function(index, data){
                data = data || [];
                var type = index == 1 ? 'line' : 'bar';
                this['lineChartOptions' + index] = {
                    dataZoom: index == 1 ? null : [
                        {
                            id: 'dataZoomX',
                            type: 'slider',
                            xAxisIndex: [0],
                            filterMode: 'filter'
                        },
                    ],
                    title: {
                        text: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['平均分分差']
                    },
                    xAxis: index == 1 ? {
                            data: data.map(function(n){
                                return n.year;
                            })
                        } : {
                            data: data.map(function(n){
                                return n.majorName;
                            })
                        },
                    yAxis: {},
                    series: [
                        {
                            name: '平均分分差',
                            type: type,
                            data: data.map(function(n){
                                return parseInt(n.avgScore-n.scoreLine);
                            })
                        }
                    ]
                };
            }
        },
        ready: function(){
            vm = this;
            vm.$refs.grid1.$watch('data', function(json){
                json = JSON.parse(JSON.stringify(json));
                vm.updateLineChart(1, json);
            });
            vm.$refs.grid2.$watch('data', function(json){
                json = JSON.parse(JSON.stringify(json));
                vm.updateLineChart(2, json);
            });
            // vm.$refs.grid1.$watch('postData', function(){

            // });
        }
    };

    var nameMap = function(n){
        return n.name;
    };
</script>