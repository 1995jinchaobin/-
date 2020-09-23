import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import './assets/css/base.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import axios from 'axios'
Vue.prototype.$imgUrl = 'http://120.26.69.202:8080/demo/'
axios.defaults.baseURL = 'http://120.26.69.202:8080/demo/'
axios.defaults.withCredentials = true
// 请求头添加token
axios.interceptors.request.use(config => {
  if (window.sessionStorage.getItem('userToken')) {
    config.headers.common.token = window.sessionStorage.getItem('userToken')
  }
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
// 全局引入富文本编辑器
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
