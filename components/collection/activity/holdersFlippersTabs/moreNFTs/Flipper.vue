<template>
  <div v-if="ready" class="-mx-5">
    <div
      v-for="{ avatar, boughtPrice, soldPrice, profit, nft } in flips"
      :key="nft.id"
      class="is-flex py-2 px-5 is-justify-content-start is-hoverable is-flex-direction-column">
      <div class="is-flex">
        <img
          v-if="avatar"
          :src="avatar"
          :alt="nft.name"
          width="40"
          height="40"
          class="border mr-2rem" />
        <img v-else src="/placeholder.webp" class="border mr-2rem" />
        <span>{{ nft.name }}</span>
      </div>
      <div
        class="is-flex is-flex-direction-column is-justify-content-space-between mt-3">
        <div class="is-flex is-justify-content-space-between no-wrap">
          <span class="is-size-7 has-text-grey">{{
            $t('activity.profit')
          }}</span>
          <span :class="{ 'k-green': profit > 0, 'k-red': profit < 0 }">{{
            profit === 0 ? '--' : `${profit.toFixed(4)}%`
          }}</span>
        </div>
        <div class="is-flex is-justify-content-space-between no-wrap">
          <span class="is-size-7 has-text-grey">{{
            $t('activity.bought')
          }}</span>
          <Money :value="boughtPrice" />
        </div>
        <div class="is-flex is-justify-content-space-between no-wrap">
          <span class="is-size-7 has-text-grey">{{ $t('activity.sold') }}</span>
          <Money :value="soldPrice" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { NFTMetadata } from '@/components/rmrk/service/scheme'
import { FlipEvent } from '@/components/collection/utils/types'
import Money from '@/components/shared/format/ChainMoney.vue'

const props = defineProps<{
  flips: (FlipEvent & { avatar?: string })[]
}>()

const flips = ref(props.flips)
const ready = ref(false)

onMounted(() => {
  processNFTImages()
})

const processNFTImages = async () => {
  if (props.flips) {
    const promises = props.flips.map(async ({ nft }, i) => {
      let avatar
      if (nft.meta?.image) {
        avatar = sanitizeIpfsUrl(nft.meta.image)
      } else {
        const meta = (await processSingleMetadata(nft.metadata)) as NFTMetadata
        avatar = sanitizeIpfsUrl(meta?.image)
      }

      flips.value[i].avatar = avatar
    })

    await Promise.all(promises)

    ready.value = true
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.mr-2rem {
  margin-right: 1.5rem;
}

.-mx-5 {
  margin: 0 -1.5rem !important;
}
.k-green {
  @include ktheme() {
    color: theme('k-green');
  }
}
.k-red {
  @include ktheme() {
    color: theme('k-red');
  }
}
.is-hoverable {
  @include ktheme() {
    &:hover {
      background-color: theme('k-accentlight2');
    }
  }
}
</style>
