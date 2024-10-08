<template>
  <div
    v-if="ready"
    class=""
  >
    <div
      v-for="{ avatar, boughtPrice, soldPrice, profit, nft } in displayedFlips"
      :key="nft.id"
      class="flex py-2 px-5 justify-start hover:bg-k-accent-light-2 flex-col"
    >
      <nuxt-link
        class="flex"
        :to="`/${urlPrefix}/gallery/${nft.id}`"
      >
        <BasicImage
          :src="avatar"
          :alt="nft?.name"
          class="border mr-5 image-size pt-0"
        />
        <span>{{ nft.name }}</span>
      </nuxt-link>
      <div class="flex flex-col justify-between mt-3">
        <div class="flex justify-between whitespace-nowrap">
          <span class="text-xs text-k-grey">{{ $t('activity.profit') }}</span>
          <span
            :class="{
              'text-k-green': profit > 0,
              'text-k-red': profit < 0,
            }"
          >{{ profit === 0 ? '--' : `${format(profit)}%` }}</span>
        </div>
        <div class="flex justify-between whitespace-nowrap">
          <span class="text-xs text-k-grey">{{ $t('activity.bought') }}</span>
          <Money :value="boughtPrice" />
        </div>
        <div class="flex justify-between whitespace-nowrap">
          <span class="text-xs text-k-grey">{{ $t('activity.sold') }}</span>
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
import type { NFTMetadata } from '@/types'
import Money from '@/components/shared/format/ChainMoney.vue'
import type { FlipEvent } from '@/composables/collectionActivity/types'
import { format } from '@/components/collection/activity/utils'
import BasicImage from '@/components/shared/view/BasicImage.vue'

const { placeholder } = useTheme()
const props = defineProps<{
  flips: (FlipEvent & { avatar?: string })[]
}>()

const flips = ref(props.flips)
const ready = ref(false)

const target = ref<HTMLElement | null>(null)
const offset = ref(4)

const { urlPrefix } = usePrefix()
useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    offset.value += 4
  }
})

const displayedFlips = computed(() => flips.value.slice(0, offset.value))

const processNFTImages = async () => {
  if (props.flips) {
    const promises = displayedFlips.value.map(async ({ nft }, i) => {
      let avatar
      if (nft.meta?.image) {
        avatar = sanitizeIpfsUrl(nft.meta.image)
      }
      else {
        const meta = (await processSingleMetadata(nft.metadata)) as NFTMetadata
        avatar = sanitizeIpfsUrl(meta?.image)
      }

      flips.value[i].avatar = avatar || placeholder.value
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
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.image-size {
  width: 40px !important;
  height: 40px !important;
}
</style>
