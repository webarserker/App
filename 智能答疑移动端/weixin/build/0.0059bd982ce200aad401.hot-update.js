webpackHotUpdate(0,{

/***/ 133:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//
//
//
//
//
//
//

exports.default = {
    data: function data() {
        return {};
    },

    computed: {
        top: function top() {
            return this.flag ? 'top1' : 'top2';
        },
        endFlag: function endFlag() {
            return this.$parent.$parent.endFlag;
        },
        ajaxFlag: function ajaxFlag() {
            return this.$parent.$parent.ajaxFlag;
        }
    },
    props: ['flag', 'subConData2'],
    methods: {
        scrollHandle: function scrollHandle(e) {
            var h = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight;
            if (h < 10 && !this.endFlag && !this.ajaxFlag) {
                this.$parent.$parent.curPage += 1;
            }
        },
        gotoDetail: function gotoDetail(link, id) {
            if (link) {
                window.location.href = link;
            } else {
                var threeCatName = sessionStorage.getItem('threeCatName');
                sessionStorage.setItem('threeCatNameToBread', threeCatName);
                this.$router.push('/articleDetail?infoId=' + id + '&catId=' + this.$parent.$parent.articleListCatId);
            }
        }
    },
    components: {
        "v-loading": __webpack_require__(7)
    }
};

/***/ })

})
//# sourceMappingURL=0.0059bd982ce200aad401.hot-update.js.map