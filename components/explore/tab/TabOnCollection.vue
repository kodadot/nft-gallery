<template>
  <div class="flex field has-addons flex-grow">
    <TabItem
      :active="route.name === 'prefix-collection-id'"
      :text="`${$t('items')}`"
      :to="collectionRute"
      data-testid="collection-tab-item"
    />
    <TabItem
      :active="route.name === 'prefix-collection-id-activity'"
      :text="`${$t('tabs.activity')}`"
      :to="`${collectionRute}/activity`"
      data-testid="collection-tab-activity"
    />
    <TabItem
      :active="route.name === 'prefix-collection-id-offers'"
      :text="`${$t('offers')}`"
      :to="`${collectionRute}/offers`"
    />
    <TabItem
      :active="route.name === 'prefix-collection-id-swaps'"
      :text="`${$t('swaps')}`"
      :to="`${collectionRute}/swaps`"
    />
  </div>
</template>

<script setup lang="ts">
import TabItem from '@/components/shared/TabItem.vue'

const route = useRoute()

const collectionRute = computed(() => `/${route.params.prefix}/collection/${route.params.id}`)
</script>
