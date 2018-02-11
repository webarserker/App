<template>
    <div v-if="sData" class="info">
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">专业名称</h3>
        <div class="school">
            <p>
                <span v-text="sData.name?sData.name:'暂无'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">所属院系</h3>
        <div class="school">
            <p>
                <span v-text="sData.departName?sData.departName:'暂无'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">学制</h3>
        <div class="school">
            <p>
                <span v-text="sData.schoolYear?sData.schoolYear:'暂无'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">授予学位</h3>
        <div class="school">
            <p>
                <span v-text="sData.degree?sData.degree:'暂无'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">学费标准</h3>
        <div class="school">
            <p>
                <span v-text="sData.tuitionStandard?sData.tuitionStandard:'暂无'"></span>
            </p>
        </div>
        <h3 v-if="showProp(sData.showConfig, 'showFeature')"
            :style="{background: $store.state.themeColor,color:'#fff'}">专业特色</h3>
        <div v-if="showProp(sData.showConfig, 'showFeature')" class="school">
            <p>
                <span v-html="sData.feature?sData.feature:'暂无'"></span>
            </p>
        </div>
        <h3 v-if="showProp(sData.showConfig, 'showMainSubject')"
            :style="{background: $store.state.themeColor,color:'#fff'}">主要学科</h3>
        <div v-if="showProp(sData.showConfig, 'showMainSubject')" class="school">
            <p>
                <span v-html="sData.mainSubject?sData.mainSubject:'暂无'"></span>
            </p>
        </div>
        <h3 v-if="showProp(sData.showConfig, 'showTarget')" :style="{background: $store.state.themeColor,color:'#fff'}">
            培养目标</h3>
        <div v-if="showProp(sData.showConfig, 'showTarget')" class="school">
            <p>
                <span v-html="sData.target?sData.target:'暂无'"></span>
            </p>
        </div>
        <h3 v-if="showProp(sData.showConfig, 'showTrainCondition')"
            :style="{background: $store.state.themeColor,color:'#fff'}">培养要求</h3>
        <div v-if="showProp(sData.showConfig, 'showTrainCondition')" class="school">
            <p>
                <span v-html="sData.trainCondition?sData.trainCondition:'暂无'"></span>
            </p>
        </div>
        <h3 v-if="showProp(sData.showConfig, 'showMainClass')"
            :style="{background: $store.state.themeColor,color:'#fff'}">核心课程</h3>
        <div v-if="showProp(sData.showConfig, 'showMainClass')" class="school">
            <p>
                <span v-html="sData.mainClass?sData.mainClass:'暂无'"></span>
            </p>
        </div>
        <h3 v-if="showProp(sData.showConfig, 'showWorkInfo')"
            :style="{background: $store.state.themeColor,color:'#fff'}">就业历史</h3>
        <div v-if="showProp(sData.showConfig, 'showWorkInfo')" class="school">
            <p>
                <span v-html="sData.workInfo?sData.workInfo:'暂无'"></span>
            </p>
        </div>
        <h3 v-if="showProp(sData.showConfig, 'showWorkOutlook')"
            :style="{background: $store.state.themeColor,color:'#fff'}">就业前景</h3>
        <div v-if="showProp(sData.showConfig, 'showWorkOutlook')" class="school">
            <p>
                <span v-html="sData.workOutlook?sData.workOutlook:'暂无'"></span>
            </p>
        </div>
        <h3 v-if="showProp(sData.showConfig, 'showWorkDir')"
            :style="{background: $store.state.themeColor,color:'#fff'}">就业去向</h3>
        <div v-if="showProp(sData.showConfig, 'showWorkDir')" class="school">
            <p>
                <span v-html="sData.workDir?sData.workDir:'暂无'"></span>
            </p>
        </div>
        <h3 v-if="showProp(sData.showConfig, 'showResearchDir')"
            :style="{background: $store.state.themeColor,color:'#fff'}">研究方向</h3>
        <div v-if="showProp(sData.showConfig, 'showResearchDir')" class="school">
            <p>
                <span v-html="sData.researchDir?sData.researchDir:'暂无'"></span>
            </p>
        </div>
        <h3 v-if="showProp(sData.showConfig, 'showTutor')" :style="{background: $store.state.themeColor,color:'#fff'}">
            导师</h3>
        <div v-if="showProp(sData.showConfig, 'showTutor')" class="school">
            <p>
                <span v-html="sData.tutor?sData.tutor:'暂无'"></span>
            </p>
        </div>
        <h3 v-if="showProp(sData.showConfig, 'showEnrollment')"
            :style="{background: $store.state.themeColor,color:'#fff'}">招生人数</h3>
        <div v-if="showProp(sData.showConfig, 'showEnrollment')" class="school">
            <p>
                <span v-html="sData.enrollment?sData.enrollment:'暂无'"></span>
            </p>
        </div>
        <h3 v-if="showProp(sData.showConfig, 'showMarxTheoryCourse')"
            :style="{background: $store.state.themeColor,color:'#fff'}">马克思主义理论课</h3>
        <div v-if="showProp(sData.showConfig, 'showMarxTheoryCourse')" class="school">
            <p>
                <span v-html="sData.marxTheoryCourse?sData.marxTheoryCourse:'暂无'"></span>
            </p>
        </div>
        <h3 v-if="showProp(sData.showConfig, 'showForeignLan')"
            :style="{background: $store.state.themeColor,color:'#fff'}">外语</h3>
        <div v-if="showProp(sData.showConfig, 'showForeignLan')" class="school">
            <p>
                <span v-html="sData.foreignLan?sData.foreignLan:'暂无'"></span>
            </p>
        </div>
        <h3 v-if="showProp(sData.showConfig, 'showBusinessCourse1')"
            :style="{background: $store.state.themeColor,color:'#fff'}">业务课考试科目一</h3>
        <div v-if="showProp(sData.showConfig, 'showBusinessCourse1')" class="school">
            <p>
                <span v-html="sData.businessCourse1?sData.businessCourse1:'暂无'"></span>
            </p>
        </div>
        <h3 v-if="showProp(sData.showConfig, 'showBusinessCourse2')"
            :style="{background: $store.state.themeColor,color:'#fff'}">业务课考试科目二</h3>
        <div v-if="showProp(sData.showConfig, 'showBusinessCourse2')" class="school">
            <p>
                <span v-html="sData.businessCourse2?sData.businessCourse2:'暂无'"></span>
            </p>
        </div>
        <h3 v-if="showProp(sData.showConfig, 'showRemarks')"
            :style="{background: $store.state.themeColor,color:'#fff'}">备注</h3>
        <div v-if="showProp(sData.showConfig, 'showRemarks')" class="school">
            <p>
                <span v-html="sData.remarks?sData.remarks:'暂无'"></span>
            </p>
        </div>
        <h3 v-if="showProp(sData.showConfig, 'showBibliography')"
            :style="{background: $store.state.themeColor,color:'#fff'}">参考书目</h3>
        <div v-if="showProp(sData.showConfig, 'showBibliography')" class="school">
            <p>
                <span v-html="sData.bibliography?sData.bibliography:'暂无'"></span>
            </p>
        </div>
        <loading-img></loading-img>
    </div>
