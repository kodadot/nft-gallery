<template>
  <DropsDropCardSkeleton v-if="!formattedDrop" />
  <DropsDropCard
    v-else-if="shouldShowDrop"
    :drop="formattedDrop"
  />
</template>

<script lang="ts" setup>
import { getDropAttributes } from './utils'
import type { DropItem } from '@/params/types'

const props = defineProps<{
  drop: DropItem
  showMinted?: boolean
}>()

const formattedDrop = ref<DropItem>()

const shouldShowDrop = computed(() =>
  props.showMinted || (!formattedDrop.value?.isMintedOut),
)

onBeforeMount(async () => {
  formattedDrop.value = await getDropAttributes(props.drop.alias)

  if (formattedDrop.value?.isMintedOut) {
    useMintedDropsStore().addMintedDrop(formattedDrop.value)
  }
})
</script>
