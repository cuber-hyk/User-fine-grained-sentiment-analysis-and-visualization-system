<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const chartRef = ref(null);
let chart = null;

const initChart = () => {
  if (!chart) {
    chart = echarts.init(chartRef.value);
  }

  const option = {
    title: {
      text: "评论热度趋势",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: props.data.map((item) => item.date),
    },
    yAxis: {
      type: "value",
      name: "热度",
    },
    series: [
      {
        data: props.data.map((item) => item.heat),
        type: "line",
        smooth: true,
        areaStyle: {},
      },
    ],
  };

  chart.setOption(option);
};

onMounted(() => {
  initChart();
});

watch(
  () => props.data,
  () => {
    initChart();
  },
  { deep: true }
);

// 组件卸载时销毁图表实例
onUnmounted(() => {
  if (chart) {
    chart.dispose();
    chart = null;
  }
});
</script>

<style scoped>
.chart-container {
  height: 300px;
}
</style> 