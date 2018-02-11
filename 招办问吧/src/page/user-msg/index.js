/* template[user-page] */

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
                <ul class="w3-ul w3-card-4 w3-padding">

                    <li v-for="item in list"
                        class="w3-container w3-padding-16" msgId="{{item.id}}">
                        <span>{{item.schoolName}}</span>
                        <a href="javascript:;" class="w3-right w3-margin-right w3-medium">
                            [<span>{{item.isRead == 0 ?'未读' : '已读'}}</span>]
                            &nbsp;&nbsp;{{item.title}}
                        </a>
                        </br><span>{{item.content}}</span><br>
                    </li>

                    <li v-if="!list.length">暂无通知消息</li>
                </ul>
            <page>
        </div>
    `,
    data: {
        list: []
    },
    methods: {
        load: function () {
            var self = this;
            ajax('/agent/getNoticeList?userId={uid}').then(function (json) {
                ajaxExpired(json);
                self.list = json.data || [];
            });
        }
    },
    ready: function () {
        this.load();
    },
    components: {
        'page': require('../../component/user-page.vue')
    },
});