<style lang="stylus" scoped>

.wx-grid
    font-size: 12px;

    th.active 
        color: #fff;

    th.active .arrow 
        opacity: 1;
    
    .arrow 
        display: inline-block;
        vertical-align: middle;
        width: 0;
        height: 0;
        margin-left: 5px;
        opacity: 0.66;
    
    .arrow.asc 
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 4px solid #fff;
    
    .arrow.dsc 
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid #fff;
    
    
        margin-bottom: 10px;
    
    .filters

        border 1px solid #DDD
        border-bottom none
        padding 0 1em

        .filter
            margin 10px 10px 10px 2px
            display: inline-block

            input[type=text]
                border: 1px solid #CCC
                outline none
                padding 0 5px
                width: 6em
                border-radius: 3px

            select
                border-radius: 3px
                border: 1px solid #CCC
                min-width: 1em
                max-width: 80%;

    .w3-pagination
        border-bottom: 1px solid #DDD
        width 100%
    
    .table-wrap{
        overflow-x: auto;
    }

    .w3-table{
        border-right 1px solid #DDD
        border-top 1px solid #DDD
    }
    
    tr{
        th,
        td{
            border-left 1px solid #DDD
        }
        th{
            font-weight bold
        }
        td{
            font-weight normal
        }
    }
</style>

<template>
    <div class="w3-responsive wx-grid" :class="cls">
        <!--过滤条件-->
        <div class="filters" v-if="filters">
            <span v-for="(key, filter) in filters" class="filter">
                {{filter.label || key}}:
                <input type="text" 
                    v-model="postData[key]"
                    v-if="filter.type === 'text'" 
                    value="{{filter.value||''}}" />
                    
                <select v-if="filter.type === 'select'" v-model="postData[key]">
                    <option 
                        v-for="item in (filter.data || [])" 
                        :value="itemValue(item, filter.textField)"
                    >
                        {{ itemValue(item, filter.textField) || '请选择'}}
                    </option>
                </select>
            </span>
        </div>

        <!--列表-->
        <div class="table-wrap">
            <table class="w3-table w3-bordered w3-striped  w3-tiny">
                <thead>
                    <tr :class="headCls || 'w3-theme-l1'">
                        <th v-for="(index, col) in columns" @click="sortBy(col.key)" :class="{active: sortKey == col.key}">
                            {{(col.label || col.key) | capitalize}}
                            <span class="arrow" :class="sortOrders[col.key] > 0 ? 'asc' : 'dsc'"></span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <!--loading-->
                    <tr v-if="status === 'loading'">
                        <td :colspan="columns.length" align="center">加载中...</td>
                    </tr>
                    <!--nodata-->
                    <tr v-if="status === 'finish' && !data.length">
                        <td :colspan="columns.length" align="center">没有数据</td>
                    </tr>
                    <!--finish-->
                    <tr v-if="status === 'finish'" v-for="
                        row in data
                        | filterBy filterKey
                        | orderBy sortKey sortOrders[sortKey]">
                        <td v-for="(index, col) in columns">
                            {{{fieldRender(row[col.key], row, col)}}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--分页-->
        <ul class="w3-pagination" v-if="page > 1 || page < pageCount">
            <li v-if="page > 1" @click="go(page-1)" class="w3-left">
                <a href="javascript:;">&#10094; 上一页</a>
            </li>
            <li v-if="page < pageCount"  @click="go(page+1)" class="w3-right">
                <a href="javascript:;">下一页 &#10095;</a>
            </li>
        </ul>
    </div>
</template>

<script>
    import ajax from '../lib/xhr'
    
    export default {
        props: {
            cls: {
                type: String,
                default: ''
            },
            filters: {
                type: Object,
                default: function(){
                    return {};
                }
            },
            autoLoad: Boolean,
            columns: Array,
            filterKey: {
                type: String,
                default: ''
            },
            url: String,
            postData: {
                type: Object,
                default: function(){
                    return {};
                }
            },
            adapter: {
                'default': function(){
                    return function(json){
                        this.pageCount = json.totalPage;
                        return json.data;
                    }
                }
            },
            page: {
                type: Number,
                default: 1
            },
            pageField: {
                type: String,
                default: 'curPage'
            },
            pageSizeField: {
                type: String,
                default: 'pageSize'
            },
            pageSize: {
                type: Number,
                default: 10
            },
            headCls: String
        },
        data: function () {
            var sortOrders = {}
            this.columns.forEach(function (col) {
                if(typeof col === 'string'){
                    col = { key: col };
                };
                sortOrders[col.key] = 1
            })
            return {
                sortKey: '',
                sortOrders: sortOrders,
                data: [],
                status: 'loading',
                pageCount: 1
            }
        },
        methods: {
            sortBy: function (key) {
                this.sortKey = key
                this.sortOrders[key] = this.sortOrders[key] * -1
            },
            reload: function(data){
                var postData = Object.assign({}, this.postData);
                postData[this.pageField] = this.page;
                
                if(data){
                    this.data = data;
                    this.status = 'finish';
                }else if(this.url){
                    ajax({
                        url: this.url,
                        data: postData,
                        type: 'post'
                    }).then(function(data){
                        this.status = 'finish';
                        if(typeof this.adapter === 'function'){
                            data = this.adapter.call(this, data);
                        };
                        this.data = data;
                    }.bind(this)).catch(function(err){
                        console.info(err);
                    });
                }else{
                    this.status = 'finish';
                };
            },
            query: function(){
                if(this.page == 1){
                    this.reload();
                }else{
                    this.page = 1;
                };
            },
            go: function(page){
                this.page = page;
            },
            fieldRender: function(val, row, col){
                if(typeof col.formatter === 'function'){
                    val = col.formatter(row);
                };
                return val;
            },
            itemValue: function(item, textField){
                return typeof item === 'object' ? item[textField || 'text'] : item;
            }
        },
        created: function(){
            var vm = this;
            // filters数据格式化
            formatFilters(this.filters);

            // 分页参数
            this.postData[this.pageField] = 1;
            this.postData[this.pageSizeField] = this.pageSize;
            // 监控页号
            this.$watch('page', function(){
                this.reload();
            });
            // 监控过滤条件
            this.$watch('postData', function(newVal){
                this.query();
            }, { deep: true });
            this.$watch('filters', function(filters){
                setTimeout(function(){
                    filters && Object.keys(filters).forEach(function(key){
                        var items = clear(filters[key]).data;
                        if(!Array.isArray(items) || !items.length) return;
                        if(typeof this.postData[key] === 'undefined' || !inArray(this.postData[key], items)){
                            this.$set('postData.' + key, items[0]);
                        };
                    }.bind(this));
                }.bind(this), 1);
            }, { deep: true });
            // 加载数据
            if(this.autoLoad !== false){
                this.reload();
            };
        }
    };

    function inArray(val, items){
        var find = false;
        if(typeof val === 'undefined' || val === null){
            return false;
        };
        (items || []).forEach(function(n){
            if(val == n){
                find = true;
            };
        });
        return find;
    };

    // filters format
    function formatFilters(filters){
        for(var key in filters) if(filters.hasOwnProperty(key)){
            var filter = filters[key];
            var data = [];
            filter.type = filter.type || 'text';
            //
            if(filter.type === 'select' && Array.isArray(filter.data)){
                (filter.data || []).forEach(function(n){
                    if(typeof n === 'string'){
                        n = { key: n, text: n };
                    };
                    data.push(n);
                });
                filter.data = data;
            };
        };
    }

    function clear(obj){
        return JSON.parse(JSON.stringify(obj));
    }
</script>