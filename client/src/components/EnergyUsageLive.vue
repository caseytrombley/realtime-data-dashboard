<template>
  <div>
    <h2 class="text-xl font-semibold mb-2">Real-Time Energy Usage</h2>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import { useSubscription } from '@vue/apollo-composable'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  type ChartData,
} from 'chart.js'
import gql from 'graphql-tag'

// Register Chart.js components
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Filler
)

// GraphQL subscription
const ENERGY_USAGE_SUBSCRIPTION = gql`
  subscription OnEnergyUsageUpdated {
    energyUsageUpdated {
      timestamp
      value
    }
  }
`

// Use shallowRef to avoid Vue deep proxying Chart.js objects
const chartData = shallowRef<ChartData<'line'>>({
  labels: [],
  datasets: [
    {
      label: 'kW Usage',
      data: [],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.3)',
      fill: true,
    },
  ],
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
  },
}

// Apollo subscription hook
const { result, error } = useSubscription(ENERGY_USAGE_SUBSCRIPTION)

// Error watcher
watch(error, (err) => {
  if (err) console.error('Subscription error:', err)
})

// Data watcher
watch(result, (newVal) => {
  console.log('Subscription data:', newVal)

  if (newVal?.energyUsageUpdated) {
    const { timestamp, value } = newVal.energyUsageUpdated

    const oldLabels = chartData.value.labels as string[]
    const oldData = chartData.value.datasets[0].data as number[]

    const newLabels = [...oldLabels, new Date(timestamp).toLocaleTimeString()]
    const newData = [...oldData, value]

    // Keep only last 10 points
    if (newLabels.length > 10) {
      newLabels.shift()
      newData.shift()
    }

    // Reassign a whole new object so Vue notices
    chartData.value = {
      ...chartData.value,
      labels: newLabels,
      datasets: [
        {
          ...chartData.value.datasets[0],
          data: newData,
        },
      ],
    }
  }
})

</script>
