<template>
  <div class="home-container" ref="homeContainer">
    <div class="search-space" @click="$router.push('/searchPage')">
      <div class="out">
        <div class="inner">
          <i class="icon-search"></i>
        </div>
      </div>
    </div>
    <div class="home" @scroll="setNavToTop($event)">
      <div class="home-inner">
        <div class="banner-wrapper">

          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <img :src="img1">
            </div>
            <div class="swiper-slide">
              <img :src="img2">
            </div>
            <div class="swiper-slide">
              <img :src="img3">
            </div>

          </div>
          <div class="swiper-pagination base-pagination"></div>
        </div>
        <div class="nav-list-space" ref="navListSpace">
          <ul class="nav-list" ref="navList">
            <router-link v-for="(item,index) in navList"
                         :key="index" tag="li"
                         :to="{name:'SecondCatList',query:{parentId:item.id}}" v-if="item.status">
              <div class="flex-item">
                <p class="icon-container">
                  <i :class="item.icon?item.icon:'icon-jingfei'"></i>
                </p>
                <h3>{{item.name}}</h3>
              </div>
            </router-link>
          </ul>
        </div>
        <div class="department">
          <div class="department-head">
            <h2 class="lf"><img src="../common/image/lanse.png" alt="">部门动态</h2>
            <a class="rt" @click="$router.push({name:'ArticleListByType',query:{contentType:7}})">查看全部&gt;&gt;</a>
          </div>
          <div class="department-body">
            <div class="swiper-container1" id="swiper-container1">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item,index) in departmentList.slice(0,3)" :data-aid="item.id">
                  <div class="left-img-container">
                    <img src="../common/image/redunread.png" alt="" class="unread" v-if="!item.isRead">
                    <img class="left-img" :src="index==0?img4:index==1?img5:img6">
                  </div>
                  <div class="right-content">
                    <h3 class="outer" v-html="item.title?item.title:''"></h3>
                    <div class="outer-div" v-html="item.content?item.content:''"></div>
                    <div class="other-info">
                      <div class="time">
                        <i class="icon-fabushijian"></i>
                        {{item.publisTime | dateFormat}}
                      </div>
                      <div class="see-num">
                        <i class="icon-liulan"></i>
                        {{item.countReadNum}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="swiper-pagination  base-pagination2"></div>
            </div>
            <ul class="last-list" id="last-list">
              <li v-for="(item,index) in departmentList.slice(3,7)" :data-aid="item.id">
                <img src="../common/image/unread.png" v-if="!item.isRead">
                <h1>{{item.title}}</h1>
                <div class="date">
                  {{item.publisTime | dateFormat}}
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="notice-box">
          <div class="notice-head">
            <h2 class="lf"><img src="../common/image/zise.png" alt="">财务通知及公告</h2>
            <a class="rt" @click="$router.push({name:'ArticleListByType',query:{contentType:8}})">查看全部&gt;&gt;</a>
          </div>
          <div class="swiper-container2" id="swiper-container2">
            <div class="slider-wrapper">
              <div class="slider-x" ref="sliderX">
                <div class="slider-x-group" ref="sliderXGroup">
                  <div class="slider-x-item" v-for="(item,index) in scrollList" :data-aid="item.id">
                    <div class="swiper-slide-child">
                      <div class="scrollContent section watchDom2" v-html="item.content">

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <!--<div class="swiper-wrapper">-->
            <!--<div class="swiper-slide" v-for="(item,index) in scrollList" :data-aid="item.id">-->
            <!--<div class="swiper-slide-child">-->
            <!--<div class="scrollContent section" v-html="item.content">-->

            <!--</div>-->
            <!--</div>-->
            <!--</div>-->
            <!--</div>-->
          </div>
        </div>

        <div class="out-wrapper">
          <div id="slider-wrapper">
            <div id="module-slider">
              <div class="tab-container">
                <ul class="section-links">
                  <li v-for="(item,index) in sliderList" @click="sliderXX(index)"
                      :class="{'link-active':currentPageIndex==index}">
                    {{item.name}}
                  </li>
                </ul>
                <a class="to-more"
                   @click="$router.push({name:'ArticleList',query:{parentId:currentParentId,catId:currentCatId}})">查看全部&gt;&gt;</a>
              </div>
              <div class="slider" ref="slider">
                <div class="slider-group" ref="sliderGroup">
                  <div v-for="(item,index) in sliderList">
                    <ul class="watchDom">
                      <li class="news-item" v-for="(subitem,i) in item.list" @click="jumpByIdGroup(subitem.id)">
                        <div :class="['date','date'+(i+1)]" v-if="i<3">
                          <div class="level1">
                            <div class="month">
                              {{new Date(subitem.publisTime).getMonth() + 1 > 9 ? new Date(subitem.publisTime).getMonth() + 1 : '0' + (new Date(subitem.publisTime).getMonth() + 1)}}
                            </div>
                            <div class="device"></div>
                            <div class="day">
                              {{new Date(subitem.publisTime).getDate() > 9 ? new Date(subitem.publisTime).getDate() : '0' + (new Date(subitem.publisTime).getDate())}}
                            </div>
                          </div>
                          <div class="level2 year">{{new Date(subitem.publisTime).getFullYear().toString()}}</div>
                        </div>
                        <p>{{subitem.title ? subitem.title : ''}}</p>
                        <div class="bottom-date" v-if="i>2">
                          {{subitem.publisTime | dateFormat}}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>


        <div class="qrcode-box">
          <img src="../common/image/er.jpeg" class="qrcode">
          <p>&copy;版权所有：北京第二外国语学院财务处</p>
          <p>Copyright 2017 ALL Right Reserved | 京ICP备16030849号</p>
        </div>
      </div>

    </div>
    <mFooter></mFooter>
    <Warning></Warning>
  </div>

</template>
<script>
  import Warning from '../components/warning.vue'
  import mHeader from '../components/header.vue'
  import mFooter from '../components/footer.vue'
  import BScroll from 'better-scroll'
  import {addClass} from '../common/js/dom.js'

  import Vue from 'vue';
  import urlParse from '../common/js/util.js'


  export default {
    updated() {

    },
    computed: {
      currentParentId() {
        return this.sliderList[this.currentPageIndex].parentCatId;
      },
      currentCatId() {
        return this.sliderList[this.currentPageIndex].catId;
      }
    },
    components: {Warning, mHeader, mFooter},
    filters: {
      dateFormat(time) {
        time = new Date(Number(time));
        var month = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1);
        var date = time.getDate() < 10 ? ('0' + time.getDate()) : time.getDate();
        return time.getFullYear() + '-' + month + '-' + date;
      }
    },

    created() {
      let state = this.$store.state;
      var _this = this;
      this.$http.get(state.host + '/front/navigator' + '?userId=' + localStorage.fuserid).then(res => {
        res = res.body;
        if (res.code = '000000') {
          let data = res.data;
          data = data.filter((value, index, array) => {
            return value.contentType != 2 && value.contentType != 6;
          })
          this.navList = data.slice(0, 4);
          let footerData = data.slice(4);
          sessionStorage.setItem('footerList', JSON.stringify(footerData));
          this.$store.commit('SET_FOOTERLIST', footerData);
        }
      })

      this.$store.commit('SET_LOADING_STATU', true);

      this.$http.get(state.host + '/front/findDepartmentNews' + '?userId=' + localStorage.fuserid).then(res => {
        res = res.body;
        if (res.code == '000000') {
          this.departmentList = res.data;
          var _this = this;
          _this.$nextTick(() => {

            var swiper1 = new Swiper('.swiper-container1', {
              pagination: '.base-pagination2',
              paginationClickable: true,
              loop: true,
              autoplay: 3000,
              autoplayDisableOnInteraction: false
            });

            let slides1 = document.getElementById('swiper-container1').querySelectorAll('.swiper-slide');
            for (let i = 0; i < slides1.length; i++) {
              slides1[i].onclick = function () {
                var aid = this.getAttribute('data-aid');
//                _this.$http.get(_this.$store.state.host + '/front/infoContentUser/save?id=' + aid + '&userId=' + localStorage.fuserid).then(res => {
//                  res = res.body;
                  //该接口是保存已读，然后就是跳转到相应的详情页面
                  _this.$router.push({name: 'ArticleDetailByType', query: {contentType: 7, articleId: aid}})
//                })
              }
            }

            let slides = document.getElementById('last-list').querySelectorAll('li');
            var _this = this;
            for (let i = 0; i < slides.length; i++) {
              slides[i].onclick = function () {
                var aid = this.getAttribute('data-aid');
//                _this.$http.get(_this.$store.state.host + '/front/infoContentUser/save?id=' + aid + '&userId=' + localStorage.fuserid).then(res => {
//                  res = res.body;
                  //该接口是保存已读，然后就是跳转到相应的详情页面
                  _this.$router.push({name: 'ArticleDetailByType', query: {contentType: 7, articleId: aid}})
//                })
              }
            }

            this.$store.commit('SET_LOADING_STATU', false);
          })

        }
      })

      this.$http.get(state.host + '/front/findNoticeAndDynamicList' + '?userId=' + localStorage.fuserid).then(res => {
        res = res.body;
        if (res.code == '000000') {
          this.scrollList = res.data;

          var _this = this;

          this.$nextTick(() => {

//            let swiper3 = new Swiper('.swiper-container2', {
//              autoplay: 6000,
//              loop: true,
//              autoplayDisableOnInteraction: true,
//              observer:true,
//              observeParents:true
//            });


//            let childs = document.getElementById('swiper-container2').getElementsByClassName('swiper-slide-child');
//            let slideHeight = childs[0].offsetHeight;
//            for (let i = 0; i < childs.length; i++) {
//              let bool;
//              if (childs[i].getElementsByClassName('scrollContent')[0].offsetHeight > slideHeight) {
//                bool = true;
//              } else {
//                bool = false;
//              }
//              new BScroll(childs[i], {
//                scrollY: true,
//                preventDefault: bool,
//                click: true
//              })
//            }
          })
        }


      })

      var _this = this;
      this.timer2 = setInterval(() => {
        if (document.getElementsByClassName('watchDom').length) {
          if (parseFloat(getComputedStyle(document.getElementsByClassName('watchDom')[0]).height) > 0 && _this.heightChange == 0) {
            _this.setSliderWidth();
            _this.initSlider();
            _this.heightChange = 1;
          } else {
            _this.timer2 = null;
          }
        }
      }, 300)



      this.timer3 = setInterval(() => {
        if (document.getElementsByClassName('watchDom2').length) {
          if (parseFloat(getComputedStyle(document.getElementsByClassName('watchDom2')[0]).height) > 0 && _this.heightChangeX == 0) {
            _this.setSliderWidthX();
            _this.initSliderX();
            let slides2 = document.getElementById('swiper-container2').querySelectorAll('.slider-x-item');
            for (let i = 0; i < slides2.length; i++) {
              slides2[i].onclick = function () {
                var aid = this.getAttribute('data-aid');
//                _this.$http.get(_this.$store.state.host + '/front/infoContentUser/save?id=' + aid + '&userId=' + localStorage.fuserid).then(res => {
//                  res = res.body;
                  //该接口是保存已读，然后就是跳转到相应的详情页面
                  _this.$router.push({name: 'ArticleDetailByType', query: {contentType: 8, articleId: aid}})
//                })
              }
            }
            _this.heightChangeX = 1;
          } else {

          }
        }
      })




      this.$http.get(state.host + '/front/findModuelData?pageSize=5' + '&userId=' + localStorage.fuserid).then(res => {
        res = res.body;
        this.sliderList = res.data[1].data.slice(0, 2);
        sessionStorage.setItem('normalModule', JSON.stringify(this.sliderList));
      })
    },
    beforeDestroy() {
      var self = this;
      clearTimeout(self.timer);
      this.timer = null;
      clearInterval(self.timer2);
      this.timer2 = null;
//      clearInterval(self.timer3);
//      this.timer3 = null;
    },
    data() {
      return {
        showHead: true,
        img1: require('../common/image/1.png'),
        img2: require('../common/image/2.png'),
        img3: require('../common/image/3.png'),
        img4: require('../common/image/4.png'),
        img5: require('../common/image/5.png'),
        img6: require('../common/image/6.png'),
        scrollList: [],
        navList: [],
        departmentList: [],
        sliderList: [],
        currentPageIndex: 0,
        autoPlay: false,
        interval: 3000,
        mck: window.MCK,
        timer2: null,
        heightChange: 0,
        timer3: null,
        heightChangeX: 0,
      }
    },
    mounted() {
      let swiper = new Swiper('.banner-wrapper', {
        pagination: '.base-pagination',
        paginationClickable: true,
        loop: true,
        autoplay: 3000,
        autoplayDisableOnInteraction: false
      });
    },
    methods: {
      remToPx(rem) {
        let dpr = document.documentElement.getAttribute('data-dpr');
        return rem * (dpr / 2)
      },
      setNavToTop(event) {
        let ele = event.currentTarget;
        let scrollTop = ele.scrollTop;
        if (scrollTop > this.remToPx(310)) {
//          addClass(this.$refs.navList,'fix-top');
          this.$refs.navList.setAttribute('class', 'nav-list fix-top');
          this.$refs.homeContainer.appendChild(this.$refs.navList);
        } else {
          this.$refs.navList.setAttribute('class', 'nav-list');
          this.$refs.navListSpace.appendChild(this.$refs.navList);
        }
      },
      jumpByIdGroup(id) {
//        this.$http.get(this.$store.state.host + '/front/infoContentUser/save?id=' + id + '&userId=' + localStorage.fuserid).then(res => {
//          res = res.body;
          //该接口是保存已读，然后就是跳转到相应的详情页面
          this.$router.push({
            name: 'ArticleDetail',
            query: {parentId: this.currentParentId, catId: this.currentCatId, articleId: id}
          })
//        })
      },
      _play() {
        let pageIndex = this.currentPageIndex + 1
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      },
      setSliderWidth() {
        this.children = this.$refs.sliderGroup.children
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')
          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      setSliderWidthX() {
        this.childrenX = this.$refs.sliderXGroup.children;
        let width = 0;
        let sliderXWidth = this.$refs.sliderX.clientWidth;
        for (let i = 0; i < this.childrenX.length; i++) {
          let child = this.childrenX[i]
          addClass(child, 'slider-item')
          child.style.width = sliderXWidth + 'px'
          width += sliderXWidth
        }
        width += 2 * sliderXWidth
        this.$refs.sliderXGroup.style.width = width + 'px'
      },
      initSliderX() {
        this.sliderX = new BScroll(this.$refs.sliderX, {
          scrollX: true,
          momentum: false,
          snap: {
            loop: true,
            threshold: 0.3,
            speed: 400
          },
          click: true,
          preventDefault: false
        })
      },
      initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          momentum: false,
          snap: {
            loop: false,
            threshold: 0.3,
            speed: 400
          },
          click: true,
          preventDefault: false
//          preventDefaultException:{tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|DIV|P|BODY|HTML|SPAN|UL|LI)$/}
        })

        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          this.currentPageIndex = pageIndex
          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      sliderXX(i) {
        this.slider.goToPage(i, 0, 400);
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../common/css/mixin.scss";

  .search-space {
    position: fixed;
    top: pxToRem(205);
    right: pxToRem(4);
    z-index: 1000;
    width: pxToRem(100);
    height: pxToRem(100);
    border-radius: 50%;
    border: pxToRem(2) solid #fff;
    .out {
      width: pxToRem(96);
      height: pxToRem(96);
      border: pxToRem(2) solid #ddd;
      border-radius: 50%;
      opacity: .8;
      .inner {
        background-color: $themeColor;
        width: pxToRem(92);
        height: pxToRem(92);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        i {
          color: #fff;
          font-size: pxToRem(40);
        }
      }
    }
  }

  .home-container {
    & > .nav-list {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1001;
      height: pxToRem(120);
      & > li {
        & > .flex-item {
          p {
            height: pxToRem(62);
            width: pxToRem(62);
          }
          h3 {
            margin-top: pxToRem(5);
          }
        }
      }
    }
  }

  #module-slider {
    .tab-container {
      padding-top: pxToRem(50);
      padding-left: pxToRem(20);
      @include border-1px(#ddd);
      display: flex;
      .section-links {
        flex: 1;
        display: flex;
        li {
          font-weight: bold;
          padding-bottom: pxToRem(26);
          font-size: pxToRem(36);
          padding-left: pxToRem(20);
          padding-right: pxToRem(20);
          margin-right: pxToRem(50);
          &.link-active {
            color: rgb(1, 101, 164);
            border-bottom: pxToRem(6) solid rgb(1, 101, 164);
          }
        }
      }
      .to-more {
        line-height: pxToRem(36);
        color: $themeColor;
        font-size: pxToRem(24);
        padding-right: pxToRem(20);
      }
    }

    .slider-item {
      float: left;
      min-height: pxToRem(500);
    }

    .slider {
      padding-top: pxToRem(28);
      padding-bottom: pxToRem(28);
      .slider-group {
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        li.news-item {
          &:nth-child(4), &:nth-child(5) {
          }
          padding-bottom: pxToRem(27);
          padding-left: pxToRem(20);
          padding-right: pxToRem(20);
          white-space: normal;
          display: flex;
          align-items: center;
          div.date {
            width: pxToRem(80);
            height: pxToRem(76);
            background-color: #fff;
            padding-top: pxToRem(7);
            padding-bottom: pxToRem(7);
            &.date1 {
              .level1 {
                .month, .day {
                  background-color: #A8372A;
                }
              }
              .level2 {
                background-color: #A8372A;
              }
            }

            &.date2 {
              .level1 {
                .month, .day {
                  background-color: #ED8632;
                }
              }
              .level2 {
                background-color: #ED8632;
              }
            }

            &.date3 {
              .level1 {
                .month, .day {
                  background-color: #ED8632;
                }
              }
              .level2 {
                background-color: #ED8632;
              }
            }

            .level1 {
              display: flex;
              .month {
                border-top-left-radius: pxToRem(8);
                flex: 1;
              }
              .device {
                width: 1px;
                background-color: #fff;
              }
              .month, .day {
                color: #fff;
                font-size: pxToRem(24);
                height: pxToRem(30);
                line-height: pxToRem(30);
                text-align: center;
              }
              .day {
                border-top-right-radius: pxToRem(8);
                flex: 1;
              }
            }
            .level2 {
              opacity: .5;
              margin-top: pxToRem(2);
              height: pxToRem(30);
              line-height: pxToRem(30);
              color: #fff;
              text-align: center;
              font-size: pxToRem(24);
            }
          }
          p {
            flex: 1;
            padding-left: pxToRem(10);
            font-size: pxToRem(28);
            color: #333;
            line-height: 1.4;
            max-height: pxToRem(76);
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-right: pxToRem(15);
            &:active {
              color: $themeColor;
            }
          }
          div.bottom-date {
            color: #7f7f7f;
            font-size: pxToRem(22);
          }
        }
      }
    }
  }

  .home {
    position: fixed;
    z-index: 850;
    top: 0;
    left: 0;
    width: 100%;
    bottom: pxToRem(110);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .home-inner {

    }
  }

  .banner-wrapper {
    height: pxToRem(310);
    position: relative;
    overflow: hidden;
    img {
      width: 100%;
      height: pxToRem(310);
    }
  }

  .nav-list-space {
    height: pxToRem(180);
    background-color: #fff;
    width: 100%;
  }

  .nav-list {
    height: pxToRem(180);
    background-color: #fff;
    display: flex;
    width: 100%;
    box-shadow: 0 pxToRem(2) pxToRem(6) #ddd;
    &.fix-top {

    }
    & > li {
      &:nth-child(1) {
        p.icon-container {
          color: #0365A4;
        }
        &:active p.icon-container {
          color: #fff;
          background-color: #0365A4;
        }
      }
      &:nth-child(2) {
        p.icon-container {
          color: #0BB3C7;
        }
        &:active p.icon-container {
          color: #fff;
          background-color: #0BB3C7;
        }
      }
      &:nth-child(3) {
        p.icon-container {
          color: #0CAE6F;
        }
        &:active p.icon-container {
          color: #fff;
          background-color: #0CAE6F;
        }
      }
      &:nth-child(4) {
        p.icon-container {
          color: #FF6702;
        }
        &:active p.icon-container {
          color: #fff;
          background-color: #FF6702;
        }
      }
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      & > .flex-item {
        text-align: center;
        p {
          margin-left: auto;
          margin-right: auto;
          width: pxToRem(80);
          height: pxToRem(80);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          i {
            font-size: pxToRem(50);
          }
        }
        & > h3 {
          margin-top: pxToRem(10);
          font-size: pxToRem(30);
          color: #444;
        }
      }
    }
  }

  .department {
    background-color: #fff;
    overflow: hidden;
    .department-head {
      padding-top: pxToRem(40);
      overflow: hidden;
      padding-left: pxToRem(20);
      padding-right: pxToRem(20);
      h2 {
        height: pxToRem(32);
        line-height: pxToRem(32);
        font-size: pxToRem(36);
        color: #0365A4;
        img {
          width: pxToRem(8);
          height: pxToRem(34);
          margin-right: pxToRem(12);
        }
      }
      a.rt {
        color: $themeColor;
        line-height: pxToRem(32);
        font-size: pxToRem(24);
      }
    }
    .department-body {
      padding-top: pxToRem(40);
      .swiper-container1 {
        width: 100%;
        height: pxToRem(230);
        position: relative;
        overflow: hidden;
        .swiper-wrapper {
          .swiper-slide {
            padding-bottom: pxToRem(50);
            padding-left: pxToRem(20);
            padding-right: pxToRem(20);
            display: flex;
            .left-img-container {
              position: relative;
              width: pxToRem(300);
              height: pxToRem(180);
              .unread {
                position: absolute;
                left: 0;
                top: 0;
                width: pxToRem(70);
              }
              .left-img {
                width: pxToRem(300);
                height: pxToRem(180);
              }
            }

            .right-content {
              flex: 1;
              margin-left: pxToRem(38);
              padding-right: pxToRem(10);
              position: relative;
              h3 {
                color: $themeColor;
                height: pxToRem(80) !important;
                font-size: pxToRem(32) !important;
                line-height: pxToRem(40) !important;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }

              .other-info {
                overflow: hidden;
                padding-right: pxToRem(30);
                position: absolute;
                width: 100%;
                bottom: 0;
                .time {
                  float: left;
                  color: #7f7f7f;
                  font-size: pxToRem(24);
                }
                .see-num {
                  float: right;
                  color: #7f7f7f;
                  font-size: pxToRem(24);
                }
              }
            }
          }
        }
      }
      .last-list {
        padding-top: pxToRem(16);
        li {
          padding-bottom: pxToRem(28);
          padding-left: pxToRem(20);
          padding-right: pxToRem(20);
          display: flex;
          align-items: center;
          img {
            width: pxToRem(56);
            height: pxToRem(56);
            margin-right: pxToRem(5);
          }
          h1 {
            padding-left: pxToRem(10);
            flex: 1;
            font-size: pxToRem(28);
            line-height: 1.4;
            max-height: pxToRem(76);
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-right: pxToRem(15);
            &:active {
              color: $themeColor;
            }
          }
          .date {
            color: #7f7f7f;
            font-size: pxToRem(22);
          }
        }
      }
    }
  }

  .notice-box {
    background-color: #fff;
    overflow: hidden;
    border-top: pxToRem(8) solid #F3F5F3;
    .notice-head {
      padding-top: pxToRem(40);
      overflow: hidden;
      padding-left: pxToRem(20);
      padding-right: pxToRem(20);
      h2 {
        height: pxToRem(32);
        line-height: pxToRem(32);
        font-size: pxToRem(36);
        color: $themeColor;
        img {
          width: pxToRem(8);
          height: pxToRem(34);
          margin-right: pxToRem(12);
        }
      }
      a.rt {
        color: $themeColor;
        line-height: pxToRem(32);
        font-size: pxToRem(24);
      }
    }
    .swiper-container2 {
      padding-top: pxToRem(40);
      padding-bottom: pxToRem(40);
      height: pxToRem(630);
      width: pxToRem(550);
      background-color: #fff;
      margin-left: auto;
      margin-right: auto;
      .slider-wrapper {
        position: relative;
        height: pxToRem(550);
        border-radius: pxToRem(8);
        .slider-x {
          .slider-x-group {
            position: relative;
            overflow: hidden;
          }
          .slider-x-item {
            padding: 0 pxToRem(15);
            float: left;
            box-sizing: border-box;
            overflow: hidden;
            .swiper-slide-child {
              padding: pxToRem(25) pxToRem(20);
              background-color: #eee;
              border: 1px solid #ddd;
              height: pxToRem(550);
              border-radius: pxToRem(8);
              overflow: hidden;
              overflow-y: scroll;
              -webkit-overflow-scrolling: touch;
              .scrollContent {

              }
            }
          }
        }

      }
    }
  }

  .out-wrapper {
    width: 99.8%;
    margin-left: auto;
    margin-right: auto;
    #slider-wrapper {
      border-top: pxToRem(8) solid #F3F5F3;
      width: 100%;
      position: relative;
      overflow: hidden;
      background-color: #fff;
      p:active {
        color: $themeColor;
      }
    }
  }

  .department {
    border-top: pxToRem(8) solid #F3F5F3;
  }

  .qrcode-box {
    height: pxToRem(320);
    background-color: #A0A0A0;
    text-align: center;
    padding-top: pxToRem(16);
    padding-bottom: pxToRem(16);
    img.qrcode {
      width: pxToRem(210);
      height: pxToRem(210);
      margin-bottom: pxToRem(22);
    }
    p {
      color: #fff;
      line-height: 1.5;
      font-size: pxToRem(22);
    }
  }

</style>
