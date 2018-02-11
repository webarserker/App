<style lang="stylus" scoped>
    .school-info-panel
        margin 0 10px 40px 10px
        padding 10px

        .school-info-title
            padding 1em
            font-weight: bold
</style>

<template>

    <a href="#enroll-plan" id="enroll-plan"></a>
    <div class="school-info-panel w3-card-4">
        <button class="w3-btn-block w3-left-align w3-theme-l1 school-info-title">
            学校历年招生计划
        </button>
        <grid1 v-ref:grid1 :auto-load="false"></grid1>
    </div>

    <a href="#major-plan" id="major-plan"></a>
    <div class="school-info-panel w3-card-4">
        <button class="w3-btn-block w3-left-align w3-theme-l1 school-info-title">
            专业历年招生计划
        </button>
        <grid2 v-ref:grid2 :auto-load="false"></grid2>
    </div>

</template>

<script>
    import ajax from '../../lib/xhr'
    import Vue from 'vue'
    import Grid from '../../component/grid.vue'
    import querystring from '../../lib/querystring'
    
    var scode = querystring('scode');
    var vm;
    var filters = {
        year: {
            label: '年度',
            type: 'select',
            data: []
        },
        enrollType: {
            label: '招录类型',
            type: 'select',
            data: []
        },
        cityName: {
            label: '生源地',
            type: 'select',
            data: []
        },
        science: {
            label: '科类',
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
        { key: 'year', label: '年度' },
        { key: 'enrollType', label: '招生类型' },
        { key: 'cityName', label: '生源地' },
        { key: 'science', label: '科类' },
        { key: 'batch', label: '招生批次' },
        { key: 'totalNum', label: '计划招生数' },
    ];
    var columns2 = [
        { key: 'year', label: '年度' },
        { key: 'enrollType', label: '招生类型' },
        { key: 'cityName', label: '生源地' },
        { key: 'science', label: '科类' },
        { key: 'batch', label: '招生批次' },
        { key: 'enrollNum', label: '计划招生数' },
    ];
    var pageField = 'curPage',
        pageSizeField = 'pageSize';
    
    var now = new Date();
    // 7月前默认查询去年数据，7月后默认查询今年数据
    var lastYear = now.getMonth() >= 6 ? now.getFullYear() : (now.getFullYear() - 1);
    var defaultsPostData1 = {
            sCode: scode,
            year: lastYear
        }, 
        defaultsPostData2 = {
            sCode: scode,
            year: lastYear
        };
    var nameMap = function(n){
        return n.name;
    };

    var adapter = {
        'default': function(){
            return function(json){
                this.pageCount = json.totalPage;
                return json.data;
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
                'default': '/agent/findEnrollPlan'
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

    var filters2 = Object.assign({}, filters, {
        majorName: {
            label: '专业',
            type: 'select',
            data: []
        }
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
                    var cols = JSON.parse(JSON.stringify(columns2));
                    cols.splice(4,0,{ key: 'majorName', label: '专业' });
                    return cols;
                }
            },
            url: {
                type: String,
                'default': '/agent/findEnrollPlanDetail'
            },
            postData: {
                type: Object,
                'default': function(){
                    return defaultsPostData2;
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
            return {};
        },
        components: {
            'grid1': Grid1,
            'grid2': Grid2
        },
        events: {
            'school_user_info': function(e){
                this.initFilters(e.uid);
            }
        },
        init: function(){
            vm = this;
        },
        methods: {
            initFilters: function(uid){
                var url = '/agent/enrollPlan?scode=' + scode;
                if(typeof uid === 'number'){
                    url += '&userId=' + uid;
                };
                ajax(url).then(function(data){
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
                         grid1.$set('postData.science', defaults.science);
                         grid2.$set('postData.science', defaults.science);
                    };
                    if(defaults.type){
                         grid1.$set('postData.enrollType', defaults.type);
                         grid2.$set('postData.enrollType', defaults.type);
                    };
                    if(defaults.batch){
                         grid1.$set('postData.batch', defaults.batch);
                         grid2.$set('postData.batch', defaults.batch);
                    };
                    // var cities = [''];
                    // data.cityList.forEach(function(n){
                    //     cities.push(n.name);
                    // });
                    // data.yearList.unshift('');
                    // data.enrollTypeList.unshift('');
                    // data.scienceList.unshift('');
                    // data.batchList.unshift('');
                    // data.majorList.unshift('');
                    setFiltersData(filters, {
                        year: data.yearList,
                        enrollType: data.typeList,
                        cityName: data.cityList,
                        science: data.scienceList || ['理科','文科'],
                        batch: data.batchList,
                    });
                    setFiltersData(filters2, {
                        year: data.yearList,
                        enrollType: data.typeList,
                        cityName: data.cityList,
                        majorName: data.majorList,
                        science: data.scienceList || ['理科','文科'],
                        batch: data.batchList,
                    });
                }).catch(function(e){
                    console.info(e);
                });
            }
        }
    };
</script>