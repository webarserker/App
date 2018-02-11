/* template[user-page] */
import './index.styl'

import Vue from 'vue'
import ajax from '../../lib/xhr'
import qs from '../../lib/querystring.js'
import config from '../../../config.js'
import {ajaxExpired} from '../../lib/comm'

new Vue({
    el: '#body',
    template: `
        <div>
            <page>
                <h2 id='title'>绑定已有账号</h2>

                <label class="w3-label w3-text-blue"><b>账号</b></label>
                <input class="w3-input w3-border w3-round" v-model="account"/>

                <label class="w3-label w3-text-blue"><b>密码</b></label>
                <input class="w3-input w3-border w3-round" type="password" v-model="password"/>

                <button type="button" class="w3-btn w3-theme w3-margin-top" @click="bind()">绑定账号</button>
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

            if (vm.account == '') {
                alert("账号不能为空");
                return
            };

            if (vm.password == '') {
                alert("密码不能为空");
                return
            }

            ajax({
                url: '/agent/bindAcct?id={uid}',
                type: 'POST',
                data: {
                    'account': vm.account,
                    'password': vm.password
                }
            }).then(function (data) {
                if (data && data.retCode == 0) {
                    window.location.href = 'user-info.html';
                } else {
                    alert("绑定失败:" + data.message);
                };
            }).catch(function () {
                alert("绑定失败");
            });
        }
    },
    components: {
        'page': require('../../component/user-page.vue')
    },
});