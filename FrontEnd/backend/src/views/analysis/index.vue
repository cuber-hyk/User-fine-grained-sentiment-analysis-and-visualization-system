<template>
  <div class="analysis-container">
    <!-- 情感分析概览卡片 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="8">
        <el-card shadow="hover" class="analysis-card">
          <div class="card-header">
            <span>总评论数</span>
          </div>
          <div class="card-content">
            <div class="number">{{ totalComments }}</div>
            <div class="trend">
              <span :class="['trend-value', trendClass]"> {{ trend }}% </span>
              较上周
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="analysis-card">
          <div class="card-header">
            <span>好评率</span>
          </div>
          <div class="card-content">
            <div class="number">{{ positiveRate }}%</div>
            <el-progress :percentage="positiveRate" :color="customColors">
            </el-progress>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="analysis-card">
          <div class="card-header">
            <span>平均评分</span>
          </div>
          <div class="card-content">
            <div class="number">{{ averageScore }}</div>
            <el-rate
              v-model="averageScore"
              disabled
              show-score
              text-color="#ff9900"
            >
            </el-rate>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 情感分布和评论趋势 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">
            <span>情感分布分析</span>
          </div>
          <div class="chart-container">
            <sentiment-pie :data="sentimentData" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header">
            <span>评论热度趋势</span>
          </div>
          <div class="chart-container">
            <sentiment-trend :data="trendData" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 评价标签分析 -->
    <el-card shadow="hover">
      <div slot="header">
        <span>评价标签分析</span>
      </div>
      <div class="tags-container">
        <div
          v-for="(tags, category) in reviewTags"
          :key="category"
          class="tag-group"
        >
          <h4>{{ category }}</h4>
          <el-tag
            v-for="tag in tags"
            :key="tag"
            :type="getTagType(tag)"
            class="tag-item"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import SentimentPie from "@/components/charts/SentimentPie";
import SentimentTrend from "@/components/charts/SentimentTrend";

export default {
  name: "Analysis",
  components: {
    SentimentPie,
    SentimentTrend,
  },
  data() {
    return {
      totalComments: 1234,
      trend: 15.8,
      positiveRate: 85,
      averageScore: 4.5,
      customColors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ],
      sentimentData: {
        正面: 50,
        负面: 20,
        中性: 30,
      },
      trendData: [
        { date: "2024-01-01", heat: 4.7 },
        { date: "2024-01-02", heat: 4.5 },
        { date: "2024-01-03", heat: 4.8 },
        { date: "2024-01-04", heat: 4.6 },
        { date: "2024-01-05", heat: 4.9 },
      ],
      reviewTags: {
        屏幕: ["分辨率高", "色彩丰富"],
        GPU: ["一流", "够用"],
        散热: ["非常好", "正常"],
      },
    };
  },
  computed: {
    trendClass() {
      return this.trend >= 0 ? "trend-up" : "trend-down";
    },
  },
  methods: {
    getTagType(tag) {
      const positiveWords = ["高", "好", "一流", "丰富"];
      const negativeWords = ["差", "慢", "弱"];

      if (positiveWords.some((word) => tag.includes(word))) {
        return "success";
      }
      if (negativeWords.some((word) => tag.includes(word))) {
        return "danger";
      }
      return "info";
    },
  },
};
</script>

<style scoped>
.analysis-container {
  padding: 20px;
}

.mb-4 {
  margin-bottom: 20px;
}

.analysis-card {
  height: 180px;
}

.card-header {
  font-size: 16px;
  color: #606266;
  margin-bottom: 15px;
}

.card-content {
  text-align: center;
}

.number {
  font-size: 36px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
}

.trend {
  font-size: 14px;
  color: #909399;
}

.trend-value {
  font-weight: bold;
  margin-right: 5px;
}

.trend-up {
  color: #67c23a;
}

.trend-down {
  color: #f56c6c;
}

.chart-container {
  height: 300px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.tag-group {
  min-width: 200px;
}

.tag-group h4 {
  margin: 0 0 10px 0;
  color: #606266;
}

.tag-item {
  margin: 0 5px 5px 0;
}
</style>