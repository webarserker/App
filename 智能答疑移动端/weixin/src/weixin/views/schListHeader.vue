<template>
    <div class="schList">
        <div class="fixed" id="fixed">
            <div class="searchWp">
                <div class="search">
                    <i class="comicon-02 icon1-search"></i>
                    <input type="text" placeholder="请输入需要搜索的大学名称" v-model="keyword" @click="handleFocus"/>

                </div>
                <div class="cancel" v-show="showSearchBox" @click="showSearchBox=false;keyword='';">取消</div>
            </div>
            <div class="tabTit">
                <div class="tab" :class="{active: $store.state.schListTab==0}"
                     @click="$router.push('/schList/collected');showFilterBox = false;keyword='';">已关注<span class="num">{{$store.state.collectedSchNum}}</span>
                </div>
                <div class="tab" :class="{active: $store.state.schListTab==1}"
                     @click="$router.push('/schList/hot');showFilterBox = false;keyword='';">热门高校
                </div>
                <div class="tab" :class="{active: $store.state.schListTab==2}"
                     @click="$router.push('/schList/all');showFilterBox = false">全部高校
                </div>
            </div>
            <div class="filter" v-show="$store.state.showFilter">
                <div class="item" @click="handelFilterLick('province')"
                     :class="{active: filterType=='province'&&showFilterBox}">省份<i class="comicon-28 icon1-arrow"></i>
                </div>
                <div class="item" @click="handelFilterLick('recruitType')"
                     :class="{active: filterType=='recruitType'&&showFilterBox}">招录类型<i
                        class="comicon-28 icon1-arrow"></i></div>
                <div class="item last" @click="handelFilterLick('schoolType')"
                     :class="{active: filterType=='schoolType'&&showFilterBox}">学校属性<i
                        class="comicon-28 icon1-arrow"></i></div>
            </div>
        </div>
        <div class="filterResultWp" v-show="$store.state.showFilter&&showFilterBox">
            <div class="mask" @click="filterBoxBlur"></div>
            <div class="filterResult">
                <dl v-if="filterType=='province'">
                    <dt class="item" :class="{active: activeProvinceName == ''}" @click="handelProItem('')">{{filterTit}}</dt>
                    <dd class="item" :class="{active: activeProvinceName == obj.name}"
                        v-for="(obj,idx) of filterResultArr" @click="handelProItem(obj.name)">
                        {{obj.name}}
                    </dd>
                </dl>
                <dl v-if="filterType=='recruitType'">
                    <dt class="item" :class="{active: activeRecruitTypeName == ''}" @click="handelRecruitItem('')">{{filterTit}}</dt>
                    <dd class="item" :class="{active: activeRecruitTypeName == obj.id}"
                        v-for="(obj,idx) of filterResultArr" @click="handelRecruitItem(obj.id)">
                        {{obj.name}}
                    </dd>
                </dl>
                <dl v-if="filterType=='schoolType'">
                    <dt class="item" :class="{active: activeSchoolTypeName == ''}" @click="handelSchoolItem('')">{{filterTit}}</dt>
                    <dd class="item" :class="{active: activeSchoolTypeName == obj.name}"
                        v-for="(obj,idx) of filterResultArr" @click="handelSchoolItem(obj.name)">
                        {{obj.name}}
                    </dd>
                </dl>
            </div>
        </div>
        <!--<transition name="move">-->
            <div class="searchBox" v-show="showSearchBox">
                <div class="mask"></div>
                <div class="searchContent">
                    <div class="searchResultList">
                        <p v-if="showNoSearchResult" class="noSearchResult">
                            您搜索的高校招生系统还未上线
                        </p>
                        <ul>
                            <li v-for="obj in searchResult" @click="handelResultClick(obj)">
                                <i class="comicon-02"></i><a href="javascript:void(0)"
                                                             v-html="searchResultFilter(obj.name) + '·' +(obj.recruitType=='0'?'高招':'研招')"></a>
                            </li>
                        </ul>
                    </div>
                    <div class="searchHelp">
                        <div class="searchHistorytList listWp">
                            <div class="subTit"><i class="comicon-36"></i>搜索历史</div>
                            <ul class="list">
                                <li v-for="obj in searchHistoryArr" @click="goAnchor(obj.name, 'anchor-' + obj.sCode)">
                                    <a href="javascript:void(0)"
                                       v-text="obj.name + '·' +(obj.recruitType=='0'?'高招':'研招')"></a>
                                </li>
                            </ul>
                        </div>
                        <div class="searchHotList listWp">
                            <div class="subTit"><i class="comicon-35"></i>热门搜索</div>
                            <ul class="list clear">
                                <li v-for="obj in searchHotArr" @click="handelResultClick(obj)">
                                    <a href="javascript:void(0)" v-text="obj.name"></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        <!--</transition>-->

        <div>
            <div class="tabCon" :class="{fixed: showSearchBox || showFilterBox}">
                <router-view></router-view>
            </div>
        </div>
        <v-tip :options=tip.options :show=tip.show @on-result-change="onResultChange"></v-tip>
    </div>
