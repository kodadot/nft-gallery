<template>
  <div class="is-flex field has-addons w-100">
    <TabItem
      :active="route.name === 'prefix-collection-id'"
      :text="`${$t('items')}`"
      :to="toItem" />
    <TabItem
      :active="route.name === 'prefix-collection-id-activity'"
      :text="`${$t('tabs.activity')}`"
      :to="toActivity" />
  </div>
</template>

<script setup lang="ts">
import TabItem from './TabItem.vue'

const route = useRoute()

const toItem = `/${route.params.prefix}/collection/${route.params.id}?redesign=true`
const toActivity = `/${route.params.prefix}/collection/${route.params.id}/activity`
</script>
