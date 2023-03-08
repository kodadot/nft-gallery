<template>
  <NeoNftCard
    v-if="item"
    class="is-hidden-mobile"
    :nft="item"
    :prefix="urlPrefix"
    :show-price="Number(item?.price) > 0"
    :variant="isMobile && 'small'" />
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { NeoNftCard } from '@kodadot1/brick'
import { getNftMetadata } from '@/utils/nft'

import type { NFTWithMetadata } from '@/utils/nft'

const { urlPrefix } = usePrefix()

const props = defineProps<{
  nft: NFTWithMetadata
}>()

const item = ref<NFTWithMetadata>()

onBeforeMount(async () => {
  item.value = await getNftMetadata(props.nft, urlPrefix.value)
})

const { width } = useWindowSize()
const isMobile = computed(() => width.value <= 768)
</script>
