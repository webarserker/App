<template>

</template>
<script>
    export default {
        data() {
            return {

            }
        },
        created() {
            var userId = ''
            var login = '&login=' + false
            localStorage.setItem(this.infoId, this.infoId)
            if ((localStorage.user && JSON.parse(localStorage.user).sCode == this.$store.state.scode) || this.$store.state.isLogin) {
                userId = '&userId=' + JSON.parse(localStorage.user).id
                login = '&login=' + true
            }
            this.$http.get(this.$store.state.host + this.$store.state.baseUrl + '/index/getBaseInfo?sCode=' + this.$store.state.scode + userId + login)
                .then(res => {
                    this.video = res.data.data.video;
                })
        },
        methods: {
            bannerClick: function(link) {
                if(link.substr(0, 4) != 'http') {
                    link = this.$store.state.imgHost + link;
                }
                location.href = link
            },
        }
    }
</script>
<style lang="scss" scoped>
    @import 'css/common_v3';
    *{
        box-sizing:border-box;
    }

</style>