import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/base.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import axios from 'axios'
// const Base64 = require('js-base64').Base64
// const token = window.sessionStorage.getItem('userToken')
// axios.defaults.headers.authorization = `Bearer ${token}`
// axios.defaults.baseURL = 'http://120.26.69.202:8080/demo'
Vue.prototype.$imgUrl = 'http://120.26.69.202:8080/demo/'
axios.defaults.baseURL = 'http://192.168.0.10:8080/demo/'
// axios.defaults.baseURL = '/api/'
axios.defaults.withCredentials = true
// axios.defaults.baseURL = 'api'
// 请求头添加token
// const obj = window.sessionStorage.getItem('obj')
// const l = JSON.parse(Base64.decode(obj))
// const iswrite = l.iswrite
axios.interceptors.request.use(config => {
  if (window.sessionStorage.getItem('userToken')) {
    config.headers.common.token = window.sessionStorage.getItem('userToken')
  }
  return config
})
// axios.interceptors.request.use(config => {
//   // const userToken = sessionStorage.getItem('userToken')
//   // console.log(userToken)
//   if (sessionStorage.getItem('userToken')) {
//     config.headers.Authorization = sessionStorage.getItem('userToken')
//     return config
//   }
// })
// axios.interceptors.request.use(config => {
//   const token = window.sessionStorage.getItem('userToken')
//   if (token) {
//     config.headers.accessToken = token
//     // 也可以这种写法
//     // config.headers['accessToken'] = Token;
//     return config
//   }
// })
Vue.prototype.$http = axios
Vue.config.productionTip = false
// 时间过滤器
// Vue.filter('dateFormat', function (originVal) {
//   // 先把传参毫秒转化为new Date()
//   const dt = new Date(originVal)
//   const y = dt.getFullYear()
//   // 月份是从0开始,需要+1。  +''是把数字转化为字符串,padStart(2,'0')是把字符串设置为2位数,不足2位则在开头加'0'
//   const m = (dt.getMonth() + 1 + '').padStart(2, '0')
//   const d = (dt.getDate() + '').padStart(2, '0')
//   const hh = (dt.getHours() + '').padStart(2, '0')
//   const mm = (dt.getMinutes() + '').padStart(2, '0')
//   const ss = (dt.getSeconds() + '').padStart(2, '0')
//   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
// })
// 全局引入富文本编辑器
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
