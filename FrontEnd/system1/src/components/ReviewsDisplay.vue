<template>
  <div class="reviews-display">
    <h2 class="panel-title">评论分析</h2>
    <div v-if="productDetails" class="reviews-content">
      <el-card
        v-for="(opinions, aspect) in productDetails.reviews"
        :key="aspect"
        class="aspect-card"
      >
        <div class="aspect-title">{{ aspect }}</div>
        <div class="opinions-list">
          <el-tag
            v-for="(opinion, index) in opinions"
            :key="index"
            :type="getTagType(index)"
            class="opinion-tag"
          >
            {{ opinion }}
          </el-tag>
        </div>
      </el-card>
    </div>
    <div v-else class="no-reviews">
      <el-empty description="暂无评论数据"></el-empty>
    </div>
  </div>
</template>
 
<script>
import { mapState } from 'vuex'
 
// 组件定义
export default {
  name: 'ReviewsDisplay',
  computed: {
    ...mapState(['productDetails'])
  },
  // 方法属性
  methods: {
    // 获取标签类型
    getTagType(index) {
      const types = ['', 'success', 'warning', 'info']
      return types[index % types.length]
    }
  }
}
</script>
 
<style scoped>
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
}
 
.reviews-content {
  flex: 1;
  overflow-y: auto;
}
 
.aspect-card {
  margin-bottom: 15px;
}
 
.aspect-title {
  font-weight: bold;
  margin-bottom: 10px;
  color: #ffffff;
}
 
.opinions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
 
.opinion-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}
 
.no-reviews {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>