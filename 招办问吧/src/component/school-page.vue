<style lang="stylus" scoped>
    .head-title
        position relative;

        h3
            margin: 5px 0 0 0;
        p
            margin: 5px 0 10px 0;

        .go-home
            position absolute;
            right 10px;
            bottom 10px;
    
    .back-top
        position fixed;
        right 20px;
        bottom 20px;
        width: 40px;
        height 40px;
        background url("../css/image/back-top.png") 50% 50% no-repeat;

    .robot
        padding .5em 0 1em 90px
        position relative
        
        h3
            display inline-block
            margin-right 1em
            
        p
            margin 0
        
    .robot-logo
        background url('../image/robot.png') 50% 50% no-repeat
        width 60px
        height 60px
        position absolute
        left 1em
        top 1.5em

    .robot-link
        display inline-block
        padding 3px 10px
        border-radius 3px
        text-decoration none
        
</style>

<template>
    <div>
        <link rel="stylesheet" href="css/bjfu/user/style.css" />
        <link rel="stylesheet" href="css/bjfu/common/style.css" />
        <link rel="stylesheet" href="css/w3.css" />

        <!-- <link rel="stylesheet" :href="'css/w3-theme-' + school.style + '.css'" /> -->
        <link rel="stylesheet" :href="'/theme/' + (school.style || '2196f3' ) + ''" />

        <!--页头-->
        <div v-if="showTitle != 'false'" class="w3-container w3-theme head-title" @click="toIndex()">
            <h3 id="top"><img :src='serviceURL + school.yrScholar' style="height:30px;"/>{{school.name}}</h3>
            <p>{{school.professor}}</p>
            <a v-if="!isIndex" href="javascript:;" @click="toIndex()" class="go-home iconfont icon-81"></a>
        </div>

        <!--轮播图-->
        <carousel v-if="showCarousel != 'false'" :data="imgs" :time="3000"></carousel>

        <!--公告-->
        <notice v-if="showNotice == 'true'" :data="notices" :time="5000"></notice>

        <!--页面内容-->
        <slot></slot>

        <!--机器人-->
        <div v-if="showRobot == 'true'" class="w3-container w3-theme-l5 robot">
            <div class="robot-logo"></div>
            <h3>智能在线答疑</h3>
            <a :href="getRobotUrl()" class="robot-link w3-theme-l1">答疑通道</a>
            <p>365*24小时有问必答，不漏掉每一个考生的声音</p>
        </div>

        <!--页脚版权-->
        <div v-if="showCopyrights != 'false'" class="w3-container w3-theme-l1 w3-center">
            <p>
                ©版权所有: {{school.name}}
                <br/>
                Copyright {{ (new Date()).getFullYear() }} ALL Right Reserved 
                <br/>
                {{support}}
                <br v-if="support"/>
                京ICP备16030849号
                <br/>
                <p style="text-align: center; ">
                    <img :src="'http://www.zhinengdayi.com/imgServer/qrcode/' + school.identify + '.jpg'"
                        style="max-width: 100px; max-height: 100px;" />
                    <div style="font-size: 12px">长按二维码关注本公众号</div>
                </p>
            </p>
        </div>

        <a v-show="showBackTop" href="javascript:;" class="back-top" @click="backTop()"></a>

    </div>
</template>

<script>
import ajax from '../lib/xhr';
import qs from '../lib/querystring.js';
import config from '../../config.js';
import { sub, query, queryAll, css } from '../lib/util';
import { showPage } from '../lib/comm';
import $ from 'jquery';

const scode = qs('scode');

function scrollToElement(selector, time, verticalOffset) { 
    time = typeof(time) != 'undefined' ? time : 1000; 
    verticalOffset = typeof(verticalOffset) != 'undefined' ? verticalOffset : 0;
    var element = $(selector);
    var offset = element.offset();
    var offsetTop = offset.top + verticalOffset;
    console.info(123)
    $('html, body').animate({ scrollTop: offsetTop }, time);
 }

function noticeAdapter(json){
    var list = [];
    (json || []).forEach(function(n, i){
        list.push({ 
            text: n.title, 
            href: 'article.html?scode=' + scode + '&cid=' + n.catId +'#'+n.id 
        });
    });
    return list;
}

function initPiwik(schoolid, userid){
    var _paq = window._paq = window._paq || [];
    _paq.push(["setDomains", ["*.weixin.zhinengdayi.com"]]);
     
    //_paq.push(['setCustomVariable',1,"school",'${school.identify}',"page"]);
    _paq.push(['setCustomVariable',1,"school", schoolid ,"page"]);

    // <c:if test="${frontUser != null}">
    // _paq.push(['setUserId', '${frontUser.id}']);
    // </c:if>
    if(userid){
        _paq.push(['setUserId', userid + '']);
    };

    if(location.pathname != '/article.html'){
        _paq.push(['trackPageView']);
    }
    _paq.push(['enableLinkTracking']);

    console.info(schoolid, userid);

    (function() {
        var u="//piwik.zhinengdayi.com/piwik/";
        _paq.push(['setTrackerUrl', u+'piwik.php']);
        _paq.push(['setSiteId', '2']);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
    })();
};


