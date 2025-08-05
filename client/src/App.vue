<script setup lang="ts">
import GlobalAlertListener from './components/GlobalAlertListener.vue'

import LineChart from './components/LineChart.vue'
import BarChart from './components/BarChart.vue'
import PieChart from './components/PieChart.vue'
import RadarChart from './components/RadarChart.vue'
import EnergyUsageBar from './components/EnergyUsageBar.vue'

</script>

<template>
  <GlobalAlertListener />

  <div class="min-h-screen bg-gray-50 p-6">
    <h1 class="text-3xl font-bold mb-6">⚡ Energy Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Realtime Energy Usage -->
      <div class="bg-white rounded-xl shadow p-4 md:col-span-2">
        <EnergyUsageBar />
      </div>
      <!-- Line Chart -->
      <div class="bg-white rounded-xl shadow p-4">
        <h2 class="text-xl font-semibold mb-2">Monthly Usage</h2>
        <LineChart />
      </div>

      <!-- Bar Chart -->
      <div class="bg-white rounded-xl shadow p-4">
        <h2 class="text-xl font-semibold mb-2">Daily Consumption</h2>
        <BarChart />
      </div>

      <!-- Pie Chart -->
      <div class="bg-white rounded-xl shadow p-4">
        <h2 class="text-xl font-semibold mb-2">Energy Source Breakdown</h2>
        <PieChart />
      </div>

      <!-- Radar Chart -->
      <div class="bg-white rounded-xl shadow p-4">
        <h2 class="text-xl font-semibold mb-2">Performance Metrics</h2>
        <RadarChart />
      </div>


    </div>
  </div>
</template>
