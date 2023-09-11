<template>
  <div>
    <div class="border-top pt-4 mb-4 card-border-color is-flex is-size-7">
      <div class="k-grey mr-1">Fee Breakdown</div>
      <NeoIcon
        class="k-grey transition"
        :class="[rotate && 'overturn']"
        icon="chevron-down"
        @click.native="toggle" />
    </div>
    <div v-if="rotate" class="is-size-7">
      <div
        class="is-flex mb-2 is-align-items-center is-justify-content-space-between">
        <div>Network Fee</div>
      </div>
      <div class="is-flex mb-2 k-grey">
        <div>existential deposit</div>
      </div>
      <div class="is-flex mb-2 k-grey">
        <div>Kodadot Fee</div>
      </div>
      <div class="is-flex mb-2 is-align-items-center">
        <div class="is-flex k-green is-align-items-center">
          Carbonless
          <svg
            class="ml-2"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none">
            <path
              d="M10.4339 3.47798C4.17357 4.86917 2.71282 9.16099 1.26598 12.7572L2.58066 13.2163L3.24147 11.6164C3.57536 11.7347 3.92316 11.8251 4.17357 11.8251C11.8251 11.8251 13.9119 0 13.9119 0C13.2163 1.39119 8.34714 1.56509 4.86917 2.26068C1.39119 2.95628 0 5.91256 0 7.30375C0 8.69494 1.21729 9.91223 1.21729 9.91223C3.47798 3.47798 10.4339 3.47798 10.4339 3.47798Z"
              fill="#04AF00" />
          </svg>
        </div>
      </div>
    </div>
    <div
      class="mt-4 pt-4 pb-5 border-top card-border-color is-flex is-justify-content-space-between">
      <div class="">Fees Total</div>
      <div class="is-flex is-align-items-end">
        <div class="k-grey is-size-7 mr-2">$0.98</div>
        <div>59KSM</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { NftInformation } from './MintConfirmModal.vue'
import { NeoIcon } from '@kodadot1/brick'

const props = defineProps<{ nft: NftInformation }>()

const rotate = ref(false)

const toggle = () => {
  rotate.value = !rotate.value
}
</script>
<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
.k-grey {
  @include ktheme() {
    color: theme('k-grey');
  }
}

.k-green {
  @include ktheme {
    color: theme('k-green');
    background: none;
  }
}

.transition {
  transition: transform 0.3s;
}
.overturn {
  transform: rotate(-180deg);
}
</style>