</template>
<script type="text/javascript">
    import loadingImg from './loadingImg2.vue'
    export default {
        components:{loadingImg},
        data() {
            return {
                sData: null,
            }
        },
        methods: {

            showProp: function (config, propName) {
                var configJson = JSON.parse(config);
                if (configJson[propName] != null && configJson[propName] == '1') {
                    return true;
                } else {
                    return false;
                }
            }
        },
        created() {
            var state = this.$store.state
            var url = state.host + state.baseUrl + '/majorDetail?majorId=' + this.tid
            this.$http.get(url)
                .then(res => {
                    console.log(res.data)
                    this.$emit('getViewTimes',res.data.viewTimes);
                    this.sData = res.data
                })
        },
        updated(){
////            var windowWidth=parseInt(window.innerWidth);
//            var imgs=document.getElementsByClassName('info')[0].getElementsByTagName('img');
//            for(let i=0;i<imgs.length;i++){
//                imgs[i].style.maxWidth='100%';
////                imgs[i].style.height='auto';
////                imgs[i].style.align = 'center';
//            }
        },
        props: ['tid','infoId']
    }
</script>
<style lang="scss" scoped>
    @import "../css/common.scss";
    span {
        font-size: pxToRem(32) !important;
    }
    .info {

        h3,
        p {
            padding: pxToRem(10) pxToRem(40);
            font-size: pxToRem(32);
            border-bottom: pxToRem(1) solid #ddd;
            overflow: hidden;
            &:nth-of-type(2n) {
                background: #f1f1f1;
            }
            span {
                font-size: pxToRem(32) !important;
                float: left;
                display: block;
            }
        }
        .school {
            p {
                span:first-child {
                    /*width: 90%;*/
                    font-size: pxToRem(32) !important;
                    width: 100%;
                    // margin-right: pxToRem(20);
                }
                // span:last-child {
                //     width: 60%;
                // }
            }
        }
        .tData {
            p {
                span:first-child {
                    width: 90%;
                    // margin-right: pxToRem(30);
                }
                // span:last-child {
                //     width: 20%;
                // }
            }
        }
    }
</style>
