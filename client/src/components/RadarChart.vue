<template>
  <Radar :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Radar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement)

const chartData = {
  labels: ['Peak', 'Average', 'Efficiency', 'Cost', 'Sustainability'],
  datasets: [
    {
      label: 'Performance',
      data: [80, 65, 75, 60, 90],
      backgroundColor: 'rgba(59, 130, 246, 0.3)',
      borderColor: '#3b82f6'
    }
  ]
}

const chartOptions = { responsive: true }
</script>
