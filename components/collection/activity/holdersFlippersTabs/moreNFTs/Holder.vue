<template>
  <div v-if="ready" class="-mx-5">
    <div
      v-for="{ avatar, id, name, updatedAt } in nfts"
      :key="id"
      class="is-flex pt-2 px-5 is-justify-content-start is-hoverable">
      <div class="mr-2rem">
        <img
          v-if="avatar"
          :src="avatar"
          :alt="name"
          width="40"
          height="40"
          class="border" />
        <img v-else src="/placeholder.webp" class="border" />
      </div>
      <div class="is-flex is-flex-direction-column">
        {{ name }}
        <span class="is-size-7 k-grey">{{
          timeAgo(new Date(updatedAt).getTime())
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { NFTMetadata } from '@/components/rmrk/service/scheme'
import { NFTExcludingEvents } from '@/components/collection/utils/types'
import { timeAgo } from '@/components/collection/activity/utils'

const props = defineProps<{
  nfts: (NFTExcludingEvents & { avatar?: string })[]
}>()

const nfts = ref(props.nfts)
const ready = ref(false)

onMounted(() => {
  processNFTImages()
})

const processNFTImages = async () => {
  if (props.nfts) {
    const promises = props.nfts.map(async (nft, i) => {
      let avatar
      if (nft?.meta?.image) {
        avatar = sanitizeIpfsUrl(nft.meta.image)
      } else {
        const meta = (await processSingleMetadata(nft.metadata)) as NFTMetadata
        avatar = sanitizeIpfsUrl(meta?.image)
      }

      nfts.value[i].avatar = avatar
    })

    await Promise.all(promises)

    ready.value = true
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.mr-2rem {
  margin-right: 2rem;
}
.k-grey {
  @include ktheme() {
    color: theme('k-grey');
  }
}
.-mx-5 {
  margin: 0 -1.5rem !important;
}
.is-hoverable {
  @include ktheme() {
    &:hover {
      background-color: theme('k-accentlight2');
    }
  }
}
</style>
