<template>
    <div class="w3-accordion w3-light-grey">
        <div class="school-info-panel">
            <button class="w3-btn-block w3-left-align w3-theme-l1">
                基本信息
            </button>
            <div class="w3-accordion-content panel-a w3-show">
                <table class="w3-table-all">
                    <tr>
                        <td width="100">学校类型</td>
                        <td>{{school.type}}</td>
                    </tr>
                    <tr>
                        <td>隶属部门</td>
                        <td>{{school.belongDepart}}</td>
                    </tr>
                    <tr>
                        <td>办学性质</td>
                        <td>{{school.property}}</td>
                    </tr>
                    <tr>
                        <td>建设平台</td>
                        <td>{{school.platform}}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="school-info-panel">
            <button class="w3-btn-block w3-left-align w3-theme-l1">
                师资实力
            </button>
            <div class="w3-accordion-content panel-b w3-show">
                <table class="w3-table-all">
                    <tr v-for="item in teacher">
                        <td>{{item.title}}</td>
                        <td width="100">{{item.number}}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="school-info-panel">
            <button class="w3-btn-block w3-left-align w3-theme-l1">
                学生规模
            </button>
            <div class="w3-accordion-content panel-c w3-show">
                <table class="w3-table-all">
                    <tr v-for="item in student">
                        <td>{{item.title}}</td>
                        <td width="100">{{item.number}}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'zeptor'
    import Vue from 'vue'
    import ajax from '../../lib/xhr.js'
    import qs from '../../lib/querystring'
    
    var scode = qs('scode');

    function bindEvent(container){
        // 默认全部展开貌似好看一点
        $('.w3-accordion-content', container).addClass('w3-show');
        //
        container.on('click tab', '.school-info-panel', function(e){
            var panel = $('.w3-accordion-content', e.currentTarget);
            if(panel.hasClass('w3-show')){
                panel.removeClass('w3-show');
            }else{
                container.find('.w3-show').removeClass('w3-show');
                panel.addClass('w3-show');
            };
        });
    };
    
    export default {
        props: {
        },
        data: function () {
            return {
                school: {},
                teacher: {},
                student: {}
            };
        },
        created: function(){
            var self = this;
            var urls = [
                '/agent/getSchoolInfoByCode?scode=' + scode,
                '/agent/schoolInfo?scode=' + scode
            ];
            ajax(urls).then(function(results){
                self.school = results[0].school;
                self.teacher = results[1].teacher;
                self.student = results[1].student;
            });
        }
    };
</script>