<template>

  <div class="slideMenu" id="sliderMenu">
    <div class="current-container">
      <div class="current" :class="{'active':showMenuList}" @click="showMenuList=!showMenuList">
        <slot></slot>
        <!--<span>{{parentCatName}}</span>-->
        <i class="icon-xiajiantou"></i>
        <p class="bottom-line"></p>
      </div>
    </div>
    <div class="slideMenu-flag" v-show="showMenuList" @click.stop="toggle($event)">
      <transition name="move">
        <div class="slide-list" v-show="showMenuList">
          <ul class="first">
            <li v-for="(item,index) in menuList" @click="leftCurrentIndex=item.id;getCurrentSecondList(item.childCat)"
                :class="['li'+index,{'active':item.id==leftCurrentIndex}]">
              <i :class="item.icon"></i>
              <span>{{item.name}}</span>
            </li>
            <li :class="{'active':leftCurrentIndex==0}"
                @click="leftCurrentIndex=0;getCurrentSecondList(contentTypeList)">
              <i class="icon-tongzhi"></i>
              <span>通知及公告</span>
            </li>
          </ul>
          <ul class="second">
            <div class="secondNoneData" v-if="currentSecondList.length==0">
              暂无内容
            </div>

            <li v-if="leftCurrentIndex!=0&&currentSecondList.length!=0&&item.status"
                v-for="(item,index) in currentSecondList"
                :class="{'active':item.id==rightCurrentIndex,'another-active':item.id==currentCatId}"
                @click="jump(item.id)">
              <span>{{item.name}}</span>
            </li>
            <li v-if="leftCurrentIndex==0" v-for="(item,index) in currentSecondList"
                :class="{'active':item.contentType==rightCurrentIndex}" @click="jumpContentType(item.contentType)">
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
  export default {
    watch: {
      '$route'(to, from) {
        this.showMenuList = false;
        this.leftCurrentIndex = this.$route.query.parentId ? this.$route.query.parentId : 0;
        if (this.$route.query.parentId) {
          this.$http.get(this.$store.state.host + '/front/findCatListByCatId' + '?parentCatId=' + this.$route.query.parentId + '&userId=' + localStorage.fuserid).then(res => {
            res = res.body;
            this.currentSecondList = res.data.page.data;
          })
        } else {
          this.currentSecondList = this.contentTypeList;
        }
      }
    },
    props: {
      parentCatName: {
        type: String,
        default: ''
      },
      pShowMenu: {
        type: Boolean,
        default: false
      },
      currentCatId: {
        type: Number,
        default: -1
      }
    },
    methods: {
      jump(id) {
        this.showMenuList = false;
        if (id == this.$route.query.catId) {
          this.showMenuList = false;
        }
        this.rightCurrentIndex = id;
        this.$router.push({name: 'ArticleList', query: {parentId: this.leftCurrentIndex, catId: id}})
      },
      jumpContentType(contentType) {
        this.showMenuList = false;
        if (contentType == this.$route.query.contentType) {
          this.showMenuList = false;
        }
        this.rightCurrentIndex = contentType;
        this.$router.push({name: 'ArticleListByType', query: {contentType: contentType}})
      },
      toggle(e) {
        if (e.target.className == 'slideMenu-flag') {
          this.showMenuList = false;
        }
      },
      getCurrentSecondList(array) {
        this.currentSecondList = array;
      }
    },
    created() {
      var state = this.$store.state;
      this.$http.get(state.host + '/front/navigator' + '?userId=' + localStorage.fuserid).then(res => {
        res = res.body;
        if (res.code = '000000') {
          let data = res.data;
          data = data.filter((value, index, array) => {
            return value.contentType != 2 && value.contentType != 6;
          })
          this.menuList = data;
        }
      })
      if (this.$route.query.parentId) {
        this.$http.get(state.host + '/front/findCatListByCatId' + '?parentCatId=' + this.$route.query.parentId + '&userId=' + localStorage.fuserid).then(res => {
          res = res.body;
          this.currentSecondList = res.data.page.data;
        })
      } else {
        this.currentSecondList = this.contentTypeList;
      }
    },
    data() {
      return {
        leftCurrentIndex: this.$route.query.parentId ? this.$route.query.parentId : 0,
        rightCurrentIndex: this.$route.query.catId ? this.$route.query.catId : this.$route.query.contentType,
        showMenuList: this.pShowMenu,
        currentSecondList: [],
        menuList: [],
        contentTypeList: [{
          name: '紧急通知',
          contentType: 5
        }, {
          name: '部门动态',
          contentType: 7
        }, {
          name: '财务通知及公告',
          contentType: 8
        }]
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../common/css/mixin.scss";

  .move-enter-active, .move-leave-active {
    transition: all .3s;
  }

  .move-enter, .move-leave-to {
    transform: translate3d(0, -100%, 0);
  }

  .slideMenu-flag {
    position: fixed;
    z-index: 800;
    top: pxToRem(68);
    left: 0;
    bottom: 0;
    width: 100%;
    background: rgba(0, 0, 0, .4);
  }

  .slideMenu {
    width: 100%;
    height: pxToRem(68);
    z-index: 800;
    position: fixed;
    left: 0;
    top: 0;
    border-bottom: pxToRem(1) solid #e0e0e0;
    .current-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      position: relative;
      background-color: #FBFEFF;

      z-index: 900;
      .current {
        font-size: pxToRem(30);
        color: #333;
        height: 100%;
        position: relative;
        padding-left: pxToRem(10);
        padding-right: pxToRem(10);
        p.bottom-line {
          width: 100%;
          height: pxToRem(2);
          position: absolute;
          left: 0;
          bottom: 0;
          background-color: $themeColor;
        }
        span {
          line-height: pxToRem(66);
          color: $themeColor;
        }
        i {
          display: inline-block;
          margin-left: pxToRem(10);
          transition: all .3s;
          line-height: pxToRem(66);

        }
        &.active {
          i {
            transform: rotate(-180deg);
          }
        }
      }
    }

    .slide-list {
      /*position: absolute;*/
      width: 100%;
      /*left: 0;*/
      /*top: 0;*/
      display: flex;
      background-color: #fff;
      .first {
        min-width: pxToRem(300);
        background-color: #F8F8F8;
        li {
          &.active {
            background-color: #fff;
          }
          &:last-child {
            i {
              color: #FEA92F;
            }
          }
          &.li0 {
            i {
              color: #0365A4 !important;
            }
          }
          &.li1 {
            i {
              color: #0BB3C7 !important;
            }
          }
          &.li2 {
            i {
              color: #0CAE6F !important;
            }
          }
          &.li3 {
            i {
              color: #FF6702 !important;
            }
          }
          height: pxToRem(70);
          line-height: pxToRem(70);
          @include border-1px(#E0E0E0);
          display: flex;
          align-items: center;
          padding-left: pxToRem(44);
          i {
            font-size: pxToRem(30);
            margin-right: pxToRem(20);
            color: #2CA8F7;
          }
          span {
            font-size: pxToRem(30);
            color: #444;
          }
        }
      }
      .second {
        flex: 1;
        text-align: center;
        background-color: #fff;
        position: relative;
        .secondNoneData {
          position: absolute;
          color: #666;
          font-size: pxToRem(28);
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
        }
        li {
          &.active {
            color: $themeColor;
          }
          &.another-active {
            color: $themeColor;
          }
          font-size: pxToRem(30);
          color: #666;
          margin-top: pxToRem(24);
          span:active {
            color: $themeColor;
          }
        }
      }
    }
  }
</style>
