/* template[user-page] */
import './index.styl'

import Vue from 'vue'
import ajax from '../../lib/xhr'
import qs from '../../lib/querystring.js'
import config from '../../../config.js'
import {ajaxExpired} from '../../lib/comm'

var redirect = '';

try{
    redirect = window.atob(qs('redirect'));
}catch(e){}

new Vue({
    el: '#body',
    template: `
        <div>
            <page>
                <h2 id='title'>登录</h2>

                <label class="w3-label w3-text-blue"><b>账号（邮箱名）</b></label>
                <input class="w3-input w3-border w3-round" v-model="account"/>

                <label class="w3-label w3-text-blue"><b>密码</b></label>
                <input class="w3-input w3-border w3-round" type="password" v-model="password"/>
                
                <button type="button" class="w3-btn w3-theme w3-margin-top" @click="bind()">登录</button>

                <p><a href="register.html">还没有账号，立即注册</a></p>
            <page>
        </div>
    `,
    data: {
        account: '',
        password: '',
    },
    methods: {
        bind: function () {
            var vm = this;

            vm.account = vm.account.trim();
            vm.password = vm.password.trim();

            if (!vm.account) {
                alert("请输入账号");
                return
            };

            if (!vm.password) {
                alert("请输入密码");
                return
            }

            ajax({
                url: '/weixin/login',
                type: 'POST',
                data: {
                    'account': vm.account,
                    'password': vm.password
                }
            }).then(function (data) {
                if (data && data.retCode == 0) {
                    alert('登录成功，1秒后自动跳转');
                    setTimeout(function(){
                        window.location.href = redirect || 'user-info.html';
                    }, 1000);
                } else {
                    alert("登录失败:" + data.message);
                };
            }).catch(function () {
                alert("登录失败");
            });
        }
    },
    components: {
        'page': require('../../component/user-page.vue')
    },
});