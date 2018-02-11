import { Toast, Indicator } from 'mint-ui'
import Vue from 'vue'
import axios from 'axios'
function comErrorCallback(error) {
  console.log('comErrorCallback>>>>>',error)
}
function comCodeToast(code) {
  var msgObj = {
    '999999': '系统异常',
    '010001': '验证码发送失败',
    '020001': '用户不存在',
    '020002': '用户密码错误',
    '020003': '用户手机号已存在',
    '020004': '用户邮箱已存在',
    '020005': '手机验证码错误',
    '020006': '手机号不能修改',
  }
  Toast({message:msgObj[code]?msgObj[code]:'系统异常', duration: 2000})
}
var ajax = {
  get (url, params,isComCodeToast) {
    return new Promise((resolve, reject) => {
      axios.get(url, params).then(response => {
        //console.log(url+'>>>>>>',response)
        if (response.status === 200) {
          if (isComCodeToast) {
            resolve(response)
            return
          }
          if (response.data.code === '000000'){
            resolve(response)
          } else {
            comCodeToast(response.data.code)
          }
        } else {
          comErrorCallback(response)
        }
      }).catch((error) => {
        if (reject) {
          reject(error)
        } else {
          comErrorCallback(error)
        } 
      })
    })
  },
  post (url, params,isComCodeToast) {
    return new Promise((resolve, reject) => {
      axios.post(url, params).then(response => {
        if (response.status === 200) {
          if (isComCodeToast) {
            resolve(response)
            return
          }
          if (response.data.code === '000000'){
            resolve(response)
          } else {
            comCodeToast(response.data.code)
          }
        } else {
          comErrorCallback(response)
        }
      }).catch((error) => {
        if (reject) {
          reject(error)
        } else {
          comErrorCallback(error)
        } 
      })
    })
  },
}
export default{
  install: () => {
    Vue.prototype.$http = ajax
  }
}