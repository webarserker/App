/* template[user-page] */
import './index.styl'

import Vue from 'vue'
import ajax from '../../lib/xhr'
import qs from '../../lib/querystring.js'
import config from '../../../config.js'
import {each} from '../../lib/util'
import {ajaxExpired} from '../../lib/comm'

let pmap = {};

new Vue({
    el: '#body',
    template: `
        <div>
            <page>
                <h2>完善资料</h2>

                如果您是[高校招录智能咨询平台]的注册用户，可以
                <a id="link-bind" href="user-bind.html">绑定账号</a>
                同步资料。
                
                <br>
                <label class="w3-label w3-text-blue"><b>生源地</b></label>
                <select class="w3-select w3-border" v-model="user.provinceId">
                    <option v-for="option in provinces" v-bind:value="option.id" @click="selectProvince(option)">
                    {{ option.name }}
                    </option>
                </select>
                
                <label class="w3-label w3-text-blue"><b>科类</b></label>
                <select class="w3-select w3-border" v-model="user.scienceClass">
                    <option value="文科">文科</option>
                    <option value="理科">理科</option>
                    <option value="综合">综合</option>
                </select>

                <label class="w3-label w3-text-blue"><b>招生类型</b></label>
                <select class="w3-select w3-border" v-model="user.sourceType">
                    <option v-for="option in sourceTypes" v-bind:value="option">
                        {{ option }}
                    </option>
                </select>

                <label class="w3-label w3-text-blue"><b>高考分数</b></label>
                <input class="w3-input w3-border w3-round" v-model="user.score"/>

                <button class="w3-btn w3-theme w3-margin-top" type="button" @click="submit()">提交</button>
            <page>
        </div>
    `,
    data: {
        sourceTypes: [],
        provinces: [],
        user: {}
    },
    watch: {
        'user.provinceId': function (pid) {
            this.user.provinceName = pmap[pid];
        }
    },
    methods: {
        load: function () {
            var vm = this;
            ajax('/agent/getUserInfoById?userId={uid}').then(function (json) {
                ajaxExpired(json);
                vm.sourceTypes = json.sourceTypes;
                vm.provinces = json.provinces;
                vm.user = json.user;
                //
                each(vm.provinces, function (n) {
                    pmap[n.id] = n.name;
                });
            });
        },
        submit: function () {
            var vm = this, user = JSON.parse(JSON.stringify(vm.user));

            if (user.provinceName == '') {
                alert("生源地不能为空");
                return
            }

            if (user.scienceClass == '') {
                alert("科目不能为空");
                return
            }
            if (user.sourceType == '') {
                alert("招生类型不能为空");
                return
            }
            if (user.score == '' || isNaN(user.score)) {
                alert("高考分数必须是数字");
                return
            };

            ajax({
                url: '/agent/updateUserInfo?id={uid}',
                type: "POST",
                data: {
                    'provinceId': user.provinceId, 
                    'provinceName': user.provinceName, 
                    'sourceType': user.sourceType, 
                    'scienceClass': user.scienceClass, 
                    'score': user.score 
                }
            }).then(function (data) {
                ajaxExpired(data);
                if (data && data.retCode == 0) {
                    window.location.href = 'user-school.html';
                } else {
                    alert("修改失败:" + data.message)
                };
            }).catch(function () {
                alert("修改失败");
            });
        }
    },
    components: {
        'page': require('../../component/user-page.vue')
    },
    ready: function () {
        this.load();
    }
});