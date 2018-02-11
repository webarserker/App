
<script>
    import Vue from 'vue'
    import Grid from '../../component/grid.vue'
    import querystring from '../../lib/querystring'
    import ajax from '../../lib/xhr'
    
    var scode = querystring('scode');
    
    function appendQuery(url) {
        var query = '&scode=' + scode;
        return (url + query).replace(/[&?]{1,2}/, '?')
    };

    var Grid1 = Object.assign({}, Grid, {
        props: Object.assign({}, Grid.props, {
            cls: {
                default: function(){
                    return 'w3-card-4 w3-margin w3-padding';
                }
            },
            filters: {
                'default': function(){
                    return {
                        name: {
                            label: '专业名称'
                        }
                    };
                }
            },
            /**
            序号								
             */

            columns: {
                'default': function(){
                    return [
                        { key: 'name', label: '专业名称' },
                        { key: 'departName', label: '所属院系' },
                        { key: 'schoolYear', label: '学制' },
                        { key: 'degree', label: '授予学位' },
                        { key: 'tuitionStandard', label: '学费标准' },
                        { key: 'showDetail', label: '专业详解', formatter: function(row){
                            return '<a href="' + appendQuery('article.html?sub=major-detail&id=' + row.id) + '">详情</a>';
                        } },
                        { key: 'showEntroll', label: '招生计划', formatter: function(row){
                            return '<a href="' + appendQuery('article.html?sub=major-plan&major=' + row.name) + '">详情</a>';
                        } },
                        { key: 'showEntrollHistory', label: '历史录取', formatter: function(row){
                            return '<a href="' + appendQuery('article.html?sub=11&major=' + row.name) + '">详情</a>';
                        } },
                    ]
                }
            },
            url: {
                'default': '/agent/getMajorList'
            },
            postData: {
                'default': function(){
                    return {
                        sCode: scode
                    }
                }
            }
        }),
        ready: function(){
            var vm = this;
            // 通过数据控制列的隐藏
            ajax('/agent/getMajorConf?scode=' + scode).then(function(json){
                var cols = [];
                if(!json) return;
                (vm.columns || []).forEach(function(col){
                    // 为0的字段不显示
                    if(json[col.key] == '0'){
                        return;
                    };
                    cols.push(col);
                });
                vm.columns = cols;
            });
        }
    });

    export default Grid1;

</script>