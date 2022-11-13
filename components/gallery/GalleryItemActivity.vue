<template>
  <o-tabs v-model="activeTab" expanded>
    <o-tab-item value="0" label="Offers" class="p-5"> Offers </o-tab-item>

    <o-tab-item value="1" label="Activity" class="p-5"> Activity </o-tab-item>

    <o-tab-item value="2" label="Listings" class="p-5"> Listings </o-tab-item>

    <o-tab-item value="3" label="Chart" class="p-5"> Chart </o-tab-item>
  </o-tabs>
</template>

<script setup lang="ts">
import { OTabItem, OTabs } from '@oruga-ui/oruga'

const activeTab = ref('0')
</script>
