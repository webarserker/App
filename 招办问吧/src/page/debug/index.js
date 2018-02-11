import './index.styl'

import Vue from 'vue'
import ajax from '../../lib/xhr';
import qs from '../../lib/querystring.js';
import { query, queryAll, css } from '../../lib/util';
import cache from '../../lib/cache.js';


const scode = qs('scode');
const uid = qs('uid');

new Vue({
    el: '#body',
    template: `
        <div>
            <page>
                <input type="text" v-model="name" />
            </page>
        </div>
    `,
    data: {
        name: ''
    },
    components: {
        'page': require('../../component/school-page.vue'),
    },
    watch: {
        'name': function(val){
            cache.set('name', val);
        }
    },
    ready: function(){
        this.name = cache.get('name');
    }
});