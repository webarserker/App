/* template[school-page] */

import './index.styl'

import Vue from 'vue'
import ajax from '../../lib/xhr';
import qs from '../../lib/querystring.js';
import { query, queryAll, css } from '../../lib/util';
import {ajaxExpired} from '../../lib/comm'

const scode = qs('scode');

new Vue({
    el: '#body',
    template: `
        <div>
            <page>
                <div class="ask">
                    <div class="ask-title w3-text-theme">
                        <span class="iconfont icon-msg"></span>
                        <span>在线留言</span>
                    </div>
                    <div class="w3-margin question-box">
                        <textarea id="question" v-model="msg"></textarea>
                        <button type="button" :class="msg ? 'w3-theme' : ''" @click="send">提交</button>
                    </div>
                </div>
            </page>
        </div>
    `,
    data: {
        msg: ''
    },
    components: {
        'page': require('../../component/school-page.vue'),
        'guide': require('../../component/register-guide.vue')
    },
    methods: {
        send: function(){
            var vm = this;
            var catalogs = [];
            var msg = vm.msg.trim();

            if(!msg){
                return;
            };

            ajax({
                type: 'post',
                url: '/agent/addOfflineAnswer?forwordUser={uid}',
                data: {
                    schoolCode: scode,
                    question: msg
                }
            }).then(function(json){
                ajaxExpired(json);
                alert('留言成功');
            });
            
            vm.msg = '';
        }
    },
    ready: function(){
        
    }
});