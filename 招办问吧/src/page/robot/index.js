/* template[school-page] */

import './index.styl'

import Vue from 'vue'
import ajax from '../../lib/xhr';
import qs from '../../lib/querystring';
import config from '../../../config';
import { query, queryAll, css } from '../../lib/util';
import { showPage, ajaxExpired } from '../../lib/comm';

const scode = qs('scode');

new Vue({
    el: '#body',
    template: ` 
        <iframe v-if="url" :src="url" frameborder="0" scrolling="no" seamless
            :width="width" :height="height" allowfullscreen></iframe>
    `,
    data: {
        url: '',
        width: '100%',
        height: '100%'
    },
    components: {
    },
    methods: {
        load: function(){
            var vm = this;
            ajax('/weixin/uid').then(function(uid){
                ajaxExpired(uid);
                vm.url = config.robot.path('/users?id=' + uid + '&sCode=' + scode + '&name=&source=1');
            });
        }
    },
    ready: function(){
        this.height = document.documentElement.clientHeight;
        this.width = document.documentElement.clientWidth;
        this.load();
        showPage();
        document.title = '智能招办';
    }
});