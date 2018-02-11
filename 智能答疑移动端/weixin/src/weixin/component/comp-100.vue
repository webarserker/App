<template>
    <div class="introduce">
        <ul>
            <li>
                <span class="label">院系名称：</span>
                <p>英语学院</p>
            </li>
            <li>
                <span class="label">院系官网：</span>
                <p>www.baidu.com</p>
            </li>
            <li>
                <p class="label"></p>
                <div class="table-scroll">
                    <table>
                        <thead>
                        <tr>
                            <th>专业名称</th>
                            <th>学制</th>
                            <th>授予学位</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>机械设计制造及其自动化</th>
                            <th>4年</th>
                            <th>文学学士</th>
                        </tr>
                        <tr>
                            <th>商务英语</th>
                            <th>4年</th>
                            <th>文学学士</th>
                        </tr>
                        <tr>
                            <th>翻译</th>
                            <th>4年</th>
                            <th>文学学士</th>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </li>
        </ul>
        <div>
            <p class="label">院系介绍：</p>
            <div class="introduce-detail">详细的院系介绍详细的院系介绍详细的院系介绍</div>
        </div>
    </div>
</template>
<script>
    export default{}
</script>
<style lang="scss" scoped>
    @import "../css/common.scss";

    * {
        box-sizing: border-box;
    }

    .introduce {
        padding: pxToRem(30) pxToRem(40);
        div{
            p{
                font-size:pxToRem(28);
            }
        }
        ul {
            li {
                margin-bottom: pxToRem(40);
                display: flex;
                span.label {
                    width:pxToRem(160);
                    font-size:pxToRem(28);
                }
                p{
                    flex:1;
                    font-size:pxToRem(28);
                }
                div.table-scroll{
                    width:100%;
                    overflow-x:scroll;
                    table{
                        thead{
                            tr{
                                background:#dfe5f1;
                            }
                        }
                        tbody{
                            tr:nth-child(odd){
                                background:#f7f9fd;
                            }
                        }
                        min-width:100%;
                        th,td{
                            width:33.3%;
                            text-align:center;
                            height:pxToRem(70);
                            line-height:pxToRem(70);
                            font-size:pxToRem(26);
                            border:1px solid #d2d2d2;
                        }
                    }
                }
            }
        }
    }
</style>