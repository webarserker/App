<template>

</template>
<script>
    export default {
        data(){
          return {
              newsList:[],
              newsCatId:'',
          }
        },
        created() {
            this.$http.get(this.$store.state.host + this.$store.state.baseUrl + '/infoContent/commonQuery?sCode=' + this.$store.state.scode + '&icontentType=-2&catSize=1&infoSize=3')
                .then(res => {
                    console.log(res);
                    this.newsList=res.data.data[0].children;
                    this.newsCatId = res.data.data[0].catId
                })
        },
        methods:{
            getMonthAndDay: function(date) {
                var time = new Date(parseInt(date))
                var m = time.getMonth() + 1
                var d = time.getDate()
                return (m > 9 ? m : '0' + m) + '.' + (d > 9 ? d : '0' + d);
            },
            getYear: function(date) {
                return (new Date(parseInt(date))).getFullYear();
            },
        }

    }
</script>
<style lang="scss" scoped>
    @import 'css/common_v3';


</style>