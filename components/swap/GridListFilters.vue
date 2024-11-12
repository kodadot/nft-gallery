<template>
  <div
    class="flex gap-4"
  >
    <ChainDropdown
      position="bottom-auto"
      variant="secondary-rounded"
      :show-network-label="false"
      :label="$t('activity.network')"
      :exclude="['base', 'imx', 'mnt']"
    />

    <ProfileCollectionFilter
      :id="query.currentOwner_eq"
      v-model="collections"
      variant="outlined-rounded"
      :search="query"
    />

    <ProfileOrderByDropdown
      preselect="blockNumber_DESC"
      variant="outlined-rounded"
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
