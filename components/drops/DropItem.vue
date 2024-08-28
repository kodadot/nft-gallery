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
import { getDropAttributes } from './utils'
import type { DropItem } from '~/params/types'

const props = defineProps<{
  drop: DropItem
}>()

const formattedDrop = ref<DropItem>()
const loading = ref(true)
const pastItem = computed(() => !formattedDrop.value?.isMintedOut)

onBeforeMount(async () => {
  formattedDrop.value = await getDropAttributes(props.drop.alias)

  if (formattedDrop.value?.isMintedOut) {
    useMintedDropsStore().addMintedDrop(formattedDrop.value)
  }

  loading.value = false
})
</script>
