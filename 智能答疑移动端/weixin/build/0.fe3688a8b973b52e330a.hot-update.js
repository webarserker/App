webpackHotUpdate(0,{

/***/ 142:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _loadingImg = __webpack_require__(11);

var _loadingImg2 = _interopRequireDefault(_loadingImg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//    import $ from '../lib/jquery-1.11.3.js';

var translateXFlag = false; //
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

var x = 0;
var translateX = 0;
var translateXFlag2 = false;
var x2 = 0;
var translateX2 = 0;
exports.default = {
    components: { loadingImg: _loadingImg2.default },
    data: function data() {
        return {
            noneData: '-', //此处为新增
            picksFlag: false,
            tableFlag: false,
            barFlag: false,
            lineFlag: false,
            title_idx: this.$store.state.scode == 'NLGYFE' ? 1 : 0,
            table_idx: this.$store.state.scode == 'NLGYFE' ? 1 : 0,
            // x:0,
            // translateX:0,
            // translateXFlag:false,
            tx: 0,
            pick_items: null,
            city: '',
            science: '',
            year: '',
            etype: '',
            batch: '',
            major: '',
            yDataList: null,
            url: this.$store.state.scode == 'NLGYFE' ? this.$store.state.host + this.$store.state.baseUrl + '/findEnrollPlanDetail' : this.$store.state.host + this.$store.state.baseUrl + '/findEnrollPlan'
        };
    },

    computed: {
        yData: function yData() {
            return {
                sCode: this.$store.state.scode,
                year: this.year,
                needPage: false,
                cityName: this.city,
                enrollType: this.etype == '全部' ? '' : this.etype,
                science: this.science == '' ? '全部' : this.science,
                batch: this.batch == '全部' ? '' : this.batch,
                majorName: this.title_idx == 1 ? this.major : ''
            };
        }
    },
    watch: {
        yData: function yData() {
            this.getYData();
            translateX = 0;
        },
        url: function url() {
            this.getYData();
            translateX = 0;
        }
    },
    methods: {
        touchstart: function touchstart(e) {
            translateXFlag = true;
            x = -translateX + e.targetTouches[0].clientX;
        },
        touchmove: function touchmove(e) {
            if (translateXFlag) {
                var w = parseInt(this.$refs.tright.offsetWidth) - parseInt(this.$refs.tmain.offsetWidth);
                if (e.targetTouches[0].clientX - x > 0 || e.targetTouches[0].clientX - x < w) return;
                translateX = e.targetTouches[0].clientX - x;
                // console.log(translateX,w)
                // console.log(this.$refs.tmain.style.transform)
                this.$refs.tmain.style.transform = 'translateX(' + translateX + 'px)';
                this.$refs.smain.style.transform = 'translateX(' + translateX + 'px)';
            }
        },
        touchend: function touchend(e) {
            translateXFlag = false;
        },
        touchstart2: function touchstart2(e) {
            translateXFlag2 = true;
            x2 = -translateX2 + e.targetTouches[0].clientY;
        },
        touchmove2: function touchmove2(e) {
            if (translateXFlag2) {
                // if (e.targetTouches[0].clientY - x2 > 0 || e.targetTouches[0].clientY - x2 < -(1500/64*parseInt(document.documentElement.style.fontSize))) return;
                if (e.targetTouches[0].clientY - x2 > 0 || e.targetTouches[0].clientY - x2 < -this.$refs.tbody.offsetHeight * 0.9) return;
                translateX2 = e.targetTouches[0].clientY - x2;
                // console.log(translateX,w)
                // console.log(this.$refs.tmain.style.transform)
                this.$refs.tbody.style.transform = 'translateY(' + translateX2 + 'px)';
            }
        },
        touchend2: function touchend2(e) {
            translateXFlag2 = false;
        },
        getYData: function getYData() {
            var _this = this;

            this.$http.post(this.url, this.yData, {
                emulateJSON: true
            }).then(function (res) {
                _this.yDataList = res.data.data;
            });
        }
    },
    mounted: function mounted() {
        var _this2 = this;

        var state = this.$store.state;
        var url = state.host + state.baseUrl + '/enrollPlan?scode=' + state.scode;
        this.$http.get(url).then(function (res) {
            _this2.pick_items = res.data;
            _this2.city = res.data.cityList[0].name;
            //                    this.science = res.data.scienceList[0]
            _this2.science = '全部';
            _this2.year = res.data.yearList[0];
            //this.etype = res.data.typeList[0]
            //this.batch = res.data.batchList[0]
            //this.major = res.data.majorList[0]
            _this2.etype = '全部';
            _this2.batch = '全部';
            _this2.major = '';
        });

        this.getYData();
        console.log(this.yDataList);
    },

    props: ['infoId']
};

/***/ })

})
//# sourceMappingURL=0.fe3688a8b973b52e330a.hot-update.js.map