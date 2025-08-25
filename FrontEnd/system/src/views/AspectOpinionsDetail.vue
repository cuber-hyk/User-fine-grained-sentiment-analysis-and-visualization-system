<template>
  <div class="detail-page" :data-magnified="true">
    <div class="header">
      <h1 class="title">主题挖掘分析</h1>
      <el-button icon="el-icon-back" @click="goBack">返回</el-button>
    </div>
    <div class="content magnified-content">
      <aspect-opinions-chart class="full-panel" :isMagnified="true" :initAspect="activeAspect" />
    </div>
  </div>
</template>

<script>
import AspectOpinionsChart from "@/components/AspectOpinionsChart.vue";
import { mapState } from 'vuex';

export default {
  name: "AspectOpinionsDetail",
  components: {
    AspectOpinionsChart
  },
  computed: {
    ...mapState(['activeAspect'])
  },
  methods: {
    goBack() {
      this.$router.push("/home");
    }
  }
};
</script>

<style scoped>
.detail-page[data-magnified="true"] {
  min-height: 100vh;
  padding: 32px 0 48px 0;
  background: linear-gradient(
    135deg,
    rgba(2, 166, 181, 0.1) 0%,
    rgba(2, 166, 181, 0.2) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(2, 166, 181, 0.3);
  width: 90vw;
  max-width: 1600px;
}
.title {
  color: #ffffff;
  font-size: 2.2rem;
  margin: 0;
  text-shadow: 0 0 15px rgba(2, 166, 181, 0.5);
}
.content.magnified-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  min-height: 80vh;
  height: 100%;
}
.full-panel {
  flex: 1;
  width: 90vw;
  max-width: 1600px;
  min-height: 70vh;
  background-color: rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  padding: 32px 24px 32px 24px;
  box-shadow: 0 0 32px rgba(2, 166, 181, 0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>