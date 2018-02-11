<template>
    <div v-if="sData" class="introduce">
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">院系名称</h3>
        <div class="school">
            <p>
                <span v-text="sData.departmentName?sData.departmentName:'暂无'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">院系官网</h3>
        <div class="school">
            <p>
                <span v-text="sData.officialWebsite?sData.officialWebsite:'暂无'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">开设专业</h3>
        <div class="school  hasTable">
            <div class="scroll-wrap">
                <table class="table1">
                    <thead>
                    <tr class="fixTop">
                        <th width="40%" :style="{background: $store.state.themeColor,color:'#fff'}">专业名称</th>
                        <th width="30%" :style="{background: $store.state.themeColor,color:'#fff'}">招生计划</th>
                        <th width="30%" :style="{background: $store.state.themeColor,color:'#fff'}">历史录取</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="x of rList">
                        <td width="40%" v-text="x.name?x.name:noneData"
                            @click="$router.push('/articleDetail2?specType=0&tid='+x.id+'&name='+x.name)"></td>
                        <td width="30%" @click="$emit('changeSpecType',8)">详情</td>
                        <td width="30%" @click="$emit('changeSpecType',11)">详情</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">院系介绍</h3>
        <div class="school yuanxijieshao">
            <p>
                <span v-html="sData.depDescribe?sData.depDescribe:'暂无'"></span>
            </p>
        </div>
        <h3 :style="{background: $store.state.themeColor,color:'#fff'}">备注</h3>
        <div class="school">
            <p>
                <span v-html="sData.remark?sData.remark:'暂无'"></span>
            </p>
        </div>
        <loading-img></loading-img>
    </div>
</template>
<script>
    import loadingImg from './loadingImg2.vue'

    export default {
        components: {loadingImg},
        data() {
            return {
                noneData: '-',
                sData: [],
                rList: []
            }
        },
        computed: {},
        props: ['sId'],
        created() {
            var state = this.$store.state
            this.$http.get(state.host + state.baseUrl + '/department/findDepartmentDetail?departmentId=' + this.sId)
                .then((res) => {
                    this.sData = res.data.data;
                    this.rList = res.data.data.mojorList;
                    console.log(this.sData);
                    console.log(this.rList);
                })
        },
        updated() {
            var u = navigator.userAgent;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (!isiOS) {
                var imgs = document.getElementsByClassName('introduce')[0].getElementsByTagName('img');
                if (imgs.length) {
                    for (let i = 0; i < imgs.length; i++) {
                        imgs[i].style.maxWidth = '100%';
//                        imgs[i].style.height = 'auto';
                        //imgs[i].style.align = 'center';
                    }
                }
                var iframes = document.getElementsByClassName('introduce')[0].getElementsByTagName('iframe');
                if (iframes.length) {
                    for (let i = 0; i < iframes.length; i++) {
                        iframes[i].style.maxWidth = '100%';
                        imgs[i].style.align = 'center';
                    }
                }
            } else {
                var spans = document.getElementsByClassName('introduce')[0].getElementsByTagName('span');
                if (spans.length) {
                    for (let i = 0; i < spans.length; i++) {
                        spans[i].style.fontSize = 14 / 32 + 'rem';
                    }
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../css/common.scss";

    span {
        font-size: pxToRem(32) !important;
    }

    .introduce {

        span {
            font-size: pxToRem(32) !important;
        }
        h3,
        p {
            padding: pxToRem(10) pxToRem(40);
            font-size: pxToRem(32) !important;
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
                    width: 100%;
                }
                span {
                    font-size: pxToRem(32) !important;
                }
            }

            &.hasTable {
                padding: pxToRem(40);
                .scroll-wrap {
                    width: 100%;
                    overflow-x: scroll;
                    border-bottom: 1px solid #ddd;
                    .table1 {
                        width: 100%;
                        thead {
                            th {
                                text-align: center;
                                padding: pxToRem(12) pxToRem(20);
                                font-weight: normal;
                                border: 1px solid #eee;
                                font-size: pxToRem(28);
                            }
                        }
                        tbody {
                            td {
                                text-align: center;
                                border: 1px solid #ddd;
                                padding: pxToRem(12) pxToRem(20);
                                font-size: pxToRem(28);
                                &.row-span {
                                    border: 1px solid #fff;
                                }
                                &.underline {
                                    text-decoration: underline;
                                }
                            }
                        }
                    }

                }
            }

        }
    }
</style>
