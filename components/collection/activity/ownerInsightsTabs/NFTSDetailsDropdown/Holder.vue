<template>
  <div v-if="ready" class="">
    <div
      v-for="{ avatar, id, name, updatedAt } in displayedNFTs"
      :key="id"
      class="is-flex pt-2 px-5 is-justify-content-start is-hoverable-item">
      <div class="mr-5">
        <img
          v-if="avatar"
          :src="avatar"
          :alt="name"
          width="40"
          height="40"
          class="border image-size" />
        <img
          v-else
          src="/placeholder.webp"
          class="border mr-5 image-size"
          width="40"
          height="40" />
      </div>
      <div class="is-flex is-flex-direction-column">
        {{ name }}
        <span class="is-size-7 has-text-grey">{{
          timeAgo(new Date(updatedAt).getTime())
        }}</span>
      </div>
    </div>
    <div ref="target" />
  </div>
</template>

<script setup lang="ts">
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { NFTMetadata } from '@/components/rmrk/service/scheme'
import { NFTExcludingEvents } from '@/composables/collectionActivity/types'
import { timeAgo } from '@/components/collection/utils/timeAgo'

const props = defineProps<{
  nfts: (NFTExcludingEvents & { avatar?: string })[]
}>()

const nfts = ref(props.nfts)
const ready = ref(false)

const target = ref<HTMLElement | null>(null)
const offset = ref(4)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    offset.value += 4
  }
})

const displayedNFTs = computed(() => nfts.value.slice(0, offset.value))

const processNFTImages = async () => {
  if (props.nfts) {
    const promises = displayedNFTs.value.map(async (nft, i) => {
      let avatar
      if (nft.meta?.image) {
        avatar = sanitizeIpfsUrl(nft.meta.image)
      } else {
        const meta = (await processSingleMetadata(nft.metadata)) as NFTMetadata
        avatar = sanitizeIpfsUrl(meta?.image)
      }

      displayedNFTs.value[i].avatar = avatar
    })

    await Promise.all(promises)

    ready.value = true
  }
}

watch(
  offset,
  () => {
    processNFTImages()
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.image-size {
  width: 40px !important;
  height: 40px !important;
}
</style>
