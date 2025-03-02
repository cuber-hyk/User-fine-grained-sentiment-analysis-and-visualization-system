<template>
  <div class="home">
    <div class="head">
      <h1 class="title">可视化智能评论分析系统</h1>
      <div class="nav">
        <div
          v-if="username"
          class="nav-link user-profile"
          @click="goToUserProfile"
        >
          <img
            v-if="user.icon"
            :src="user.icon"
            alt="用户头像"
            class="user-avatar"
          />
          <span class="username">{{ username }}</span>
        </div>
        <div v-else class="auth-links">
          <router-link :to="'/Register'" class="nav-link">注册</router-link>
          <router-link :to="'/Login'" class="nav-link">登录</router-link>
        </div>
      </div>
    </div>
    <div class="content-grid">
      <div class="row">
        <search-panel class="panel" />
        <product-display class="panel" />
        <sentiment-chart class="panel" />
      </div>
      <div class="row">
        <trend-chart class="panel" />
        <reviews-display class="panel" />
        <source-chart class="panel" />
      </div>
    </div>
    <!-- 添加 UserProfile 组件，通过 v-if 控制显示 -->
    <user-profile v-if="showUserProfile" @close="showUserProfile = false" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import SearchPanel from "@/components/SearchPanel.vue";
import ProductDisplay from "@/components/ProductDisplay.vue";
import SentimentChart from "@/components/SentimentChart.vue";
import TrendChart from "@/components/TrendChart.vue";
import ReviewsDisplay from "@/components/ReviewsDisplay.vue";
import SourceChart from "@/components/SourceChart.vue";
import UserProfile from "@/components/UserProfile.vue"; // 引入 UserProfile 组件

export default {
  name: "HomePage",
  components: {
    SearchPanel,
    ProductDisplay,
    SentimentChart,
    TrendChart,
    ReviewsDisplay,
    SourceChart,
    UserProfile, // 注册 UserProfile 组件
  },
  data() {
    return {
      showUserProfile: false, // 控制 UserProfile 组件的显示与隐藏
    };
  },
  computed: {
    ...mapState({
      username: (state) => state.user.username,
      user: (state) => state.user,
    }),
  },
  methods: {
    ...mapActions(["fetchUserInfo"]),
    async goToUserProfile() {
      try {
        // 点击时再次触发获取信息的请求
        await this.fetchUserInfo();
        this.showUserProfile = true; // 显示 UserProfile 组件
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    },
  },
  async created() {
    if (this.user.userId) {
      try {
        // 登录后触发获取信息的请求
        await this.fetchUserInfo();
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    }
  },
};
</script>

<style scoped>
.home {
  padding: 20px;
  min-height: 100vh;
}

.head {
  position: relative;
  height: 80px;
  background: linear-gradient(
    90deg,
    rgba(2, 166, 181, 0.1) 0%,
    rgba(2, 166, 181, 0.2) 50%,
    rgba(2, 166, 181, 0.1) 100%
  );
  margin-bottom: 30px;
  border: 1px solid rgba(2, 166, 181, 0.3);
  border-radius: 4px;
  padding: 0 20px;
}

.title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  font-size: 36px;
  letter-spacing: 2px;
  text-shadow: 0 0 15px rgba(2, 166, 181, 0.5);
}

.nav {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}

.auth-links {
  display: flex;
  gap: 15px;
}

.nav-link {
  color: #ffffff;
  font-size: 16px;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.nav-link:hover {
  color: #68f1fa;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.user-profile:hover {
  opacity: 0.8;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-size: 16px;
  color: #ffffff;
}

.content-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 20px;
}

.row {
  display: flex;
  gap: 20px;
  height: calc(50vh - 80px);
  min-height: 400px;
}

.panel {
  flex: 1;
  padding: 20px;
  transition: all 0.3s ease;
}

.panel:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 25px rgba(2, 166, 181, 0.2);
}

@media (max-width: 1600px) {
  .content-grid {
    max-width: 1400px;
  }
}
</style>
