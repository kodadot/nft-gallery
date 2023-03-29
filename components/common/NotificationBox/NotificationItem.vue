<template>
  <div class="is-flex mb-5">
    <img
      src="/placeholder.webp"
      width="50"
      height="50"
      class="border image-size" />
    <div class="notify-content ml-5 is-flex is-flex-direction-column">
      <div class="is-flex is-justify-content-space-between">
        <div class="nft-name mr-4 has-text-weight-bold is-ellipsis">
          {{ nft.name }}
        </div>
        <div class="nft-price is-ellipsis">
          <Money :value="nft.price" />
        </div>
      </div>
      <div class="is-flex is-justify-content-space-between">
        <div>
          <div class="height-50px is-flex is-align-items-center">
            <div
              class="event-type mr-4 border is-size-7 is-justify-content-center px-4 py-1 is-flex is-align-items-center k-blueaccent">
              BUY
            </div>
          </div>
        </div>
        <div class="is-ellipsis">
          {{ nft.timestamp }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselNFT } from '@/components/base/types'
import Money from '@/components/shared/format/ChainMoney.vue'

// import { formatToNow } from '@/utils/format/time'

// import { sanitizeIpfsUrl } from '@/utils/ipfs'

const props = defineProps<{
  nft: CarouselNFT
}>()

// const { urlPrefix } = usePrefix()

console.log('nft -> ', props.nft)
</script>

<style scoped lang="scss">
.notify-content {
  flex: 1;
  overflow: auto;
}
.nft-price {
  overflow: auto;
}
.nft-name {
  width: 0;
  flex: 1;
}
.event-type {
  line-height: 0.75rem;
  border-radius: 2rem;
}
</style>
