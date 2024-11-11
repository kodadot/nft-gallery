<template>
  <div
    class="flex gap-4"
  >
    <ChainDropdown
      position="bottom-auto"
      variant="secondary-rounded"
      :show-network-label="false"
      :label="$t('activity.network')"
    />

    <ProfileCollectionFilter
      :id="accountId"
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
const { accountId } = useAuth()

const props = defineProps<{
  modelValue: any[]
  query: Record<string, any>
}>()

const collections = useVModel(props, 'modelValue')
</script>
