<style lang="stylus" scoped>
    .item
        margin-top 2em
        
    .item-content
        padding-left 2em
</style>

<template>
    <div class="w3-container">
        <div class="item" v-for="(key, name) in columns">
            <b class="item-title">{{name}}：</b>
            <p class="item-content">{{{data[key] || '暂无' | unescape}}}</p>
        </div>
    </div>
</template>

<script>
    import ajax from '../../lib/xhr'
    import qs from '../../lib/querystring'

    var id = qs('id');
    var columns = {
        'name': '专业名称',
        'departName': '所属院系',
        'schoolYear': '学制',
        'degree': '授予学位',
        'tuitionStandard': '学费标准',
        'feature': '专业特色',
        'target': '培养目标',
        'mainClass': '核心课程',
        'workInfo': '就业历史'
    };

    export default {
        data: function(){
            return {
                data: {},
                columns: columns
            };
        },
        ready: function(){
            var self = this;
            ajax('/agent/majorDetail?majorId=' + id).then(function(data){
                self.data = data;
            });
        }
    }
</script>