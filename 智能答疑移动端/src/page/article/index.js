/* template[school-page] */

import '../../font/iconfont.css'
import './index.styl'

import Vue from 'vue'
import ajax from '../../lib/xhr';
import qs from '../../lib/querystring.js';

const comps = {
    'page': require('../../component/school-page.vue'),
    'list': require('../../component/list.vue'),
    'sub-1' :  require('./school-info.vue'),
    'sub-8' :  require('./enrool-plan.vue'),
    'sub-6' :  require('./major-info.vue'),
    'sub-9' :  require('./enroll-rule.vue'),
    'sub-11':  require('./major-score.vue'),
    'sub-10':  require('./school-score.vue'),
    'sub-13':  require('./major-research.vue'),
    'sub-major-research-detail':  require('./major-research-detail.vue'),
    'sub-major-detail':  require('./major-detail.vue'),
    'sub-major-plan':  require('./major-plan.vue'),
};

const scode = qs('scode');
const cid = qs('cid');
const isSubCat = 0;

let firstId = '';
let aid = location.hash.replace('#', '');

function catalogDataAdapter(data){
    var cat = Object.assign({}, data, {
        list: [],
        isSubCat : 0,
    });
    if(data && data.subMenu){
        data.subMenu.forEach(function(n){
            if(!firstId){
                firstId = n.id;
            };
            if(data.isSubCat == 1) {
                cat.list.push(Object.assign(n, {
                    url: 'article.html?scode='+scode+'&cid=' + n.id
                }));
                cat.isSubCat = 1;
            }else {
                cat.list.push(Object.assign(n, {
                    url: '#' + n.id
                }));
            }
        });
    };
    return cat;
}

new Vue({
    el: '#body',
    template: `
        <div>
            <page>
                <list v-if="cat.list && aid"
                    :title="cat.name" 
                    :list="cat.list"
                    :icon="cat.icon"
                    :active="aid"
                    item-icon="icon-dot"
                    :max="10"
                ></list>
                <div v-if="cat.list == null || cat.list.length == 0" style="width: 100%;text-align: center;margin:20px 0px 0px 0px;">暂无信息</div>
                <div class="article-content" v-if="content">
                    {{{content}}}
                </div>
                <div class="article-attach">
                    <component v-if="sub" :is="sub" keep-alive></component>
                </div>
            </page>
        </div>
    `,
    data: {
        cat: [],
        aid: '',
        content: '',
        sub: '',
        schoolName: '',
        schoolUserInfo: null
    },
    components: comps,
    watch: {
        aid: function(id){
            this.loadArticle(id);
        }
    },
    methods: {
        load: function(){
            var vm = this;
            ajax({
                url: '/agent/findCatInfoList?scode=' + scode + '&catId=' + cid,
                cache: true,
                update: function(data){
                    data = catalogDataAdapter(data);
                    if(JSON.stringify(data) !== JSON.stringify(vm.cat)){
                        vm.cat = data;
                    };
                }
            }).then(function(data){
                data = catalogDataAdapter(data);
                if(data.isSubCat == 0) {
                    vm.aid = aid || firstId;
                }else {
                    vm.aid = -1;
                }
                vm.cat = data;
            });
        },
        loadArticle: function(id){
            var vm = this;
            vm.content = '';
            ajax('/agent/infoContent?id=' + id).then(function(data){
                document.title = vm.schoolName + '-' + data.title;
                vm.content = data.content || '';
                vm.showSub(data.specType);
                // vm.$dispatch('piwik', {
                //     title: data.title
                // });
                window._paq.push(['trackPageView',document.title]);
            });
        },
        showSub: function(sub){
            var vm = this;
            sub = 'sub-' + sub;
            if(comps[sub]){
                vm.sub = sub;
            }else{
                vm.sub = '';
            };
            this.broadcast();
        },
        broadcast: function(){
            var vm = this;
            setTimeout(function(){
                vm.schoolUserInfo && vm.$broadcast('school_user_info', vm.schoolUserInfo);
                console.info(vm.schoolUserInfo)
            }, 100);
        }
    },
    events: {
        'school_user_info': function(e){
            this.schoolUserInfo = e;
            this.$broadcast('school_user_info', e);
        }
    },
    ready: function(){
        var vm = this;
        var infoId = location.hash.replace('#', '');
        location.href = 'http://weixin.zhinengdayi.com/build/index.html?scode='+scode+'#/articleDetail?infoId='+infoId+'&catId='+cid;

        this.$on('school', function(e){
            vm.schoolName = e.name;
        });

        //
        if(cid){
            this.load();
        }else if(qs('sub')){
            vm.showSub(qs('sub'));
            window._paq = window._paq || [];
            window._paq.push(['trackPageView']);
        };
        //
        window.addEventListener("hashchange", function(){
            if(isSubCat == 0) {
                vm.aid = location.hash.replace('#', '') || firstId;
            }
        }, false);
    }
});