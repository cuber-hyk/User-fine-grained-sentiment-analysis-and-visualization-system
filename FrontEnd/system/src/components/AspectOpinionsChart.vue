<template>
  <div class="aspect-opinions-chart" :data-magnified="isMagnified">
    <h2 class="panel-title">主题挖掘</h2>
    <div v-if="aspectOpinions && aspectOpinions.length > 0" class="reviews-content">
      <div 
        v-for="(aspectData, index) in aspectOpinions" 
        :key="index"
        class="aspect-card"
      >
        <div class="aspect-title">{{ aspectData.aspect }}</div>
        <div class="opinions-list">
          <el-tag 
            v-for="(opinion, opinionIndex) in filterUniqueOpinions(aspectData.opinions, aspectData.sentiments)" 
            :key="opinionIndex"
            :type="getTagType(opinion.sentiment)"
            class="opinion-tag"
            size="medium"
          >
            {{ opinion.text }}
          </el-tag>
        </div>
      </div>
    </div>
    <div v-else class="no-reviews">
      <el-empty description="暂无主题挖掘数据"></el-empty>
    </div>
  </div>
</template>

<script>
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
  computed: {
    ...mapState(['aspectOpinions'])
  },
  methods: {
    ...mapActions(['removeFromFavorites', 'fetchProductDetails', 'updateUserBasicInfo', 'updateUserPhone', 'updateUserPassword']),
    getTagType(sentiment) {
      if (!sentiment) return '';
      const lowerSentiment = sentiment.toLowerCase();
      if (lowerSentiment === 'pos') return 'success';
      if (lowerSentiment === 'neg') return 'danger';
      return 'info';
    },
    filterUniqueOpinions(opinions, sentiments) {
      const uniqueOpinions = [];
      const opinionMap = new Map();
      
      if (!opinions || !sentiments) return [];
      
      opinions.forEach((opinion, index) => {
        const lowerOpinion = opinion.toLowerCase();
        if (!opinionMap.has(lowerOpinion)) {
          opinionMap.set(lowerOpinion, true);
          uniqueOpinions.push({
            text: opinion,
            sentiment: sentiments[index]
          });
        }
      });
      
      return uniqueOpinions;
    }
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
  padding: 20px;
  box-shadow: 0 0 20px rgba(2, 166, 181, 0.2);
  color: #ffffff;
}

.reviews-display {
  height: 100%;
  display: flex;
  flex-direction: column;
}
 
.panel-title {
  font-size: 20px;
  margin-bottom: 25px;
  color: #ffffff;
  font-weight: 500;
  letter-spacing: 1px;
  text-align: center;
}
 
.reviews-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}
 
.aspect-card {
  margin-bottom: 20px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.aspect-card:hover {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(2, 166, 181, 0.15);
}
 
.aspect-title {
  font-weight: bold;
  margin-bottom: 15px;
  color: #ffffff;
  font-size: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px;
  display: flex;
  align-items: center;
}

.aspect-title::before {
  content: '';
  width: 4px;
  height: 18px;
  background: linear-gradient(135deg, #68f1fa, #02a6b5);
  margin-right: 12px;
  border-radius: 2px;
}
 
.opinions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
 
.opinion-tag {
  margin-right: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  padding: 6px 12px;
  line-height: 1.3;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.opinion-tag:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
 
.no-reviews {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 自定义滚动条样式 */
.reviews-content::-webkit-scrollbar {
  width: 8px;
}

.reviews-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.reviews-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #68f1fa, #02a6b5);
  border-radius: 4px;
}

.reviews-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #02a6b5, #68f1fa);
}

/* 放大时的样式调整 */
.aspect-opinions-chart[data-magnified="true"] .panel-title {
  font-size: 2.4rem;
  margin-bottom: 40px;
  text-align: center;
  font-weight: 600;
  letter-spacing: 2px;
}

.aspect-opinions-chart[data-magnified="true"] .aspect-title {
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.aspect-opinions-chart[data-magnified="true"] .opinion-tag {
  font-size: 1.2rem;
  padding: 12px 20px;
  margin-right: 15px;
  margin-bottom: 15px;
  line-height: 1.4;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.aspect-opinions-chart[data-magnified="true"] .aspect-card {
  padding: 30px;
  margin-bottom: 30px;
}

.aspect-opinions-chart[data-magnified="true"] .reviews-content {
  padding-right: 20px;
}

.aspect-opinions-chart[data-magnified="true"] .opinions-list {
  gap: 15px;
}
</style>