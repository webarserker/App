import Vue from 'vue'
export function praiseAnimate ($event,praiseNum) {
  var target = $event.srcElement
  for (var i = 0; i < (praiseNum?praiseNum:1); i++){
    (() => {
        setTimeout(() => {
            var zan = document.createElement('div')
            var randomClass = '';
            if (praiseNum == 1) {
              randomClass = 'animate-zan-move'
              zan.innerHTML = '+1'
            } else {
              randomClass = 'icon-zan-act animate-zan-move' + Math.floor((5 - Math.random()*10))
            }
            zan.setAttribute('class','icon icon-zan-move ' + randomClass)
            target.appendChild(zan)
            var kit = ['webkitAnimationEnd','animationend']
            kit.forEach((item,index) => {
                zan.addEventListener(item, () => {
                    target.removeChild(zan)
                })
            })
        },i*167 + i*i)
    })(i)
  }
}
/**
 * 
 * 
 * @export
 * @param {element} ele 滚动容器
 * @param {int} distance 距离底部distance触发endCb
 * @param {func} ubCb 滚动条向下监听
 * @param {func} downCb 滚动条向上监听
 * @param {func} endCb 滚动条到底部回调
 * @param {int} delay 节流控制
 */
export function scrollController (obj) {
    var ele = obj.ele
    var distance = obj.distance?obj.distance:2
    var lastScrollTop = 0
    var timer
    // var lastY
    document.body.addEventListener('touchmove', function(e){
      e.preventDefault()
    },false)
    ele.addEventListener('touchmove', function(e){
      // if (e.touches[0].pageY - lastY > 0) {
      //   if (ele.scrollTop == 0) {
      //     console.log('stop')
      //     e.preventDefault()
      //   }
      // } else {
        e.stopPropagation()
      // }
      // lastY = e.touches[0].pageY
    },false)
    // ele.removeEventListener('scroll',function(){
    //   console.log('移除监听')
    // },false)
    ele.addEventListener('scroll', function(e){
      clearTimeout(timer)
      timer = setTimeout(() => {
        var scrollTop = ele.scrollTop
        if (scrollTop - lastScrollTop > 0) {
          if (obj.downCb) obj.downCb()
          if (scrollTop + ele.offsetHeight + distance >= ele.scrollHeight) {
            if (obj.endCb) obj.endCb()
          }
        } else {
          if (obj.upCb) obj.upCb()
        }
        lastScrollTop = ele.scrollTop
        if (obj.scrollCb) obj.scrollCb(lastScrollTop)
      },obj.delay?obj.delay:0)
    },false)
}
// export function getRealImg() {
//   return {
//     install: () => {
//       Vue.prototype.$getRealImg = function(url, localHost) {
//         return  url.substring(0,4).toLowerCase()==='http' ? url  :localHost+url
//       }
//     }
//   }
// }