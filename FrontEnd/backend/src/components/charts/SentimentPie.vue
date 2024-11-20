<template>
  <div ref="chartRef" class="sentiment-pie"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "SentimentPie",
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
          formatter: "{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          right: 10,
          top: "center",
          textStyle: {
            color: "#909399",
          },
        },
        series: [
          {
            type: "pie",
            radius: ["50%", "70%"],
            center: ["40%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "20",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: Object.entries(this.data).map(([name, value]) => ({
              name,
              value,
              itemStyle: {
                color:
                  name === "正面"
                    ? "#67C23A"
                    : name === "负面"
                    ? "#F56C6C"
                    : "#909399",
              },
            })),
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
.sentiment-pie {
  width: 100%;
  height: 100%;
}
</style> 