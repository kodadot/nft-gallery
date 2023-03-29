<template>
  <div class="is-flex field has-addons is-flex-grow-1">
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
const route = useRoute()

const toItem = `/${route.params.prefix}/collection/${route.params.id}`
const toActivity = `/${route.params.prefix}/collection/${route.params.id}/activity`
</script>
