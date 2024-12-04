// 导入 Vue 和 VueRouter
import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../views/Home.vue'

// 使用 VueRouter 插件
Vue.use(VueRouter)

// 定义路由配置
const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage
    }
]

// 创建路由实例
const router = new VueRouter({
    routes
})

// 导出路由实例
export default router