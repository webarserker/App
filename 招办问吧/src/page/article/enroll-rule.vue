<style lang="stylus" scoped>
    .school-info-panel
        margin 0 10px 40px 10px
        padding 10px

        .school-info-title
            padding 1em
            font-weight: bold
</style>

<template>

    <a href="#enroll-rule" id="enroll-rule"></a>
    <div class="school-info-panel w3-card-4">
        <grid></grid>
    </div>
</template>

<script>
    import Grid from '../../component/grid.vue'
    import querystring from '../../lib/querystring'
    
    var scode = querystring('scode');
    
    var columns = [
        { key: 'ruleName', label: '规则分解' },
        { key: 'name', label: '细分项' },
        { key: 'result', label: '本校政策简述' },
        { key: 'remark', label: '说明' }
    ];
    var pageField = 'curPage',
        pageSizeField = 'pageSize';
    
    var postData = {
        type: Object,
        'default': function(){
            return {
                scode: scode
            }
        }
    };
    var adapter = {
        'default': function(){
            return function(json){
                this.pageCount = 1;
                var result = [];
                for(var i=0;i<json.length;i++){
                   var enrollRule=json[i];
                   var enrollRuleItemList=enrollRule.enrollRuleItemList;
                   for(var j=0;j<enrollRuleItemList.length;j++){
                      var e = enrollRuleItemList[j];
                      e['ruleName']=enrollRule.ruleName
                      result.push(e);
                   }
                   
                }
                return result;
            }
        }
    };

    var Grid1 = Object.assign({}, Grid, {
        props: Object.assign({}, Grid.props, {
            filters: {
                type: Object,
                'default': function(){
                    return {};
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
                'default': '/agent/findEnrollRule'
            },
            postData: postData,
            adapter: adapter
        })
    });
    export default {
        data: function (){
            return {};
        },
        components: {
            'grid': Grid1
        },
        ready: function(){
           
        },
    };
</script>