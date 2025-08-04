<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Usage (kWh)',
      data: [120, 150, 130, 170, 160, 190],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.3)',
      fill: true,
    }
  ]
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const }
  }
}
</script>
