import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
// 导入axios
import axios from 'axios'

// 配置请求路径
axios.defaults.baseURL = 'http://127.0.0.1:9999'
Vue.config.productionTip = false
// 全局配置$http，用来发送
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
