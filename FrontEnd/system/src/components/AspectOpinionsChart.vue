<template>
  <div class="aspect-opinions-chart" :data-magnified="isMagnified">
    <h2 class="panel-title">主题挖掘</h2>
    <div v-if="aspectOpinions && aspectOpinions.length > 0" class="chart-content">
      <el-tabs v-model="localActiveAspect" type="card" @tab-click="handleTabClick">
        <el-tab-pane 
          v-for="(aspectData, index) in aspectOpinions" 
          :key="index"
          :label="aspectData.aspect"
          :name="aspectData.aspect"
        >
          <div class="aspect-card" :style="aspectCardStyle">
            <div class="sentiment-word-clouds">
              <div class="chart-section">
                <el-empty v-if="!getCombinedWordCloudData(aspectData).length" description="暂无词云数据"></el-empty>
                <div v-else-if="localActiveAspect === aspectData.aspect"
                  :ref="'wordCloudCombined_' + aspectData.aspect"
                  class="word-cloud-chart"
                  :style="wordCloudChartStyle"></div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else class="no-data">
      <el-empty description="暂无主题挖掘数据"></el-empty>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import 'echarts-wordcloud'; // 引入词云图扩展
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AspectOpinionsChart',
  props: {
      isMagnified: {
          type: Boolean,
          default: false
      },
      initAspect: {
          type: String,
          default: ''
      }
  },
  data() {
    return {
      charts: {},
      localActiveAspect: this.activeAspect || this.initAspect
    };
  },
  computed: {
    ...mapState(['aspectOpinions', 'activeAspect']),
    currentAspectData() {
      if (!this.aspectOpinions || this.aspectOpinions.length === 0) return null;
      return this.aspectOpinions.find(item => item.aspect === this.localActiveAspect) || this.aspectOpinions[0];
    },
    // 为词云图准备数据，按情感过滤
    wordCloudDataPos() {
        return this.filterWordCloudData('pos');
    },
    wordCloudDataNeg() {
        return this.filterWordCloudData('neg');
    },
    wordCloudDataNeu() {
        return this.filterWordCloudData('neu');
    },
    aggregatedOpinionsWithDominantSentiment() {
      if (!this.currentAspectData || !this.currentAspectData.opinions) return [];
      const opinionMap = new Map();

      this.currentAspectData.opinions.forEach((opinion, index) => {
        const lowerCaseOpinion = opinion.toLowerCase();
        const sentiment = this.currentAspectData.sentiments[index] ? this.currentAspectData.sentiments[index].toLowerCase() : 'neu';

        if (!opinionMap.has(lowerCaseOpinion)) {
          opinionMap.set(lowerCaseOpinion, { count: 0, posCount: 0, negCount: 0, neuCount: 0 });
        }

        const current = opinionMap.get(lowerCaseOpinion);
        current.count++;
        if (sentiment === 'pos') {
          current.posCount++;
        } else if (sentiment === 'neg') {
          current.negCount++;
        } else {
          current.neuCount++;
        }
      });

      const aggregatedList = [];
      opinionMap.forEach((counts, word) => {
        let dominantSentiment = 'neu'; // Default to neutral
        if (counts.posCount > counts.negCount && counts.posCount > counts.neuCount) {
          dominantSentiment = 'pos';
        } else if (counts.negCount > counts.posCount && counts.negCount > counts.neuCount) {
          dominantSentiment = 'neg';
        } else if (counts.neuCount > counts.posCount && counts.neuCount > counts.negCount) {
           dominantSentiment = 'neu';
        } else if (counts.posCount > 0) { // Handle ties or cases where one is not strictly greater
            dominantSentiment = 'pos';
        } else if (counts.neuCount > 0) {
            dominantSentiment = 'neu';
        } else if (counts.negCount > 0) {
            dominantSentiment = 'neg';
        }

        aggregatedList.push({
          word: word,
          count: counts.count,
          dominantSentiment: dominantSentiment
        });
      });

      return aggregatedList;
    },
    // 根据 isMagnified prop 动态调整 aspect-card 的样式 (垂直居中)
    aspectCardStyle() {
        return {
            justifyContent: this.isMagnified ? 'center' : 'flex-start'
        };
    },
    // 根据 isMagnified prop 动态调整词云图容器的高度
    wordCloudChartStyle() {
        if (this.isMagnified) {
            return {
                height: 'calc(100vh - 180px)', // 放大时更大高度
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            };
        } else {
            return {
                height: '350px', // 未放大时也给较大高度
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            };
        }
    },
  },
  watch: {
    aspectOpinions: {
      handler(val) {
        if (val && val.length > 0) {
          // 只有当当前标签不存在时才切换
          if (!this.localActiveAspect || !val.find(item => item.aspect === this.localActiveAspect)) {
             this.localActiveAspect = val[0].aspect;
             this.$store.commit('SET_ACTIVE_ASPECT', val[0].aspect);
          }
          this.$nextTick(() => {
            this.initCharts();
          });
        } else {
            this.disposeCharts();
            this.localActiveAspect = '';
            this.$store.commit('SET_ACTIVE_ASPECT', '');
        }
      },
      immediate: true,
      deep: true
    },
    localActiveAspect(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$store.commit('SET_ACTIVE_ASPECT', newVal);
        this.disposeCharts(oldVal);
        this.$nextTick(() => {
          this.initCharts();
        });
      }
    },
    isMagnified() {
        this.$nextTick(() => {
            this.resizeCharts();
        });
    },
    initAspect(newVal) {
      if (newVal && newVal !== this.localActiveAspect) {
        this.localActiveAspect = newVal;
      }
    },
  },
  mounted() {
    if ((!this.localActiveAspect || !this.aspectOpinions.find(item => item.aspect === this.localActiveAspect)) && this.aspectOpinions && this.aspectOpinions.length > 0) {
      this.localActiveAspect = this.aspectOpinions[0].aspect;
      this.$store.commit('SET_ACTIVE_ASPECT', this.localActiveAspect);
      this.$nextTick(() => {
        this.initCharts();
      });
    } else if (this.localActiveAspect && this.aspectOpinions && this.aspectOpinions.length > 0) {
      this.$nextTick(() => {
        this.initCharts();
      });
    }
    window.addEventListener('resize', this.resizeCharts);
  },
  beforeDestroy() {
    this.disposeCharts();
    window.removeEventListener('resize', this.resizeCharts);
  },
  methods: {
    ...mapActions(['removeFromFavorites', 'fetchProductDetails', 'updateUserBasicInfo', 'updateUserPhone', 'updateUserPassword']),
    handleTabClick(tab) {
      const selectedAspect = tab.name;
      this.localActiveAspect = selectedAspect;
      this.$store.commit('SET_ACTIVE_ASPECT', selectedAspect);
    },
    filterWordCloudData(sentiment) {
        if (!this.aggregatedOpinionsWithDominantSentiment) return [];
        return this.aggregatedOpinionsWithDominantSentiment
            .filter(item => item.dominantSentiment === sentiment)
            .map(item => ({
                name: item.word,
                value: item.count
            }));
    },
    getCombinedWordCloudData(aspectData) {
      if (!aspectData || !aspectData.opinions) return [];
      const opinionMap = new Map();
      aspectData.opinions.forEach((opinion, index) => {
        const lowerCaseOpinion = opinion.toLowerCase();
        const sentiment = aspectData.sentiments[index] ? aspectData.sentiments[index].toLowerCase() : 'neu';
        if (!opinionMap.has(lowerCaseOpinion)) {
          opinionMap.set(lowerCaseOpinion, { count: 0, sentiment });
        }
        opinionMap.get(lowerCaseOpinion).count++;
        opinionMap.get(lowerCaseOpinion).sentiment = sentiment;
      });
      return Array.from(opinionMap.entries()).map(([word, { count, sentiment }]) => ({
        name: word,
        value: count,
        sentiment
      }));
    },
    initCharts() {
      if (!this.localActiveAspect) return;
      this.$nextTick(() => {
        const containerArray = this.$refs['wordCloudCombined_' + this.localActiveAspect];
        const container = containerArray && containerArray.length > 0 ? containerArray[0] : null;
        if (!container || !(container instanceof HTMLElement)) {
          console.warn('词云容器未找到，跳过初始化');
          return;
        }
        if (this.charts[this.localActiveAspect] && this.charts[this.localActiveAspect].combined) {
          this.charts[this.localActiveAspect].combined.dispose();
        }
        this.$set(this.charts, this.localActiveAspect, {});
        try {
          this.$set(this.charts[this.localActiveAspect], 'combined', echarts.init(container));
        } catch (error) {
          console.error('初始化词云图失败:', error);
        }
        this.updateCharts();
        this.resizeCharts();
      });
    },
    updateCharts() {
      const aspect = this.localActiveAspect;
      if (!aspect || !this.charts[aspect] || !this.charts[aspect].combined) return;
      const aspectData = this.aspectOpinions.find(item => item.aspect === aspect);
      const data = this.getCombinedWordCloudData(aspectData);
      if (!data || data.length === 0) {
        this.charts[aspect].combined.clear();
        return;
      }
      const colorMap = {
        pos: '#68f1fa',
        neg: '#ff7675',
        neu: '#ffeaa7'
      };
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          show: true,
          formatter: function(params) {
            let label = params.data.sentiment === 'pos' ? '正面' : params.data.sentiment === 'neg' ? '负面' : '中性';
            return `${params.name}: ${params.value} (${label})`;
          }
        },
        series: [{
          type: 'wordCloud',
          shape: 'circle',
          gridSize: 2,
          sizeRange: [30, 90],
          rotationRange: [-30, 30],
          rotationStep: 15,
          layoutAnimation: false,
          drawOutOfBound: true,
          keepAspect: true,
          textStyle: {
            fontFamily: 'Arial, Helvetica, sans-serif',
            color: function(params) {
              return colorMap[params.data.sentiment] || '#fff';
            },
            fontWeight: 'normal',
          },
          emphasis: {
            focus: 'self',
            textStyle: {
              shadowBlur: 20,
              shadowColor: '#333',
              fontSize: 100,
              fontWeight: 'normal',
            }
          },
          data: data
        }]
      };
      this.charts[aspect].combined.setOption(option);
      this.resizeCharts();
    },
    resizeCharts() {
        const aspect = this.localActiveAspect;
        if (!aspect || !this.charts[aspect]) return;
        for (const sentiment in this.charts[aspect]) {
            if (this.charts[aspect][sentiment]) {
                this.charts[aspect][sentiment].resize({
                    animation: {
                        duration: 0
                    }
                });
            }
        }
    },
    disposeCharts(aspect = null) {
        const aspectToDispose = aspect || this.localActiveAspect;
        if (aspectToDispose && this.charts[aspectToDispose]) {
            for (const sentiment in this.charts[aspectToDispose]) {
                if (this.charts[aspectToDispose][sentiment]) {
                    this.charts[aspectToDispose][sentiment].dispose();
                }
            }
            this.$delete(this.charts, aspectToDispose);
        } else if (!aspect) {
             // 销毁所有图表
            for (const aspectKey in this.charts) {
                 for (const sentiment in this.charts[aspectKey]) {
                    if (this.charts[aspectKey][sentiment]) {
                        this.charts[aspectKey][sentiment].dispose();
                    }
                 }
            }
            this.charts = {};
        }
    },
    getPositiveCount(aspectData) {
      if (!aspectData || !aspectData.sentiments) return 0;
      return aspectData.sentiments.filter(s => s === 'pos').length;
    },
    getNegativeCount(aspectData) {
      if (!aspectData || !aspectData.sentiments) return 0;
      return aspectData.sentiments.filter(s => s === 'NEG' || s === 'neg').length;
    },
    getNeutralCount(aspectData) {
      if (!aspectData || !aspectData.sentiments) return 0;
      return aspectData.sentiments.filter(s => s === 'NEU' || s === 'neu').length;
    },
    getSentimentType(sentiment) {
      if (!sentiment) return 'info';
      const lowerSentiment = sentiment.toLowerCase();
      if (lowerSentiment === 'pos') return 'success';
      if (lowerSentiment === 'neg') return 'danger';
      return 'info'; // neu
    },
    getSentimentLabel(sentiment) {
      if (!sentiment) return '中性';
      const lowerSentiment = sentiment.toLowerCase();
      if (lowerSentiment === 'pos') return '正面';
      if (lowerSentiment === 'neg') return '负面';
      return '中性';
    },
  }
};
</script>

