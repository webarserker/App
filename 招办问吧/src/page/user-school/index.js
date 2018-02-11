/* template[user-page] */

import Vue from 'vue'
import ajax from '../../lib/xhr'
import qs from '../../lib/querystring.js'
import config from '../../../config.js'
import { ajaxExpired } from '../../lib/comm'

let hash = location.hash.replace('#', '');

function listAdapter(data) {
    var list = [];
    (data || []).forEach(function(n) {
        if (n.isSub === 0) {
            return;
        };
        var professor = n.professor || '';
        if (professor && professor.length >= 5) {
            professor = professor.substring(0, 5) + "..."
        }
        list.push({
            id: n.identify || n.id,
            logo: config.api.path(n.yrScholar || n.logo),
            name: n.name,
            scode: n.schoolCode || n.code,
        });
    });
    return list;
}

new Vue({
    el: '#body',
    template: `
<div>
<page>

<div v-if="tab === 'my'">
    <h2>我的关注高校</h2>
    <p>点击进入高校招办专题咨询服务首页（学校持续增加）</p>
</div>
<div v-if="tab === 'all'">
    <h2>添加关注高校</h2>
    <p>点击进入高校招办专题咨询服务首页（学校持续增加）</p>
</div>

<div class="school-loading" v-if="schools == null">
    加载中
    </div>
    <div class="w3-row">
    <a href="javascript:;" @click="switchSubTab(0)">
    <div :class="subTab==0 ? 'w3-harf tablink w3-bottombar w3-padding w3-border-green w3-col s6 m6 l6 w3-center w3-green' : 'w3-harf tablink w3-bottombar w3-padding w3-border-green w3-col s6 m6 l6 w3-center'">高考招录</div>
    </a>
    <a  href="javascript:;" @click="switchSubTab(1)">
    <div :class="subTab==1 ? 'w3-harf tablink w3-bottombar w3-padding w3-border-green w3-col s6 m6 l6 w3-center w3-green' : 'w3-harf tablink w3-bottombar w3-padding w3-border-green w3-col s6 m6 l6 w3-center'">研究生招录</div>
    </a>
    </div>
    <ul class="w3-ul w3-card-4" v-if="schools != null">
    <li class="w3-container w3-padding-16" v-for="(index, item) in schools">
    <a href="javascript:;" v-if="tab === 'all'"
    class="w3-right w3-margin-right w3-medium" @click="add(item.scode, index)">关注</a>
    <a href="javascript:;" v-if="tab === 'my'"
    class="w3-right w3-margin-right w3-medium" @click="remove(item.scode, index)">取消关注</a>

    <img :src="item.logo" class="w3-left w3-circle w3-margin-right" style="height:30px;width:30px;" @click="go2index(item.scode)">
    <span @click="go2index(item.scode)">{{item.name}}</span>
</li>
</ul>

<div v-if="tab === 'my'">
    <a class="w3-btn w3-green w3-round w3-margin-top" href="#all">查看所有高校</a>
    </div>
    <div v-if="tab === 'all'">
    <a class="w3-btn w3-green w3-round w3-margin-top" href="#my">查看我的关注</a>
    </div>
    <page>
    </div>
`,
    data: {
        tab: null,
        subTab: 0,
        schools: null,
        uid:'',
    },
    methods: {
        loadMy: function(isPostGraduate) {
            var vm = this;
            vm.schools = null;
            ajax('/agent/findSubSchool?pageSize=999&curPage=1&userId={uid}&isPostGraduate=' + isPostGraduate).then(function(json) {
                ajaxExpired(json);
                vm.schools = listAdapter(json.data);
            });
        },
        loadAll: function(isPostGraduate) {
            var vm = this;
            vm.schools = null;
            ajax('/agent/findSchoolSub?pageSize=999&curPage=1&userId={uid}&isPostGraduate=' + isPostGraduate).then(function(json) {
                ajaxExpired(json);
                vm.schools = listAdapter(json.data);
            });
        },
        add: function(scode, index) {
            var vm = this;
            if (!vm.schools) return;
            vm.schools.splice(index, 1);
            ajax('/agent/schoolToggle?userId={uid}&schoolCode=' + scode + '&type=1').then(function(json) {
                ajaxExpired(json);
            });
        },
        remove: function(scode, index) {
            var vm = this;
            if (!vm.schools) return;
            vm.schools.splice(index, 1);
            ajax('/agent/schoolToggle?userId={uid}&schoolCode=' + scode + '&type=2').then(function(json) {
                ajaxExpired(json);
            });
        },
        go2index: function(scode) {
            var uid = this.uid?'#?uid='+this.uid:''
            location.href = '/build/index.html?scode=' + scode+uid;
        },
        switchSubTab: function(tab) {
            var vm = this;
            vm.subTab = tab;
        }
    },
    watch: {
        tab: function(newVal) {
            var vm = this;
            vm.subTab = 0;
            if (newVal === 'my') {
                this.loadMy(0);
            } else {
                this.loadAll(0);
            }
        },
        subTab: function(newVal) {
            var vm = this;
            if (vm.tab == 'my') {
                vm.loadMy(newVal);
            } else {
                vm.loadAll(newVal);
            }
        }
    },
    ready: function() {
        var reg = new RegExp("(^|&)uid=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null){
            this.uid = unescape(r[2]);
        }

        var vm = this;
        //
        window.addEventListener("hashchange", function() {
            vm.tab = location.hash.replace('#', '') || 'my';
        }, false);
        //
        vm.tab = hash || 'my';
    },
    components: {
        'page': require('../../component/user-page.vue')
    },
});
