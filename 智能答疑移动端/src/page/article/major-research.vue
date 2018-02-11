
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
    var filters = {
        name: {
            label: '专业名称',
            type: 'text',
            data: []
        }
    };
    var Grid1 = Object.assign({}, Grid, {
        props: Object.assign({}, Grid.props, {
            cls: {
                default: function(){
                    return 'w3-card-4 w3-margin w3-padding';
                }
            },
            filters: {
                type: Object,
                'default': function(){
                    return {
                        majorName: {
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
                        { key: 'majorCode', label: '代码' },
                        { key: 'majorName', label: '专业' },
                        { key: 'department', label: '院系' },
                        { key: 'name', label: '研究方向' },
                        { key: 'mentors', label: '导师' },
                        { key: 'typeStr', label: '类型'},
                        { key: 'id', label: '指南', formatter: function(row){
                            return '<a href="' + appendQuery('article.html?sub=major-research-detail&id=' + row.id) + '">详情</a>';
                        } }
                    ]
                }
            },
            url: {
                'default': '/agent/getMajorResearchList'
            },
            postData: {
                'default': function(){
                    return {
                        scode: scode
                    }
                }
            }
        }),
        ready: function(){

        }
    });

    export default Grid1;

</script>