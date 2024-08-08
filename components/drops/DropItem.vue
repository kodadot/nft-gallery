<template>
  <DropsDropCardSkeleton v-if="loading" />

  <div v-else-if="!loading && pastItem">
    <DropsDropCard
      v-if="formattedDrop"
      :drop="formattedDrop"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Drop } from './useDrops'
import { getFormattedDropItem } from './useDrops'
import type { DropItem } from '~/params/types'

const props = defineProps<{
  drop: DropItem
  pastDrop?: boolean
}>()

const formattedDrop = ref<Drop>()
const loading = ref(true)
const pastItem = computed(() => {
  if (props.pastDrop) {
    return formattedDrop.value?.minted === formattedDrop.value?.max
  }

  return formattedDrop.value?.minted !== formattedDrop.value?.max
})

onBeforeMount(async () => {
  formattedDrop.value = await getFormattedDropItem(props.drop, props.drop)
  loading.value = false
})
</script>
