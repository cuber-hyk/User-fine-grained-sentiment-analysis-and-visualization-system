<template>
  <div ref="chartRef" class="trend-chart"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "TrendChart",
  props: {
    data: {
      type: Array,
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
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["总评论", "正面评论", "负面评论"],
          textStyle: {
            color: "#909399",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: this.data.map((item) => item.date),
          axisLine: {
            lineStyle: {
              color: "#E4E7ED",
            },
          },
          axisLabel: {
            color: "#909399",
          },
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              color: "#E4E7ED",
              type: "dashed",
            },
          },
          axisLabel: {
            color: "#909399",
          },
        },
        series: [
          {
            name: "总评论",
            type: "line",
            smooth: true,
            data: this.data.map((item) => item.value),
            itemStyle: {
              color: "#409EFF",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(64,158,255,0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(64,158,255,0.1)",
                },
              ]),
            },
          },
          {
            name: "正面评论",
            type: "line",
            smooth: true,
            data: this.data.map((item) => item.positive),
            itemStyle: {
              color: "#67C23A",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(103,194,58,0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(103,194,58,0.1)",
                },
              ]),
            },
          },
          {
            name: "负面评论",
            type: "line",
            smooth: true,
            data: this.data.map((item) => item.negative),
            itemStyle: {
              color: "#F56C6C",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(245,108,108,0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(245,108,108,0.1)",
                },
              ]),
            },
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
.trend-chart {
  width: 100%;
  height: 100%;
}
</style> 