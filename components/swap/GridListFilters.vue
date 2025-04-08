<template>
  <div
    class="flex flex-wrap gap-4"
  >
    <ChainDropdown
      position="bottom-auto"
      variant="rounded-sm"
      filter-by-vm
      :show-network-label="false"
      :label="$t('activity.network')"
      no-shadow
    />

    <ProfileCollectionFilter
      :id="query.currentOwner_eq"
      v-model="collections"
      variant="rounded-sm"
      :search="query"
    />

    <ProfileOrderByDropdown
      preselect="blockNumber_DESC"
      variant="rounded-sm"
      no-shadow
      rounded
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  query: Record<string, any>
}>()

const collections = defineModel({ type: Array as PropType<string[]>, required: true })
</script>
