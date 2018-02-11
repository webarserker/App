<template>
    <div v-if="sData" class="info">
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">专业名称</h3>
        <div class="school">
            <p>
                <span v-text="sData.majorName?sData.majorName:'暂无'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">专业代码</h3>
        <div class="school">
            <p>
                <span v-text="sData.majorCode?sData.majorCode:'暂无'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">所属院系</h3>
        <div class="school">
            <p>
                <span v-text="sData.department?sData.department:'暂无'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">指导老师</h3>
        <div class="school">
            <p>
                <span v-html="sData.mentors?sData.mentors:'暂无'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">类别</h3>
        <div class="school">
            <p>
                <span v-text="sData.typeStr?sData.typeStr:'暂无'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">拟招人数</h3>
        <div class="school">
            <p>
                <span v-html="sData.enrollPlanNum?sData.enrollPlanNum:'暂无'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">推免</h3>
        <div class="school">
            <p>
                <span v-html="sData.recommendNoTest?sData.recommendNoTest:'暂无'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">研究方向简介</h3>
        <div class="school">
            <p>
                <span v-html="sData.summary?sData.summary:'暂无'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">初试科目</h3>
        <div class="school">
            <p>
                <span v-html="sData.preTestSubject?sData.preTestSubject:'暂无'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">复试科目</h3>
        <div class="school">
            <p>
                <span v-html="sData.reTestSubject?sData.reTestSubject:'暂无'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">加试科目</h3>
        <div class="school">
            <p>
                <span v-html="sData.addTestSubject?sData.addTestSubject:'暂无'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">复试方案</h3>
        <div class="school">
            <p>
                <span v-html="sData.preTestPlan?sData.preTestPlan:'暂无'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">备注</h3>
        <div class="school">
            <p>
                <span v-html="sData.remark?sData.remark:'暂无'"></span>
            </p>
        </div>
    </div>
</template>
<script type="text/javascript">
    export default {
        data() {
            return {
                sData: null,
            }
        },
        created() {
            var state = this.$store.state
            var url = state.host + state.baseUrl + '/getMajorResearchDetail?id=' + this.id
            this.$http.get(url)
                .then(res => {
                    console.log(res.data)
                    this.secondCatName = '研究方向>>' + res.data.name;
                    this.sData = res.data
                })
        },
        props: ['id']
    }
</script>
<style lang="scss" scoped>
    @import "../css/common.scss";

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
                float: left;
                display: block;
            }
        }
        .school {
            p {
                span:first-child {
                    width: 90%;
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
