<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const chartData = {
  labels: ['Solar', 'Wind', 'Grid'],
  datasets: [
    {
      label: 'Energy Sources',
      data: [40, 35, 25],
      backgroundColor: ['#facc15', '#3b82f6', '#ef4444']
    }
  ]
}

const chartOptions = { responsive: true }
</script>
