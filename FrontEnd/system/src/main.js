import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as echarts from 'echarts'
import './mock'

// 全局样式
import './assets/css/global.css'

Vue.use(ElementUI) // 注册 element-ui
Vue.prototype.$echarts = echarts   // 注册 echarts
Vue.config.productionTip = false // 关闭生产模式下给出的提示

new Vue({    // 创建 Vue 实例
  router, // 注册路由
  store, // 注册 store
  render: h => h(App)
}).$mount('#app')
