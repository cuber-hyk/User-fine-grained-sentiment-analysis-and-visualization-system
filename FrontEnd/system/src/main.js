import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as echarts from 'echarts'
import 'animate.css'
//import './mock'
// 全局样式
import './assets/css/global.css'
import './assets/fonts/collect-icon/iconfont.css'
import axios from 'axios'

Vue.use(ElementUI) // 注册 element-ui
Vue.prototype.$echarts = echarts   // 注册 echarts
Vue.config.productionTip = false // 关闭生产模式下给出的提示

// 初始化Axios拦截器
store.dispatch('setupAxiosInterceptors')

// 在应用初始化时恢复 token
const savedUser = localStorage.getItem('user')
if (savedUser) {
  try {
    const user = JSON.parse(savedUser)

    if (user && user.token) {
      // 将 token 保存到 sessionStorage
      window.sessionStorage.setItem('token', user.token)
      // 设置请求头
      axios.defaults.headers.common['token'] = user.token

      // 应用启动时，如果有 token，尝试获取最新的用户信息
      store.dispatch('fetchUserInfo').catch(error => {
        console.error('Failed to fetch user info on app start:', error)
        // 如果获取失败（如 token 过期），可以考虑登出用户
        if (error.response && error.response.status === 401) {
          console.warn('Token expired, logging out user')
          store.dispatch('logout')
        }
      })
    } else {
      console.warn('No token found in stored user data')
    }
  } catch (e) {
    console.error('Error parsing user from localStorage:', e)
  }
} else {
  console.warn('No user data found in localStorage')
}

// 设置 axios 默认值
axios.defaults.timeout = 10000; // 10秒超时
axios.defaults.withCredentials = true; // 如果需要发送 cookies

// 如果所有 API 都有共同的基础路径
// axios.defaults.baseURL = 'http://your-api-base-url';

// 调试请求和响应
// axios.interceptors.request.use(request => {
//   console.log('Starting Request', request);
//   return request;
// });

// axios.interceptors.response.use(response => {
//   console.log('Response:', response);
//   return response;
// }, error => {
//   console.log('Response Error:', error);
//   return Promise.reject(error);
// });

new Vue({    // 创建 Vue 实例
  router, // 注册路由
  store, // 注册 store
  render: h => h(App)
}).$mount('#app')