</template>
<script type="text/javascript">
    import "../css/schListHeader.scss"
    import {mapActions} from "vuex"

    import urlAddToken from '../utils/urlAddToken.js'

    export default {
        data() {
            return {
                showNoSearchResult: false,
                showSearchBox: false,
                showFilterBox: false,
                keyword: '',
                searchResult: [],
                searchHistoryArr: [],
                searchHotArr: [],
                filterType: '',
                filterTit: '',
                lastClickType: '',
                filterResultArr: [],
                provinceArr: [],//城市
                schoolTypeArr: [],//学校类型
                recruitTypeArr: [{id: '0', name: '高考招生'}, {id: '1', name: '研究生招生'}],//招录类型
                tip: {
                    options: {
                        content: '',
                        autoClose: true
                    },
                    show: false
                }
            }
        },
        components: {
            'v-tip': require('../component/tip.vue')
        },
        computed: {
            activeProvinceName: function () {
                return this.$store.state.filterProvince
            },
            activeSchoolTypeName: function () {
                return this.$store.state.filterShcool
            },
            activeRecruitTypeName: function () {
                return this.$store.state.filterRecruit
            }
        },
        watch: {
            keyword: function () {
                this.search()
            }
        },
        methods: {
            ...mapActions(['CHANGE_SEARCHKEYWORD', 'CHANGE_FILTERPROVINCE', 'CHANGE_FILTERRECRUIT', 'CHANGE_FILTERSHCOOL']),
            searchResultFilter: function (d) {
                var me = this
                var re = new RegExp(me.keyword, "gi");
                var result = d.replace(re, '<span style="color:#0f9e59">' + me.keyword + '</span>')
                return result
            },
            /*搜索框聚焦*/
            handleFocus: function () {
                this.showSearchBox = true
                this.searchResult = []
                //this.keyword = ''
                this.$store.commit('CHANGE_SEARCHKEYWORD', '')
                //点击搜索框时，筛选条件置空
                this.$store.commit('CHANGE_FILTERPROVINCE', '')
                this.$store.commit('CHANGE_FILTERRECRUIT', '')
                this.$store.commit('CHANGE_FILTERSHCOOL', '')
                document.body.scrollTop = 0
            },
            /*点击条件筛选项*/
            handelFilterLick: function (type) {
                this.filterType = type
                if (type == this.lastClickType) {
                    this.showFilterBox = !this.showFilterBox
                } else {
                    this.showFilterBox = true
                }
                this.lastClickType = type
                switch (type) {
                    case 'province':
                        this.filterResultArr = this.provinceArr
                        this.filterTit = '全部省份'
                        break;
                    case 'recruitType':
                        this.filterResultArr = this.recruitTypeArr
                        this.filterTit = '全部招录类型'
                        break;
                    case 'schoolType':
                        this.filterResultArr = this.schoolTypeArr
                        this.filterTit = '全部学校类型'
                        break;
                }
            },
            /*选择城市筛选条件*/
            handelProItem: function (name) {
                this.$store.commit('CHANGE_FILTERPROVINCE', name)
                //this.activeProvinceName = name
                this.showFilterBox = false
            },
            /*选择招录类型筛选条件*/
            handelRecruitItem: function (id) {
                this.$store.commit('CHANGE_FILTERRECRUIT', id)
                //this.activeRecruitTypeName = id
                this.showFilterBox = false
            },
            /*选择学校类型筛选条件*/
            handelSchoolItem: function (name) {
                this.$store.commit('CHANGE_FILTERSHCOOL', name)
                //this.activeSchoolTypeName = name
                this.showFilterBox = false
            },
            /*点击筛选框之外的地方关闭筛选框*/
            filterBoxBlur: function () {
                this.showFilterBox = false
            },
            /*获取历史搜索记录*/
            getSearchHistory: function () {
                var state = this.$store.state
                var url = state.host + state.baseUrl + '/school/findSearchHistory?userId=' + (localStorage.uid?localStorage.uid:'')
                setTimeout(() => {
                    this.$http.get(url, {
                        emulateJSON: true
                    })
                        .then(res => {
                            if (res.data.code == '000000') {
                                this.searchHistoryArr = res.data.data
                            } else {
                                this.tip.options.content = res.data.message
                                this.tip.show = true
                            }

                        }, err => {
                            this.tip.options.content = '网络或系统繁忙...'
                            this.tip.show = true
                        })
                }, state.timeout)
            },
            /*获取热门搜索列表*/
            getSearchHot: function () {
                var state = this.$store.state
                var url = state.host + state.baseUrl + '/school/findHotSearchSchoolList'
                setTimeout(() => {
                    this.$http.get(url, {
                        emulateJSON: true
                    })
                        .then(res => {
                            if (res.data.code == '000000') {
                                this.searchHotArr = res.data.data
                            } else {
                                this.tip.options.content = res.data.message
                                this.tip.show = true
                            }

                        }, err => {
                            this.tip.options.content = '网络或系统繁忙...'
                            this.tip.show = true
                        })
                }, state.timeout)
            },
            /*点击历史搜索以及热门推荐结果，进行搜索并且将搜索条目保存到用户搜索记录*/
            handelResultClick: function (obj) {
                this.saveSearchHistory(obj)
                this.goAnchor(obj.name, 'anchor-' + obj.sCode)
            },
            /*保存用户搜索历史*/
            saveSearchHistory: function (obj) {
                var state = this.$store.state
                var url = state.host + state.baseUrl + '/school/saveSearchHistory'
                var data = {
                    userId: (localStorage.uid?localStorage.uid:''),
                    name: obj.name,
                    sCode: obj.sCode,
                    recruitType: obj.recruitType
                }
                setTimeout(() => {
                    this.$http.post(url, data, {
                        emulateJSON: true
                    })
                        .then(res => {
                            this.getSearchHistory()
                        }, err => {
                            this.tip.options.content = '网络或系统繁忙...'
                            this.tip.show = true
                        })
                }, state.timeout)
            },
            /*搜索跳转*/
            goAnchor: function (name, selector) {
                this.showSearchBox = false
                this.keyword = name
                this.$store.commit('CHANGE_SEARCHKEYWORD', selector)
                this.$router.push({
                    path: '/schList/all/0'
                })

            },
            /*搜索*/
            search: function () {
                if(!this.keyword){
                    this.showNoSearchResult=false;
                    this.searchResult=[];
                }else{
                    var state = this.$store.state
                    var url = state.host + state.baseUrl + '/school/findSearchSchoolList?name=' + this.keyword
                    setTimeout(() => {
                        this.$http.get(url, {
                            emulateJSON: true
                        })
                            .then(res => {
                                if (res.data.code == '000000') {
                                    if (res.data.data.length == 0) {
                                        this.showNoSearchResult = true
                                    } else {
                                        this.showNoSearchResult = false
                                        this.searchResult = res.data.data.splice(0, 5)
                                    }

                                } else {
                                    this.tip.options.content = res.data.message
                                    this.tip.show = true
                                }

                            }, err => {
                                this.tip.options.content = '网络或系统繁忙...'
                                this.tip.show = true
                            })
                    }, state.timeout)
                }

            },
            /*获取已关注数量*/
            getSubSchoolNum: function () {
                var state = this.$store.state
                var url = state.host + state.baseUrl + '/school/getSubSchoolNum?userId=' + (localStorage.uid?localStorage.uid:'')
                setTimeout(() => {
                    this.$http.get(url, {
                        emulateJSON: true
                    })
                        .then(res => {
                            if (res.data.code == '000000') {
                                this.$store.commit('CHANGE_COLLECTEDSCHNUM', res.data.data)
                            } else {
                                this.tip.options.content = res.data.message
                                this.tip.show = true
                            }

                        }, err => {
                            this.tip.options.content = '网络或系统繁忙...'
                            this.tip.show = true
                        })
                }, state.timeout)
            },
            /*获取全部城市*/
            getProvince: function () {
                var state = this.$store.state
                var url = state.host + state.baseUrl + '/common/findProvinceList'
                setTimeout(() => {
                    this.$http.get(url, {
                        emulateJSON: true
                    })
                        .then(res => {
                            this.provinceArr = res.data

                        }, err => {
                            this.tip.options.content = '网络或系统繁忙...'
                            this.tip.show = true
                        })
                }, state.timeout)
            },
            /*获取全部学校类型*/
            getSchoolTypeList: function () {
                var state = this.$store.state
                var url = state.host + state.baseUrl + '/common/findSchoolTypeList'
                setTimeout(() => {
                    this.$http.get(url, {
                        emulateJSON: true
                    })
                        .then(res => {
                            this.schoolTypeArr = res.data
                        }, err => {
                            this.tip.options.content = '网络或系统繁忙...'
                            this.tip.show = true
                        })
                }, state.timeout)
            },
            onResultChange: function () {
                this.tip.show = false
            }
        },
        mounted: function () {
            //获取搜索历史
            this.getSearchHistory()
            //获取热门搜索
            this.getSearchHot()
            //获取已关注数量
            this.getSubSchoolNum()
            //获取全部城市
            this.getProvince()
            //获取全部学校类型
            this.getSchoolTypeList()


            var state = this.$store.state;

//
//            var url = state.host + state.baseUrl + '/getJsSign'
//            var data = {
//                url: location.href
//            }
//            this.$http.post(url, data, {
//                emulateJSON: true
//            })
//                .then(res => {
//                    // console.log(res.data)
//                    var data = res.data
//                    alert('appId为：'+data.appId+' signature为：'+data.signature)
//                    wx.config({
//                        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//                        appId: data.appId, // 必填，公众号的唯一标识
//                        timestamp: data.timestamp, // 必填，生成签名的时间戳
//                        nonceStr: data.nonce, // 必填，生成签名的随机串
//                        signature: data.signature, // 必填，签名，见附录1
//                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'translateVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
//                    });
//
//
//                    wx.ready(function () {
//                        wx.onMenuShareTimeline({
//                            title: state.allSchoolInfo.name + '-' + '高校列表', // 分享标题
//                            //link: state.currentHref, // 分享链接
//                            imgUrl: state.imgHost + state.allSchoolInfo.schoolIcon, // 分享图标
//                            success: function () {
//                                // 用户确认分享后执行的回调函数
//                            },
//                            cancel: function () {
//                                // 用户取消分享后执行的回调函数
//                            }
//                        });
//
//                        wx.onMenuShareAppMessage({
//                            title: state.allSchoolInfo.name + '-' + '高校列表', // 分享标题
//                            desc: '高校列表', // 分享描述
////                desc:urlAddToken(window.location.href),
////                                link: state.currentHref, // 分享链接
//                            link: urlAddToken(window.location.href),
//                            imgUrl: state.imgHost + state.allSchoolInfo.schoolIcon, // 分享图标
//                            // type: 'music、video或link，不填默认为link', // 分享类型,music、video或link，不填默认为link
//                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
//                            success: function () {
//                                // 用户确认分享后执行的回调函数
//                            },
//                            cancel: function () {
//                                // 用户取消分享后执行的回调函数
//                            }
//                        });
//                    })
//                    wx.error(function (err) {
//                        // for (var i of Object.keys(err)) {
//                        //     alert(i + ' : ' + err[i])
//                        // }
//                    })
//                }, err => {
//                    console.log(err)
//                })

        },
        created() {
            document.title = '高校列表'


        }
    }
</script>
<style lang="scss" scoped>
    .move-enter, .move-leave-active {
        transform: translate3d(0, 100%, 0);
    }

    .move-enter-active, .move-leave-active {
        transition: all .3s;
    }
</style>
