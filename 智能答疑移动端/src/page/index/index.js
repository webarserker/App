/* template[school-page] */

import '../../font/iconfont.css'
import '../../css/bjfu/user/style.css'
import '../../css/bjfu/common/style.css'
import './index.styl'

import Vue from 'vue'
import ajax from '../../lib/xhr';
import qs from '../../lib/querystring.js';
import { query, queryAll, css } from '../../lib/util';


const scode = qs('scode');

// 目录数据格式转换
function catalogDataAdapter(data){
    var result = {
        catalogs: [],
        guide: null,
        hot: null,
    };
    data = data || [];
    data.forEach(function(n){
        var item = { 
            name: n.name, 
            type: n.contentType,
            list: [],
            icon: (n.icon || 'icon-article')
        };
        (n.subMenu || []).forEach(function(cat){
            cat = Object.assign({}, cat, {
                url: 'article.html?scode=' + scode + '&cid=' + cat.id,
                icon: cat.icon
            });
            item.list.push(cat);
        });
        if(item.type == 1){
            result.guide = item;
        }else if(item.type == 2){
            result.hot = item;
        }else if(item.type != 5){
            result.catalogs.push(item);
        };
    });
    return result;
}

new Vue({
    el: '#body',
    template: `
        <div>
            <page show-notice="true" show-robot="true">
                <guide></guide>
                <hot></hot>
                <div class="catalogs">
                    <list v-for="cat in catalogs" 
                        :title="cat.name" 
                        :list="cat.list"
                        :icon="cat.icon"
                        item-icon="icon-dot"
                    ></list>
                </div>
            </page>
        </div>
    `,
    data: {
        guide: [],
        hot: [],
        catalogs: []
    },
    components: {
        'page': require('../../component/school-page.vue'),
        'guide': require('../../component/register-guide.vue'),
        'hot': require('../../component/register-hot.vue'),
        'list': require('../../component/list.vue')
    },
    watch: {
        guide: function(guide){
            this.$broadcast('register-guide-data', guide.list || []);
        },
        hot: function(hot){
            this.$broadcast('register-hot-data', hot.list || []);
        }
    },
    methods: {
        loadCatalogs: function(){
                var vm = this;
            ajax({
                url: '/agent/findCatTree?scode=' + scode,
                cache: true,
                update: function(json){
                    json = catalogDataAdapter(json);

                    if(JSON.stringify(json.guide) !== JSON.stringify(vm.guide)){
                        vm.guide = json.guide;
                    };

                    if(JSON.stringify(json.hot) !== JSON.stringify(vm.hot)){
                        vm.hot = json.hot;
                    };
                    
                    if(JSON.stringify(json.catalogs) !== JSON.stringify(vm.catalogs)){
                        vm.catalogs = json.catalogs;
                    };
                }
            }).then(function(json){
                json = catalogDataAdapter(json);
                vm.guide = json.guide;
                vm.hot = json.hot;
                vm.catalogs = json.catalogs;
            });
        }
    },
    ready: function(){
        location.href = 'http://weixin.zhinengdayi.com/build/index.html?scode='+scode
        this.loadCatalogs();
    }
});