<style scoped>
.aspect-opinions-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 20px; /* 保留外层 padding */
  box-shadow: 0 0 20px rgba(2, 166, 181, 0.2);
  color: #ffffff;
}

.panel-title {
  font-size: 20px;
  margin-bottom: 15px; /* 减小底部 margin */
  color: #ffffff;
  font-weight: 500;
  letter-spacing: 1px;
  text-align: center;
}

.chart-content {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0; /* 移除内边距 */
}

.aspect-opinions-chart >>> .el-tabs__header {
    border-bottom: 1px solid rgba(2, 166, 181, 0.3);
    border-bottom-color: transparent;
    margin-bottom: 10px; /* 减小底部 margin */
}

.aspect-opinions-chart >>> .el-tabs__nav {
    border: none;
}

.aspect-opinions-chart >>> .el-tabs__item {
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid transparent;
    margin-right: 5px;
    transition: all 0.3s ease;
    border-radius: 4px 4px 0 0;
}

.aspect-opinions-chart >>> .el-tabs__item.is-active {
    color: #68f1fa;
    background-color: rgba(2, 166, 181, 0.2);;
    border-color: rgba(2, 166, 181, 0.5);
    border-bottom-color: transparent;
}

.aspect-opinions-chart >>> .el-tabs__item:hover {
    color: #68f1fa;
}

