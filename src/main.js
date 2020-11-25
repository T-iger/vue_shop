import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
// 导入axios
import axios from 'axios'

// 配置请求路径
axios.defaults.baseURL = 'http://127.0.0.1:9999'
// axios.defaults.baseURL = 'http://47.96.231.239:9999'
// 配置超时时间
axios.defaults.timeout = 20000

// 在请求前挂载一个操作，及设置token值
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 请求到结果的拦截处理
axios.interceptors.response.use(config => {
// 返回请求正确的结果
  return config
}, error => {
// 错误的请求结果处理，这里的代码根据后台的状态码来决定错误的输出信息

  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '错误请求'
        break

      case 401:
        error.message = '未授权，请重新登录'
        break

      case 403:
        error.message = '拒绝访问'
        break

      case 404:
        error.message = '请求错误,未找到该资源'
        break

      case 405:
        error.message = '请求方法未允许'
        break

      case 408:
        error.message = '请求超时'
        break

      case 500:
        error.message = '服务器端出错'
        break

      case 501:
        error.message = '网络未实现'
        break

      case 502:
        error.message = '网络错误'
        break

      case 503:
        error.message = '服务不可用'
        break

      case 504:
        error.message = '网络超时'
        break

      case 505:
        error.message = 'http版本不支持该请求'
        break

      default:
        error.message = `连接错误${error.response.status}`
    }
  } else {
    error.message = '连接到服务器失败'
  }
  return Promise.reject(error.message)
})
Vue.config.productionTip = false
// 全局配置$http，用来发送
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
