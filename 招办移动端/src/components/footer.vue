<template>
  <div class="footer">
    <ul>
      <li v-for="(item,index) in entryList" :class="{active:index==entryIndex}" @click="entryToIt(index)">
        <div>
          <i :class="item.icon"></i>
          <p>{{item.title}}</p>
          <span class="red" v-show="Number(entryRedList[index])"></span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  export default{
    props: {
      entryIndex: {
        default: 0
      }
    },
    mounted(){

    },
    computed: {
//      entryIndex() {
//        return this.$store.state.entryIndex;
//      },
      entryRedList() {
        return [this.$store.state.contentNotReadNum, this.$store.state.answerNotReadNum, this.$store.state.questionNotReadNum]
      }
    },
    data(){
      return {
//        hasNotRead: [],
        entryList: [
          {
            "title": "内容审核",
            "icon": "icon-neirong"
          },
          {
            "title": "答疑审核",
            "icon": "icon-dayi"
          },
          {
            "title": "快捷答疑",
            "icon": "icon-kuaijie"
          },
          {
            "title": "其他",
            "icon": "icon-qita"
          }
        ]
      }
    },
    methods: {
      entryToIt(index){
        sessionStorage.setItem('zb_entryIndex', index);
        this.$store.commit('SET_ENTRY_INDEX', index);
        this.$router.push({
          'path': `/home/contentList${index + 1}`
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../common/css/variable";

  .footer {
    width: 100%;
    z-index: 600;
    background: #eee;
    position: fixed;
    bottom: 0;
    left: 0;
    height: .46rem;
    ul {
      overflow: hidden;
      li {
        float: left;
        width: 25%;
        height: .46rem;
        display: flex;
        justify-content: center;
        text-align: center;
        align-items: center;
        color: #333;
        position: relative;
        &.active {
          background: @theme;
          color: #fff;
        }
        i {
          font-size: .18rem;
        }
        p {
          margin-top: .04rem;
        }
        span.red {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #e15b53;
          right: 25%;
          top: .05rem;
        }
      }
    }
  }
</style>
