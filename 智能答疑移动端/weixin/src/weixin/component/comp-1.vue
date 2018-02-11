<template>
    <div class="info">
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">基本信息</h3>
        <div v-if="sData" class="school">
            <p>
                <span>学校类型</span>
                <span v-text="sData.school.type"></span>
            </p>
            <p>
                <span>隶属部门</span>
                <span v-text="sData.school.belongDepart"></span>
            </p>
            <p>
                <span>办学性质</span>
                <span v-text="sData.school.property"></span>
            </p>
            <p>
                <span>建设平台</span>
                <span v-text="sData.school.platform"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">师资力量</h3>
        <div v-if="tData" class="tData">
            <p v-for="x of tData.teacher">
                <span v-text="x.title"></span>
                <span v-text="x.number+'人'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">学生规模</h3>
        <div v-if="tData" class="tData">
            <p v-for="x of tData.student">
                <span v-text="x.title"></span>
                <span v-text="x.number+'余人'"></span>
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
                tData: null
            }
        },
        created() {
            var state = this.$store.state
            var url = state.host + state.baseUrl + '/getSchoolInfoByCode?scode=' + state.scode
            var url2 = state.host + state.baseUrl + '/schoolInfo?scode=' + state.scode
            this.$http.get(url)
                .then(res => {
                    this.sData = res.data
                })
            this.$http.get(url2)
                .then(res => {
                    // console.log(res.data)
                    this.tData = res.data
                    console.log(this.tData);
                })
        },
        props: ['infoId']
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
                    width: 30%;
                    margin-right: pxToRem(20);
                }
                span:last-child {
                    width: 60%;
                }
            }
        }
        .tData {
            p {
                span:first-child {
                    width: 69%;
                    margin-right: 5%;
                }
                span:last-child {
                    width: 26%;
                }
            }
        }
    }
</style>
