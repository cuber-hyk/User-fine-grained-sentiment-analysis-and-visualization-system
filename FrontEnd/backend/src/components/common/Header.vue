<template>
  <el-header height="60px" class="header">
    <div class="header-content">
      <div class="left-section">
        <i
          :class="[
            'collapse-btn',
            isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold',
          ]"
          @click="toggleSidebar"
        ></i>
      </div>

      <div class="center-section">
        <h2>{{ $route.meta.title || "商品评论情感分析系统" }}</h2>
      </div>

      <div class="header-right">
        <router-link to="/login" v-if="!isLoggedIn">
          <el-button type="primary" size="small">登录</el-button>
        </router-link>
        <template v-else>
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              {{ userInfo.nickname || userInfo.username }}
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </div>
    </div>
  </el-header>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Header",
  props: {
    toggleSidebar: {
      type: Function,
      required: true,
    },
    isCollapse: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState({
      isLoggedIn: (state) => state.user.isLoggedIn,
      userInfo: (state) => state.user.userInfo,
    }),
  },
  methods: {
    ...mapActions(["logout"]),
    async handleCommand(command) {
      if (command === "logout") {
        await this.logout();
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style scoped>
.header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 15px;
  margin: 0;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-content {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-section {
  width: 60px;
}

.center-section {
  flex: 1;
  text-align: center;
}

.center-section h2 {
  margin: 0;
  font-size: 18px;
  color: #303133;
  font-weight: 500;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
  transition: color 0.3s;
}

.collapse-btn:hover {
  color: #409eff;
}

.header-right {
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #606266;
  font-size: 14px;
}

.user-info i {
  margin-left: 4px;
}
</style> 