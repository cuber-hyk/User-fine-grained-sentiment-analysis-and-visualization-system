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
// 使用 VueRouter 插件
Vue.use(VueRouter)

// 定义路由配置
const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage
    },
    {
        path:'/UserProfile',
        name: 'UserProfile',
        component: UserProfile
    },
    {
        path:'/Login',
        name: 'Login',
        component: Login
    },
    {
        path:'/Register',
        name: 'Register',
        component: Register
    },
    {
        path:'/Compare',
        name:'Compare',
        component:Compare
    },
    {
        path:'/ModifyPasswordDialog',
        name:'ModifyPasswordDialog',
        component:ModifyPasswordDialog
    },
    {
        path:'/ModifyPhoneDialog ',
        name:'ModifyPhoneDialog',
        component:ModifyPhoneDialog 
    }

]

// 创建路由实例
const router = new VueRouter({
    routes
})

// 导出路由实例
export default router