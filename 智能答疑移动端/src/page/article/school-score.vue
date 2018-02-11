<style lang="stylus" scoped>
    .school-info-panel
        margin 0 10px 40px 10px
        padding 10px

        .school-info-title
            padding 1em
            font-weight: bold
</style>

<template>
<div>
    <a href="#enroll-plan" id="enroll-plan"></a>
    <div class="school-info-panel w3-card-4">
        <grid1 v-ref:grid1></grid1>
    </div>
    <button class="w3-btn-block w3-left-align w3-theme-l1 school-info-title">
        学校录取分差纵向走势
    </button>

    <line-chart v-if="lineChartOptions" :options="lineChartOptions"></line-chart>
</div>
</template>

<script>
    import { query } from '../../lib/util.js'
    import ajax from '../../lib/xhr'
    import Vue from 'vue'
    import Grid from '../../component/grid.vue'
    import qs from '../../lib/querystring'
    import LineChart from '../../component/line-chart.vue'

    var scode = qs('scode');
    var vm;
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
        }
    };

    var columns = [
        { key: 'year', label: '年度' },
        { key: 'scoreLine', label: '省线' ,formatter:function(row){
          return row.score?row.score : '-';
        }},
        { key: 'enrollPlan', label: '计划招生' ,formatter:function(row){
          return row.enrollPlan && parseInt(row.enrollPlan) != 0 ?row.enrollPlan : '-';
        }},
        { key: 'enrollNum', label: '实际录取',formatter:function(row){
          return row.enrollNum?row.enrollNum : '-';
        } },
        { key: 'hightScore', label: '最高分' ,formatter:function(row){
          return parseInt(row.hightScore)
        } },
        { key: 'lowScore', label: '最低分' ,formatter:function(row){
          var min = row.lowScore ? row.lowScore : row.minScore;
          return min?parseInt(min) : '-';
        }},
        { key: 'lowScorePoor', label: '最低分分差' ,formatter:function(row){
          var min = row.lowScore ? row.lowScore : row.minScore;
          return (min != null && row.score != null ? (parseInt(min - row.score)) : '-');
        }},
        { key: 'avgScore', label: '平均分' ,formatter:function(row){
          return row.avgScore?parseInt(row.avgScore) : '-' 
        } },
        { key: 'avgScorePoor', label: '平均分分差',formatter: function(row){
            return row.avgScore != null && row.score != null ? (parseInt(row.avgScore - row.score)) : '-'
        } },
    ];
    var pageField = 'curPage',
        pageSizeField = 'pageSize';
    var now = new Date();
    // 7月前默认查询去年数据，7月后默认查询今年数据
    var lastYear = now.getMonth() >= 6 ? now.getFullYear() : (now.getFullYear() - 1);
    
    var defaultsPostData = {
            sCode: scode
        };

    var nameMap = function(n){
        return n.name;
    };

    var adapter = {
        'default': function(){
            return function(json){
                this.pageCount = 1;
                vm.updateLineChart(json);
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
                'default': '/agent/findSchoolEnrollList'
            },
            postData: {
                type: Object,
                'default': function(){
                    return defaultsPostData
                }
            },
            adapter: adapter
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
                lineChartOptions: null
            };
        },
        components: {
            'grid1': Grid1,
            'line-chart': LineChart
        },
        created: function(){
            vm = this;
        },
        methods: {
            updateLineChart: function(data){
                data = data || [];
                this.lineChartOptions = {
                    title: {
                        text: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['最低分分差','平均分分差']
                    },
                    xAxis: {
                        data: data.map(function(n){
                            return n.year;
                        })
                    },
                    yAxis: {},
                    series: [{
                        name: '最低分分差',
                        type: 'line',
                        data: data.map(function(n){
                            var min = n.lowScore ? n.lowScore : n.minScore;
                            return min?parseInt(min-n.score):0;
                        })
                    },{
                        name: '平均分分差',
                        type: 'line',
                        data: data.map(function(n){
                            var min = n.lowScore ? n.lowScore : n.minScore;
                            return n.avgScore != null && n.score != null ? (parseInt(n.avgScore - n.score)):0;
                        })
                    }]
                };
            },
            initFilters: function(uid, city){
                var vm = this;
                var url = '/agent/schoolEnroll?scode=' + scode;
                var params = {};
                if(typeof uid === 'number'){
                    params.userId = uid;
                };
                if(city){
                    params.city = city; 
                };
                ajax({ url: url, type: 'post', data: params }).then(function(data){
                    // 默认值
                    data = Object.assign({
                        batchList: [],
                        cityList: [],
                        scienceList: [],
                        typeList: []
                    }, data);
                    // 
                    data.cityList = data.cityList.map(nameMap);
                    data.cityList.unshift('');
                    //
                    var defaults = data['default'] || {};
                    var grid1 = vm.$refs.grid1;
                    if(!city){
                        if(defaults.city){
                            grid1.$set('postData.cityName', defaults.city);
                        }else{
                            grid1.$set('postData.cityName', data.cityList[1]);
                        };
                    }
                    if(defaults.science){
                         grid1.$set('postData.scienceClass', defaults.science);
                    };
                    if(defaults.type){
                         grid1.$set('postData.type', defaults.type);
                    };
                    if(defaults.batch){
                         grid1.$set('postData.batch', defaults.batch);
                    };
                    //
                    setFiltersData(filters, {
                        cityName: data.cityList,
                        scienceClass: data.scienceList || ['理科','文科'],
                        type: data.typeList,
                        batch: data.batchList
                    });
                    //
                    if(!grid1.watched){
                        grid1.$watch('postData.cityName', function(city){
                            vm.initFilters(uid, city);
                        });
                        grid1.watched = true;
                    };
                }).catch(function(e){
                    console.info(e);
                });
            }
        },
        events: {
            'school_user_info': function(e){
                this.initFilters(e.uid);
            }
        },
        ready: function(){
        }
    };
</script>