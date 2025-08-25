<template>
  <div class="sentiment-chart">
    <h2 class="panel-title">情感极性分析</h2>
    <div v-show="hasData !== null" ref="chartContainer" class="chart-container"></div>
    <div v-if="hasData === 'empty'" class="no-data">
      <el-empty description="暂无情感极性分析数据"></el-empty>
    </div>
  </div>
</template>

<script>
// 导入echarts库
import * as echarts from 'echarts'
// 导入vuex状态管理方法
import { mapState } from 'vuex'
// import axios from 'axios' // 移除：数据获取移至 store

// 定义SentimentChart组件
export default {
  name: 'SentimentChart',
  props: {
      isMagnified: { // 新增 prop
          type: Boolean,
          default: false
      }
  },
  data() {
    return {
      chart: null, // 初始化图表对象
      // sentimentData: { // 移除：数据从 store 获取
      //   Positive: 0,
      //   Negative: 0,
      //   Neutral: 0
      // }
    }
  },
  computed: {
    ...mapState(['productDetails', 'sentimentData']),
    hasData() {
      if (!this.sentimentData || typeof this.sentimentData !== 'object') return null;
      const { Positive = 0, Negative = 0, Neutral = 0 } = this.sentimentData;
      return Positive > 0 || Negative > 0 || Neutral > 0 ? true : 'empty';
    },
    // 移除 chartContainerStyle 计算属性，完全依赖 CSS 和 Flexbox
    // chartContainerStyle() {
    //     if (this.isMagnified) {
    //         return {
    //             height: 'calc(100% - 50px)',
    //             flexGrow: 0
    //         };
    //     } else {
    //         return {
    //             flex: 1
    //         };
    //     }
    // }
  },
  watch: {
    // 监视productDetails的变化 (如果图表完全依赖 sentimentData，此 watcher 可以移除)
    // handler(val) {
    //   if (val && val.sentiment) {
    //     this.$nextTick(() => {
    //       this.updateChart()
    //     })
    //   }
    // },
    // deep: true
    
    // 监视 store 中的 sentimentData 变化
    sentimentData: {
       handler(newVal) {
           if (newVal) {
                this.$nextTick(() => {
                    this.updateChart();
                });
           } else if (this.chart) {
               this.chart.clear();
           }
       },
       immediate: true, // 组件挂载后立即执行一次 handler，初始化图表
       deep: true // 深度监听对象内部变化
    },
    
    // 监听 isMagnified prop 的变化，强制调整图表尺寸
    isMagnified() {
        this.$nextTick(() => {
            this.resizeChart();
        });
    },
    hasData(newVal) {
      if (newVal !== null) {
        this.$nextTick(() => {
          this.initChart();
          this.updateChart(); // 保证切换回来时饼图能刷新
        });
      }
    },
  },
  mounted() {
    window.addEventListener('resize', this.resizeChart);
    this.$nextTick(() => {
      this.initChart();
      this.updateChart(); // 保证切回主页面时饼图能渲染
    });
  },
  beforeDestroy() {
    // 组件销毁前，清理资源
    if (this.chart) {
      this.chart.dispose(); // 释放图表实例
      this.chart = null;
    }
    window.removeEventListener('resize', this.resizeChart); // 移除事件监听
  },
  methods: {
    // 移除：数据获取移至 store
    // async fetchSentimentData(pid) {
    //   // ... 接口调用逻辑 ...
    // },
    initChart() {
      // 初始化图表
      if (this.chart) {
        this.chart.dispose(); // 释放已有图表实例
      }

      const chartContainer = this.$refs.chartContainer;
       if (!chartContainer) {
           console.error("Chart container DOM element not found!");
           return;
       }

       // 添加一个短暂延迟，确保DOM尺寸计算完成
       setTimeout(() => {
            // 确保容器有尺寸后再初始化
            // 在这里不再严格检查 offsetWidth/offsetHeight，依赖 CSS/动态样式和 resizeChart 的调用
            if (chartContainer.offsetWidth === 0 || chartContainer.offsetHeight === 0) {
                 console.warn("Chart container has zero dimensions after delay, skipping init.");
                 return;
            }
            this.chart = echarts.init(chartContainer); // 创建新的图表实例

            // 初始化后强制调整图表大小
            this.resizeChart();

            // 如果数据已加载，更新图表
            if (this.sentimentData) {
                this.updateChart();
            }
       }, 100); // 100毫秒延迟，可根据需要调整
    },
    updateChart() {
      // 更新图表的数据
      // 使用从 store 获取的 sentimentData
      if (!this.chart || !this.sentimentData) {
           // 数据或图表实例不存在时清空图表
            if (this.chart) { 
                this.chart.clear();
            }
            return; // 数据为空或图表未初始化，不进行更新
        }

      const { Positive, Negative, Neutral } = this.sentimentData;
      
       // 检查是否有有效数据需要渲染
        if (Positive === 0 && Negative === 0 && Neutral === 0) {
            this.chart.clear(); // 如果数据都是零，清空图表
            return;
        }

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          orient: 'vertical',
          //left: 'left',
          left: 'right',
          textStyle: {
            color: '#fff'
          },
          data: ['正面', '负面', '中性'] // 图例数据
        },
        series: [
          {
            name: '情感分析',
            type: 'pie', // 饼图类型
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}: {d}%', // 标签格式显示百分比
              color: '#fff',
              fontSize: 14
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '16',
                fontWeight: 'bold'
              }
            },
            data: [
              { 
                value: Positive, // 使用获取的正面情感计数
                name: '正面', 
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#67e0e3' },
                    { offset: 1, color: '#32c5e9' }
                  ])
                } 
              },
              { 
                value: Negative, // 使用获取的负面情感计数
                name: '负面', 
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#ff9f7f' },
                    { offset: 1, color: '#fb7293' }
                  ])
                } 
              },
              { 
                value: Neutral, // 使用获取的中性情感计数
                name: '中性', 
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#9fe6b8' },
                    { offset: 1, color: '#37a2da' } // 调整中性颜色
                  ])
                } 
              }
            ]
          }
        ]
      };

      this.chart.setOption(option); // 设置图表选项
       this.resizeChart(); // 数据更新后强制调整图表大小
    },
    resizeChart() {
      // 处理图表大小调整
      if (this.chart) {
        const chartContainer = this.$refs.chartContainer;
        if (chartContainer && chartContainer.offsetWidth > 0 && chartContainer.offsetHeight > 0) {
             this.chart.resize(); // 仅在容器有有效尺寸时调整
        } else {
            console.warn("Chart container has zero dimensions or not ready, skipping resize."); // 优化提示信息
        }
      }
    },
  },
}
</script>

<style scoped>
.sentiment-chart {
  position: relative;
  height: 100%;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.panel-title {
  font-size: 20px;
  margin-bottom: 25px;
  color: #ffffff;
  font-weight: 500;
  letter-spacing: 1px;
  text-align: center; /* 标题居中 */
  /* Flex item default: flex-shrink: 0 */
}

.chart-container {
  flex: 1; /* 重新添加：填充剩余空间 */
  /* width: 100%; */ /* 移除：flex: 1 会处理宽度 */
  /* min-height: 200px; */ /* 移除：由 flex: 1 控制 */
  /* 如果放大时需要固定高度，可以通过父容器或更上层布局控制 */
}

.no-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.no-data >>> .el-empty__description p {
  color: rgba(255, 255, 255, 0.7);
}
</style>