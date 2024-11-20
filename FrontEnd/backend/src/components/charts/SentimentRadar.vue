<template>
  <div ref="chartRef" class="sentiment-radar"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "SentimentRadar",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  methods: {
    initChart() {
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chartRef);
      }

      const option = {
        tooltip: {
          trigger: "item",
        },
        radar: {
          shape: "circle",
          indicator: Object.keys(this.data).map((key) => ({
            name: key,
            max: 10,
          })),
          splitArea: {
            areaStyle: {
              color: ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.1)"],
            },
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.1)",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.1)",
            },
          },
          name: {
            textStyle: {
              color: "#909399",
            },
          },
        },
        series: [
          {
            type: "radar",
            data: [
              {
                value: Object.values(this.data),
                name: "评分",
                symbol: "none",
                lineStyle: {
                  width: 2,
                },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "rgba(128, 255, 165, 0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(1, 191, 236, 0.1)",
                    },
                  ]),
                },
                itemStyle: {
                  color: "#409EFF",
                },
              },
            ],
          },
        ],
      };

      this.chart.setOption(option);
    },
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.initChart();
      },
    },
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
};
</script>

<style scoped>
.sentiment-radar {
  width: 100%;
  height: 100%;
}
</style> 