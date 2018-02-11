<template>

</template>
<script>
export default{
    data(){
        return {

        }
    },
    created(){
//        var userId='';
//        if ((localStorage.user && JSON.parse(localStorage.user).sCode == this.$store.state.scode) || this.$store.state.isLogin) {
//            userId = '&userId=' + JSON.parse(localStorage.user).id
//        }
//        this.$http.get(this.$store.state.host + this.$store.state.baseUrl + '/index/noticeList?sCode=' + this.$store.state.scode + userId)
//            .then(res => {
//                this.noticeList = res.data.data
//            }, err => {
//                console.log(err)
//            })
    },
    methods:{
//        getMonthAndDay: function(date) {
//            var time = new Date(parseInt(date))
//            var m = time.getMonth() + 1
//            var d = time.getDate()
//            return (m > 9 ? m : '0' + m) + '.' + (d > 9 ? d : '0' + d);
//        },
//        getYear: function(date) {
//            return (new Date(parseInt(date))).getFullYear();
//        },
    }
}
</script>
<style lang="scss" scoped>
    @import 'css/common_v3';

    .noticeBoard{
        background-color:#fff;
        padding:pxToRem(30);
        .see-more{
            height:pxToRem(70);
            color:#666;
            line-height:pxToRem(70);
            text-align:center;
        }
        ul{
            &>li{
                padding:pxToRem(20) 0;
                border-bottom:1px solid #eee;
                display:flex;
                .img-container{
                    width:pxToRem(250);
                    height:pxToRem(150);
                    img{
                        width:100%;
                        height:100%;
                    }
                }
                .text-container{
                    flex:1;
                    display:flex;
                    position:relative;
                    padding-left:pxToRem(25);
                    &.noImg{
                        padding-left:0;
                        padding-bottom:pxToRem(50);
                    }
                    i{
                        &:before{
                            color:#FE985A;
                        }
                        padding-right:3px;
                        padding-top:pxToRem(6);
                        font-size:pxToRem(30);
                    }
                    .title{
                        /*flex:1;*/
                        font-size:pxToRem(26);

                        line-height:1.5;
                        height:pxToRem(78);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;

                    }
                    .release-time{
                        position:absolute;
                        right:0;
                        bottom:0;
                        span{
                            color:#fff;
                            padding:0 pxToRem(5);
                            border-radius:pxToRem(4);
                            font-size:pxToRem(24);
                            &:last-child{
                                opacity:.6;
                            }
                        }
                    }
                }
            }
        }
    }
</style>