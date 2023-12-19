<template>
  <div class="flex field has-addons flex-grow">
    <TabItem
      :active="route.name === 'prefix-collection-id'"
      :text="`${$t('items')}`"
      :to="toItem"
      data-testid="collection-tab-item" />
    <TabItem
      :active="route.name === 'prefix-collection-id-activity'"
      :text="`${$t('tabs.activity')}`"
      :to="toActivity"
      data-testid="collection-tab-activity" />
  </div>
</template>

<script setup lang="ts">
import TabItem from '@/components/shared/TabItem.vue'

const route = useRoute()

const toItem = computed(
  () => `/${route.params.prefix}/collection/${route.params.id}`,
)
const toActivity = computed(
  () => `/${route.params.prefix}/collection/${route.params.id}/activity`,
)
</script>
