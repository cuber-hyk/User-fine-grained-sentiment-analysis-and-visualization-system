// 导入 Vue 和 VueRouter
import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../views/Home.vue'
import UserProfile from '@/components/UserProfile.vue'
import Register from '@/views/Register.vue'
import Login from '@/views/Login.vue'
import ModifyPasswordDialog from '@/components/ModifyPasswordDialog.vue'
import ModifyPhoneDialog from '@/components/ModifyPhoneDialog.vue'
import Compare from '@/views/Compare.vue'
// 导入详情页面组件
import SearchDetail from '@/views/SearchDetail.vue'
import ProductDetail from '@/views/productdetail.vue'
import SentimentDetail from '@/views/SentimentDetail.vue'
import TrendDetail from '@/views/TrendDetail.vue'
// 已删除冗余的ReviewsDetail组件
import SourceDetail from '@/views/SourceDetail.vue'
import AspectOpinionsDetail from '@/views/AspectOpinionsDetail.vue'
// 使用 VueRouter 插件
Vue.use(VueRouter)

// 定义路由配置
const routes = [
    {
        path: '/',
        redirect: '/Login'
    },
    {
        path: '/home',
        name: 'HomePage',
        component: HomePage,
        // 该路由或页面需要用户进行认证，通常意味着用户需要登录才能访问该页面。
        meta: { requiresAuth: true }
    },
    {
        path: '/UserProfile',
        name: 'UserProfile',
        component: UserProfile,
        // 该路由或页面需要用户进行认证，通常意味着用户需要登录才能访问该页面。
        meta: { requiresAuth: true }
    },
    {
        path: '/Login',
        name: 'Login',
        component: Login
    },
    {
        path: '/Register',
        name: 'Register',
        component: Register
    },
    {
        path: '/Compare',
        name: 'Compare',
        component: Compare,
        // 该路由或页面需要用户进行认证，通常意味着用户需要登录才能访问该页面。
        meta: { requiresAuth: true }
    },
    {
        path: '/ModifyPasswordDialog',
        name: 'ModifyPasswordDialog',
        component: ModifyPasswordDialog
    },
    {
        path: '/ModifyPhoneDialog ',
        name: 'ModifyPhoneDialog',
        component: ModifyPhoneDialog
    },
    // 详情页面路由
    {
        path: '/search-detail',
        name: 'SearchDetail',
        component: SearchDetail,
        meta: { requiresAuth: true }
    },
    {
        path: '/product-detail',
        name: 'ProductDetail',
        component: ProductDetail,
        meta: { requiresAuth: true }
    },
    {
        path: '/sentiment-detail',
        name: 'SentimentDetail',
        component: SentimentDetail,
        meta: { requiresAuth: true }
    },
    {
        path: '/trend-detail',
        name: 'TrendDetail',
        component: TrendDetail,
        meta: { requiresAuth: true }
    },
    // 已删除冗余的reviews-detail路由
    {
        path: '/aspect-opinions-detail',
        name: 'AspectOpinionsDetail',
        component: AspectOpinionsDetail,
        meta: { requiresAuth: true }
    },
    {
        path: '/source-detail',
        name: 'SourceDetail',
        component: SourceDetail,
        meta: { requiresAuth: true }
    }

]

// 创建路由实例
const router = new VueRouter({
    routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
    // 检查路由是否需要登录权限
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // 检查用户是否已登录
        const token = window.sessionStorage.getItem('token')
        if (!token) {
            // 未登录则跳转到登录页
            next({
                path: '/Login',
                query: { redirect: to.fullPath }
            })
        } else {
            // 已登录则正常跳转
            next()
        }
    } else {
        // 不需要登录权限的路由正常跳转
        next()
    }
})

// 导出路由实例
export default router