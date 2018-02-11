<template>
    <div :class="'article_list '+top" v-scroll="scrollHandle" ref="article_list">
        <div class="article_link" v-for="(x,idx) in subConData2" @click="gotoDetail(x.contentLink,x.infoId)">
            <span v-text="x.title"></span>
            <i class="iconfont comicon-28"></i>
        </div>
        <v-loading v-show="ajaxFlag" :endFlag="endFlag"></v-loading>
    </div>
</template>
<script type="text/javascript">
export default {
    data(){
        return{

        }
    },
    computed: {
        top: function() {
            return this.flag ? 'top1':'top2'
        },
        endFlag:function(){
            return this.$parent.$parent.endFlag
        },
        ajaxFlag:function(){
            return this.$parent.$parent.ajaxFlag
        }
    },
    props: ['flag','subConData2'],
    methods: {
        scrollHandle: function(e) {
            var h = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight
            if (h < 10 && !this.endFlag && !this.ajaxFlag) {
                this.$parent.$parent.curPage += 1;
            }
        },
        gotoDetail:function(link,id){
            if(link){
                window.location.href=link;
            }else{
                var threeCatName=sessionStorage.getItem('threeCatName');
                sessionStorage.setItem('threeCatNameToBread',threeCatName);
                this.$router.push('/articleDetail?infoId='+id+'&catId='+this.$parent.$parent.articleListCatId)
            }
        }
    },
    components: {
        "v-loading": require('../component/Loading.vue')
    },
}
</script>
