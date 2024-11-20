import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/components/common/Layout.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/login/index.vue"),
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("../views/dashboard/index.vue"),
        meta: { title: "数据概览" },
      },
      {
        path: "search",
        name: "Search",
        component: () => import("../views/search/index.vue"),
        meta: { title: "商品搜索" },
      },
      {
        path: "analysis",
        name: "Analysis",
        component: () => import("../views/analysis/index.vue"),
        meta: { title: "情感分析" },
      },
      {
        path: "comment",
        name: "Comment",
        component: () => import("../views/comment/index.vue"),
        meta: { title: "评论列表" },
      },
      {
        path: "product/:id",
        name: "ProductDetail",
        component: () => import("../views/product/detail.vue"),
        meta: { title: "商品详情" },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// 添加路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title
    ? `${to.meta.title} - 商品评论情感分析系统`
    : "商品评论情感分析系统";

  // 判断是否需要登录权限
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isLoggedIn = localStorage.getItem("token");

  if (requiresAuth && !isLoggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
