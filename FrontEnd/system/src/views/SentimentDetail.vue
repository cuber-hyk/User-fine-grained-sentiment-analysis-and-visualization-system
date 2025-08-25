<template>
  <div class="detail-page">
    <div class="header">
      <h1 class="title">情感极性分析</h1>
      <el-button icon="el-icon-back" @click="goBack">返回</el-button>
    </div>
    <div class="content">
      <sentiment-chart class="full-panel" :isMagnified="true" />
    </div>
  </div>
</template>

<script>
import SentimentChart from "@/components/SentimentChart.vue";

export default {
  name: "SentimentDetail",
  components: {
    SentimentChart
  },
  methods: {
    goBack() {
      this.$router.push("/home");
    }
  }
};
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(
    135deg,
    rgba(2, 166, 181, 0.1) 0%,
    rgba(2, 166, 181, 0.2) 100%
  );
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(2, 166, 181, 0.3);
}

.title {
  color: #ffffff;
  font-size: 28px;
  letter-spacing: 2px;
  text-shadow: 0 0 15px rgba(2, 166, 181, 0.5);
  margin: 0;
}

.content {
  height: calc(100vh - 100px);
}

.full-panel {
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(2, 166, 181, 0.2);
}
</style>