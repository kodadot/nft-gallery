<template>
  <div v-if="ready" class="">
    <div
      v-for="{ avatar, boughtPrice, soldPrice, profit, nft } in displayedFlips"
      :key="nft.id"
      class="is-flex py-2 px-5 is-justify-content-start is-hoverable-item is-flex-direction-column">
      <div class="is-flex">
        <img
          v-if="avatar"
          :src="avatar"
          :alt="nft.name"
          width="40"
          height="40"
          class="border mr-5 image-size" />
        <img
          v-else
          src="/placeholder.webp"
          class="border mr-5 image-size"
          width="40"
          height="40" />
        <span>{{ nft.name }}</span>
      </div>
      <div
        class="is-flex is-flex-direction-column is-justify-content-space-between mt-3">
        <div class="is-flex is-justify-content-space-between no-wrap">
          <span class="is-size-7 has-text-grey">{{
            $t('activity.profit')
          }}</span>
          <span
            :class="{
              'has-text-k-green': profit > 0,
              'has-text-k-red': profit < 0,
            }"
            >{{ profit === 0 ? '--' : `${format(profit)}%` }}</span
          >
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
    <div ref="target" />
  </div>
</template>

<script setup lang="ts">
import { sanitizeIpfsUrl } from '@/utils/ipfs'
import { processSingleMetadata } from '@/utils/cachingStrategy'
import { NFTMetadata } from '@/components/rmrk/service/scheme'
import Money from '@/components/shared/format/ChainMoney.vue'
import { FlipEvent } from '@/composables/collectionActivity/types'
import { format } from '@/components/collection/activity/utils'

const props = defineProps<{
  flips: (FlipEvent & { avatar?: string })[]
}>()

const flips = ref(props.flips)
const ready = ref(false)

const target = ref<HTMLElement | null>(null)
const offset = ref(4)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    offset.value += 4
  }
})

const displayedFlips = computed(() => flips.value.slice(0, offset.value))

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
