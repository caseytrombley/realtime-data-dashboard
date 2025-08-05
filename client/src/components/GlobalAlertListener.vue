<script setup lang="ts">
import { useSubscription } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useToast } from 'vue-toastification'

const toast = useToast()

const SUBSCRIBE_USAGE = gql`
  subscription {
    energyUsageUpdated {
      id
      timestamp
      value
      alert
    }
  }
`

useSubscription(SUBSCRIBE_USAGE, {
  fetchPolicy: 'no-cache',
  onResult: ({ data }: { data?: { energyUsageUpdated?: { value: number; alert: boolean } } }) => {
    console.log('📡 GlobalAlertListener data:', data)
    if (data?.energyUsageUpdated?.alert) {
      console.log('🚨 Alert detected — showing toast!')
      toast.error(`⚠️ High usage: ${data.energyUsageUpdated.value} kWh`, {
        timeout: 5000,
      })
    }
  }
})
</script>

<template>
  <!-- No UI -->
</template>
