<template>
  <el-container class="layout-container">
    <Sidebar :is-collapse="isCollapse" />
    <el-container class="main-container">
      <Header :toggle-sidebar="toggleSidebar" :is-collapse="isCollapse" />
      <el-main class="main-content">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Sidebar from "./Sidebar.vue";
import Header from "./Header.vue";

export default {
  name: "Layout",
  components: {
    Sidebar,
    Header,
  },
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style>
.layout-container {
  min-height: 100vh;
  background: var(--main-bg);
  margin: 0;
  padding: 0;
}

.main-container {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--main-bg);
  margin: 0;
  padding: 0;
}

.main-content {
  padding: 0 !important;
  margin: 0;
  background: var(--main-bg);
  color: var(--text-color);
}

/* 全局卡片样式 */
.el-card {
  background: var(--card-bg) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
}

.el-card__header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: var(--text-color);
  font-weight: 500;
}

.el-card__body {
  color: var(--text-color);
}

/* 数据卡片特殊样式 */
.data-card {
  background: var(--card-bg) !important;
  border: 1px solid var(--borderColor) !important;
}

.data-card .title {
  color: var(--statsTitleColor);
  font-size: 14px;
  margin-bottom: 8px;
}

.data-card .number {
  color: var(--statsNumberColor);
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.data-card .trend {
  color: var(--statsTrendColor);
  font-size: 12px;
}

/* 全局表格样式 */
.el-table {
  background: var(--card-bg) !important;
  color: var(--text-color) !important;
}

.el-table th,
.el-table tr {
  background: transparent !important;
}

.el-table--enable-row-hover .el-table__body tr:hover > td {
  background: rgba(255, 255, 255, 0.05) !important;
}

/* 全局按钮样式 */
.el-button--primary {
  background: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

.el-button--success {
  background: var(--success-color) !important;
  border-color: var(--success-color) !important;
}

.el-button--warning {
  background: var(--warning-color) !important;
  border-color: var(--warning-color) !important;
}

.el-button--danger {
  background: var(--danger-color) !important;
  border-color: var(--danger-color) !important;
}

/* 全局输入框样式 */
.el-input__inner {
  background: var(--card-bg) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: var(--text-color) !important;
}

/* 全局下拉菜单样式 */
.el-dropdown-menu {
  background: var(--card-bg) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.el-dropdown-menu__item {
  color: var(--text-color) !important;
}

.el-dropdown-menu__item:hover {
  background: rgba(255, 255, 255, 0.05) !important;
}

/* 全局分页样式 */
.el-pagination {
  color: var(--text-color) !important;
}

.el-pagination button {
  background: var(--card-bg) !important;
}

.el-pagination .el-input__inner {
  background: var(--card-bg) !important;
}

/* 全局加载遮罩样式 */
.el-loading-mask {
  background: rgba(0, 0, 0, 0.7) !important;
}

/* 卡片标题样式 */
.el-card__header {
  border-bottom: 1px solid var(--borderColor) !important;
  color: var(--cardTitleColor);
  font-weight: 500;
  background: var(--card-bg);
}

/* 卡片内容样式 */
.el-card__body {
  color: var(--cardTextColor);
  background: var(--card-bg);
}

/* 表格样式调整 */
.el-table {
  color: var(--textColor) !important;
}

.el-table th {
  color: var(--cardTitleColor) !important;
}

.el-table td {
  color: var(--cardTextColor) !important;
}
</style> 