.aspect-opinions-chart >>> .el-tabs__nav-wrap::after {
    background-color: transparent;
}

.aspect-opinions-chart >>> .el-tabs__content {
    padding: 0; /* 移除内边距 */
    flex: 1;
    height: 100%;
    display: flex; /* 添加 flex 布局 */
    flex-direction: column; /* 垂直布局内容 */
    /* justify-content: center; /* 移除，由 aspect-card 处理 */
    /* align-items: center; /* 移除，由 aspect-card 处理 */
}

.aspect-opinions-chart >>> .el-tabs__content .el-tab-pane {
    height: 100%;
    display: flex;
    flex-direction: column;
    /* justify-content: center; /* 移除，由 aspect-card 处理 */
    /* align-items: center; /* 移除，由 aspect-card 处理 */
}

.aspect-card {
  padding: 0;
  margin: 0;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 移除 aspect-header 的样式 */
/* ... */

/* 移除评价词列表的样式 */
/* ... */

/* 新增样式 */
.sentiment-word-clouds {
  flex: 1;
  min-height: 0;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-section {
  flex: 1;
  min-height: 0;
  padding: 0;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.chart-section h4 {
    flex-shrink: 0; /* 防止标题在空间不足时缩小 */
    color: #68f1fa;
    margin-bottom: 8px; /* 减小底部 margin */
    text-align: center;
    border-bottom: 1px dashed rgba(2, 166, 181, 0.3);
    padding-bottom: 4px; /* 减小底部 padding */
    width: 100%; /* 标题占满宽度 */
    box-sizing: border-box;
    font-size: 16px; /* 调整标题字体大小 */
}

.word-cloud-chart {
  width: 100% !important;
  height: 300px !important; /* 临时写死高度，调试用 */
  min-height: 200px;
  max-height: 100%;
  flex: none !important;
  margin: 0;
  padding: 0;
  background: rgba(255,255,255,0.05) !important;
}

.no-data {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-data >>> .el-empty__description p {
    color: rgba(255, 255, 255, 0.7);
}

.aspect-card, .chart-section, .sentiment-word-clouds, .word-cloud-chart {
  height: 300px !important;
  min-height: 300px !important;
  max-height: 300px !important;
  width: 100% !important;
  overflow: hidden;
  flex: none !important;
  margin: 0;
  padding: 0;
}

/* 放大时整体居中和变大 */
.aspect-opinions-chart[data-magnified="true"] {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.aspect-opinions-chart[data-magnified="true"] .panel-title {
  font-size: 2.4rem;
  margin-bottom: 40px;
  text-align: center;
  font-weight: 600;
  letter-spacing: 2px;
}
.aspect-opinions-chart[data-magnified="true"] >>> .el-tabs__header {
  overflow-x: auto !important;
  white-space: nowrap !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
  background: rgba(0, 0, 0, 0.10);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(2,166,181,0.08);
  max-width: 1200px;
  margin: 0 auto 48px auto !important;
  padding: 0 16px;
  display: flex;
  justify-content: flex-start;
}
.aspect-opinions-chart[data-magnified="true"] >>> .el-tabs__header::-webkit-scrollbar {
  display: none;
}
.aspect-opinions-chart[data-magnified="true"] >>> .el-tabs__nav {
  display: inline-flex !important;
  min-width: max-content;
}
.aspect-opinions-chart[data-magnified="true"] >>> .el-tabs__item {
  font-size: 1.3rem;
  padding: 0 32px;
  border-radius: 6px 6px 0 0;
  transition: all 0.2s;
}
.aspect-opinions-chart[data-magnified="true"] >>> .el-tabs__item.is-active {
  color: #68f1fa !important;
  background-color: rgba(2, 166, 181, 0.2) !important;
  border-color: rgba(2, 166, 181, 0.5) !important;
  border-bottom-color: transparent !important;
}
.aspect-opinions-chart[data-magnified="true"] >>> .el-tabs__item:hover {
  color: #68f1fa !important;
}
.aspect-opinions-chart[data-magnified="true"] .chart-section,
.aspect-opinions-chart[data-magnified="true"] .sentiment-word-clouds,
.aspect-opinions-chart[data-magnified="true"] .aspect-card {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 75vh !important;
  min-height: 500px !important;
}
.aspect-opinions-chart[data-magnified="true"] .word-cloud-chart {
  height: 65vh !important;
  min-height: 400px !important;
  max-width: 90vw;
  margin: 0 auto;
}
</style>