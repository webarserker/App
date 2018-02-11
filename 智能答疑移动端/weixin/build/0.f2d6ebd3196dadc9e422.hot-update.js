webpackHotUpdate(0,{

/***/ 134:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// import $ from "../lib/jquery-1.11.3.js";


__webpack_require__(233);

var _vuex = __webpack_require__(5);

exports.default = {
    created: function created() {
        console.log(this.$store.state.subNavData);
        //            sessionStorage.setItem('threeCatName',(this.$store.state.subNavData.name?this.$store.state.subNavData.name:''));
    },

    computed: {
        subNavData: function subNavData() {
            return this.$store.state.subNavData;
        },
        flag: function flag() {
            return this.subNavData.length > 0;
        }
    },
    data: function data() {
        return {
            clickData: [],
            //                tapIndex: 0,
            subConData2: this.$store.state.subConData
        };
    },

    methods: _extends({
        tapAction: function tapAction(idx, name) {
            var _this2 = this;

            sessionStorage.setItem('threeCatName', name ? name : '');

            sessionStorage.setItem('tapIndex', idx);

            this.$parent.endFlag = false;
            this.$parent.curPage = 1;
            this.tapIndex = idx;
            this.$children[0].$refs.article_list.scrollTop = 0;
            // ajax请求 this.subConData
            var state = this.$store.state;
            this.$http.get(state.host + state.baseUrl + '/infoContent/getInfoContentlist?curPage=1&pageSize=20&catId=' + this.subNavData[idx].catId).then(function (res) {
                //                            this.CHANGE_SUBCONDATA(res.data.data);
                _this2.subConData2 = res.data.data;
                _this2.clickData = res.data.data;
                var _this = _this2;
                sessionStorage.setItem('subConData2', JSON.stringify(_this.subConData2));
            }, function (err) {
                console.log(err);
            });
        }
    }, (0, _vuex.mapActions)(['CHANGE_SUBCONDATA'])),
    components: {
        "v-subCon": __webpack_require__(287)
    },
    props: ['tapIndex', 'mySubConData2']
    //        mounted:function(){
    //            this.tapIndex = 0
    //        }
};

/***/ })

})
//# sourceMappingURL=0.f2d6ebd3196dadc9e422.hot-update.js.map