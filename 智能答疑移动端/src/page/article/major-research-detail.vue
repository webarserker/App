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
        'majorName': '专业名称',
        'majorCode': '专业代码',
        'department': '所属院系',
        'mentors': '指导老师',
        'typeStr': '类别',
        'enrollPlanNum': '拟招人数',
        'mainClass': '推免',
        'preTestSubject': '初试科目',
        'reTestSubject': '复试科目',
        'addTestSubject': '加试科目',
        'remark': '备注',
        'summary': '研究方向简介',
        'preTestPlan': '复试方案',
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
            ajax('/agent/getMajorResearchDetail?id=' + id).then(function(data){
                self.data = data;
            });
        }
    }
</script>