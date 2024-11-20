<template>
  <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
    <div class="sidebar-title">
      {{ !isCollapse ? "商品评论分析系统" : "系统" }}
    </div>
    <el-menu
      router
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="'transparent'"
      :text-color="textColor"
      :active-text-color="activeTextColor"
      class="sidebar-menu"
    >
      <el-menu-item index="/dashboard">
        <i class="el-icon-s-data"></i>
        <span slot="title">数据概览</span>
      </el-menu-item>
      <el-menu-item index="/search">
        <i class="el-icon-search"></i>
        <span slot="title">商品搜索</span>
      </el-menu-item>
      <el-menu-item index="/analysis">
        <i class="el-icon-pie-chart"></i>
        <span slot="title">情感分析</span>
      </el-menu-item>
      <el-menu-item index="/comment">
        <i class="el-icon-s-comment"></i>
        <span slot="title">评论列表</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: "Sidebar",
  props: {
    isCollapse: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    textColor() {
      return "rgba(255, 255, 255, 0.7)";
    },
    activeTextColor() {
      return getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-color")
        .trim();
    },
  },
};
</script>

<style scoped>
.sidebar-title {
  font-size: 15px; /* 设置标题字体大小 */
  font-weight: bold; /* 设置标题字体加粗 */
  color: #d7e7e8; /* 设置标题颜色 */
  padding: 16px 10px 2px 10px;
  text-align: center; /* 居中对齐 */
}

.sidebar {
  background: linear-gradient(
    180deg,
    var(--sidebar-bg) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  transition: width 0.3s;
  overflow: hidden;
}

.sidebar-menu {
  border: none;
  height: 100%;
}

.el-menu-item {
  position: relative;
  overflow: hidden;
}

.el-menu-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.3s;
}

.el-menu-item:hover::before {
  transform: translateX(100%);
}

.el-menu-item.is-active {
  background: linear-gradient(
    90deg,
    rgba(var(--primary-rgb), 0.1),
    rgba(var(--primary-rgb), 0.2)
  ) !important;
  border-right: 3px solid var(--primary-color);
}

.el-menu-item i {
  color: inherit;
}
</style> 