function piwikReady(cb){
    //
    if(typeof cb === 'function'){
        piwikReady._list = piwikReady._list || [];
        piwikReady._list.push(cb);
    };
    //
    if(!window.Piwik){
        piwikReady._timer = piwikReady._timer || setInterval(piwikReady, 10);
    }else{
        clearInterval(piwikReady._timer);
        piwikReady._timer = null;
        //
        if(piwikReady._list){
            piwikReady._list.forEach(function(fn){
                try{
                    fn();
                }catch(e){};
            });
            piwikReady._list = [];
        };
    };
}

//
export default {
    props: ['showTitle', 'showCarousel', 'showNotice', 'showRobot', 'showCopyrights'],
    data: function(){
        return {
            imgs: [],
            notices: [],
            school: {
                style: 'indigo'
            },
            support: '',
            serviceURL:'',
            isIndex: location.pathname === '/index.html' || location.pathname === '/',
            showBackTop: false
        };
    },
    methods: {
        backTop: function(){
            scrollToElement('#top');
        },
        load: function(){
            var vm = this;
            ajax({
                url: '/agent/getSchoolInfoByCode?scode=' + scode,
                cache: true
            }).then(function(json){
                // 装载数据
                vm.school = json.school;
                vm.serviceURL=json.serviceURL;
                vm.imgs = vm.getCarouselImages(json);
                //
                vm.$dispatch('school', vm.school);
                // 隐藏loading，显示页面内容
                vm.show();
                vm.loadNotices();
                //
                ajax({
                    url: '/weixin/uid',
                    cache: true
                }).then(function(uid){
                    if(typeof uid !== 'number'){
                        uid = null;
                    };
                    var e = {
                        sid: json.school.identify,
                        uid: uid
                    };
                    //vm.$broadcast('school_user_info', e);
                    vm.$dispatch('school_user_info', e);
                    //
                    initPiwik(json.school.identify, uid);
                }).catch(function(){
                    var e = {
                        sid: json.school.identify,
                        uid: null
                    };
                    //vm.$broadcast('school_user_info', e);
                    vm.$dispatch('school_user_info', e);
                    //
                    initPiwik(json.school.identify, null);
                });
            });
        },
        loadNotices: function(){
            var vm = this;
            ajax({
                url: '/agent/getAnnouncement?scode=' + scode,
                cache: true,
                update: function(json){
                    json = noticeAdapter(json);
                    // 更新
                    if(JSON.stringify(json) != JSON.stringify(vm.notices)){
                        vm.notices = json;
                    };
                }
            }).then(function(json){
                vm.notices = noticeAdapter(json);
            });
        },
        loadSupport: function(){
            var vm = this;
            ajax({
                url: '/agent/getCopyright',
                dataType: 'text',
                cache: true,
                update: function(text){
                    // 更新
                    if(text != vm.support){
                        vm.support = text;
                    };
                }
            }).then(function(text){
                vm.support = text;
            });
        },
        toIndex: function(){
            location.href = 'index.html?scode=' + scode;
        },
        getRobotUrl: function(){
            return '/robot.html?scode=' + scode;
        },
        show: function(){
            var vm = this;
            showPage();
            setTimeout(function(){
                vm.$broadcast('page-show');
            }, 500);
        },
        getCarouselImages: function(data){
            var imgs = [], base;

            base = data.serviceURL || '';
            
            (data.imgs || []).forEach(function(n){
                imgs.push({
                    image: base + '/' + n.imgUrl,
                    onclick: n.clickUrl ? function(){
                        location.href = this.clickUrl;
                    }.bind(n) : null
                });
            });

            return imgs;
        },
    },
    watch: {
        'school': function(newVal){
            // 设置页面标题
            document.title = sub('{name} {professor}', newVal);
            // 设置favicon
            // if(this.school.yrScholar){
                
            //     let head = document.querySelector('head'), link, href = config.api.path(this.school.yrScholar);
            //     if(head){
            //         link = document.createElement('link');
            //         link.setAttribute('rel', 'icon');
            //         link.setAttribute('type', 'image/x-icon');
            //         link.setAttribute('href', href);
            //         head.appendChild(link);
            //         //
            //         link = document.createElement('link');
            //         link.setAttribute('rel', 'shortcut icon');
            //         link.setAttribute('type', 'image/x-icon');
            //         link.setAttribute('href', href);
            //         head.appendChild(link);
            //     };
            // };
        }
    },
    ready: function(){
        var vm = this;

        this.load();
        this.loadSupport();

        $(document).scroll(function(){
            vm.showBackTop = document.body.scrollTop > 230;
        });
        
        // 
        vm.$on('piwik', function(e){
            console.info(e);
            piwikReady(function(){
                var tracker=Piwik.getAsyncTracker();
                tracker.trackPageView(this.title);//参数可以加标题
            }.bind(e));
        });
    },
    components: {
        'carousel': require('./school-carousel.vue'),
        'notice': require('./text-carousel.vue')
    }
}    
</script>