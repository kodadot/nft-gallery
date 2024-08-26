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
import { getDropAttributes } from './utils'
import type { DropItem } from '~/params/types'

const props = defineProps<{
  drop: DropItem
}>()

const formattedDrop = ref<Drop>()
const loading = ref(true)
const pastItem = computed(() => !formattedDrop.value?.isMintedOut)

onBeforeMount(async () => {
  const dropAttributes = await getDropAttributes(props.drop.alias)
  if (dropAttributes) {
    formattedDrop.value = await getFormattedDropItem(dropAttributes)

    if (formattedDrop.value?.isMintedOut) {
      useMintedDropsStore().addMintedDrop(formattedDrop.value)
    }
  }
  loading.value = false
})
</script>
