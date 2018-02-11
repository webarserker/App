/* template[user-page] */
import './index.styl'

import Vue from 'vue'
import ajax from '../../lib/xhr'
import qs from '../../lib/querystring.js'
import config from '../../../config.js'
import {ajaxExpired} from '../../lib/comm'

function isEmail(s){
    return !!s.trim();
}

new Vue({
    el: '#body',
    template: `
        <div>
            <page>
                <h2 id='title'>注册账号</h2>

                <label class="w3-label w3-text-blue"><b>账号（邮箱名）</b></label>
                <input class="w3-input w3-border w3-round" v-model="account"/>

                <button type="button" class="w3-btn w3-theme w3-margin-top" @click="sendVcode()">发送验证码</button>
                <br/>

                <label class="w3-label w3-text-blue"><b>验证码</b></label>
                <input class="w3-input w3-border w3-round" v-model="vcode"/>

                <label class="w3-label w3-text-blue"><b>密码</b></label>
                <input class="w3-input w3-border w3-round" type="password" v-model="password"/>

                <label class="w3-label w3-text-blue"><b>重复一次密码</b></label>
                <input class="w3-input w3-border w3-round" type="password" v-model="repassword"/>

                <button type="button" class="w3-btn w3-theme w3-margin-top" @click="register()">注册</button>

                <p><a href="login.html">已经有账号，立即登录</a></p>
            <page>
        </div>
    `,
    data: {
        account: '',
        password: '',
        repassword: '',
        vcode: ''
    },
    methods: {
        register: function () {
            var vm = this;

            vm.account = vm.account.trim();
            vm.password = vm.password.trim();

            if (!isEmail(vm.account)) {
                alert("请填写有效的邮箱地址");
                return
            };

            if (vm.vcode.length < 4) {
                alert("请输入6位数验证码");
                return
            }

            if (vm.password.length < 6) {
                alert("密码不能少于6位数");
                return
            }

            if (vm.password !== vm.repassword) {
                alert("两次输入密码不一致");
                return
            }

            ajax({
                url: '/agent/register',
                type: 'POST',
                data: {
                    'account': vm.account,
                    'password': vm.password,
                    'valiCode': vm.vcode,
                    'schoolCode': ''
                }
            }).then(function (data) {
                if (data && data.retCode == 0) {
                    window.location.href = 'login.html';
                } else {
                    alert("注册失败:" + data.message);
                };
            }).catch(function () {
                alert("注册失败");
            });
        },
        sendVcode: function(){
            var vm = this;

            if(!isEmail(vm.account)){
                return alert('请填写有效的邮箱地址');
            };
            
            ajax({
                url: '/agent/sendEmailValiCode',
                type: 'POST',
                data: {
                    toEmail: vm.account,
                    codeType: 0
                }
            }).then(function(){
                alert('验证码已发送');
            }).catch(function(err){
                alert(err);
            });
        }
    },
    components: {
        'page': require('../../component/user-page.vue')
    },
});