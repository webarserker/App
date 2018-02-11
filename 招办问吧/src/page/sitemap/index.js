import './index.styl'
import ajax from '../../lib/xhr'
import Vue from 'vue'

var html = `
    <div>
        UserID:
        <select v-model="uid">
            <option value="34">刘海平</option>
            <option value="30">邓康华</option>
        </select>
        <br/>
        SCode:
        <select v-model="scode">
            <option value="NLGYFE">对外经贸</option>
            <option value="GIIVKN">二外</option>
        </select>
        <br/>
        <div class="page" v-for="(page, name) in pages">
            <a href="{{page}}.html?scode={{scode}}">{{name}}</a>
        </div>
    </div>
`;

var vm = new Vue({
    el: 'body',
    replace: false,
    template: html,
    data: {
        uid: '34',
        scode: 'NLGYFE',
        pages: {}
    },
    methods: {
        setUid: function(callback){
            ajax('/weixin/setuid/' + this.uid).then(callback);
        }
    },
    watch: {
        uid: function(){
            this.setUid();
        }
    },
    ready: function(){
        var vm = this;
        this.setUid(function(success){
            if(success){
                vm.pages = {
                    'index': '首页', 
                    'user-bind': '绑定用户', 
                    'user-info': '用户资料', 
                    'user-msg': '我的消息', 
                    'user-school': '我的关注', 
                    'ask': '在线留言', 
                    'robot': '机器人',
                    'login': '登录',
                    'register': '注册'
                };
            }
        });
    }
});