<template>
  <div>
    <component :is="chartComponent" :data="chartData" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, ArcElement, PointElement, CategoryScale, LinearScale } from 'chart.js'
import { Line, Pie } from 'vue-chartjs'

// Register chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, ArcElement, PointElement, CategoryScale, LinearScale)

const props = defineProps<{
  chartData: any
  chartType: 'line' | 'pie'
}>()

const options = {
  responsive: true,
  maintainAspectRatio: false,
}

const chartComponent = computed(() => {
  return props.chartType === 'line' ? Line : Pie
})

const chartData = props.chartData
</script>

<style scoped>
div {
  height: 300px;
}
</style>
