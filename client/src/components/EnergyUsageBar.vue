<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import { useSubscription } from '@vue/apollo-composable'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Filler,
  type ChartData,
} from 'chart.js'
import gql from 'graphql-tag'
import {useToast} from "vue-toastification";

const toast = useToast()

// Register Chart.js components for bar chart
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    Filler
)

// GraphQL subscription
const ENERGY_USAGE_SUBSCRIPTION = gql`
  subscription OnEnergyUsageUpdated {
    energyUsageUpdated {
      id
      timestamp
      value
      alert
    }
  }
`

// Chart data state
const chartData = shallowRef<ChartData<'bar'>>({
  labels: [],
  datasets: [
    {
      label: 'kW Usage',
      data: [],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
    },
  ],
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
  },
}

// List data
const readings = shallowRef<{ timestamp: string; value: number }[]>([])

// Apollo subscription hook
const { result, error } = useSubscription(ENERGY_USAGE_SUBSCRIPTION)

// Error watcher
watch(error, (err) => {
  if (err) console.error('Subscription error:', err)
})

// Data watcher
watch(result, (newVal) => {
  if (newVal?.energyUsageUpdated) {

    const { timestamp, value } = newVal.energyUsageUpdated

    if (newVal.energyUsageUpdated.alert) {
      toast.error(`⚠️ High usage: ${value} kWh`, { timeout: 5000 })
    }

    const oldLabels = chartData.value.labels as string[]
    const oldData = chartData.value.datasets[0].data as number[]

    const newLabels = [...oldLabels, new Date(timestamp).toLocaleTimeString()]
    const newData = [...oldData, value]

    // Keep only last 10 points
    if (newLabels.length > 10) {
      newLabels.shift()
      newData.shift()
    }

    // Update chart
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

    // Update list
    readings.value = [
      ...readings.value,
      { timestamp: new Date(timestamp).toLocaleTimeString(), value }
    ].slice(-10) // keep last 10
  }
})
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold mb-2">Energy Usage (Bar)</h2>
    <Bar :data="chartData" :options="chartOptions" />

    <h3 class="text-lg font-semibold mt-4">Recent Readings</h3>
    <ul class="mt-2 space-y-1">
      <li v-for="(reading, idx) in readings" :key="idx" class="text-sm">
        {{ reading.timestamp }} — <strong>{{ reading.value }} kWh</strong>
      </li>
    </ul>
  </div>
</template>
