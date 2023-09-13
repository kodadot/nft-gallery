<template>
  <div>
    <div class="border-top pt-4 card-border-color is-size-7">
      <template v-if="hasMultipleFees">
        <div class="k-grey mb-4 is-flex is-align-items-center">
          <div class="mr-1">Fee Breakdown</div>
          <NeoIcon
            class="transition"
            :class="[rotate && 'overturn']"
            icon="chevron-down"
            @click.native="toggle" />
        </div>
      </template>
    </div>
    <div v-if="rotate" class="is-size-7">
      <div
        v-if="networkFee"
        class="is-flex mb-2 is-align-items-center is-justify-content-space-between">
        <div>{{ $t('mint.nft.modal.networkFee') }}</div>
        <div>{{ networkFee }} {{ nft.chainSymbol }}</div>
      </div>
      <div
        v-if="existentialDeposit"
        class="k-grey is-flex mb-2 is-align-items-center is-justify-content-space-between">
        <div>
          {{ $t('mint.nft.modal.existentialDeposit') }}
          <NeoTooltip
            position="top"
            multiline-width="14rem"
            label="A deposit of 0.1 KSM is required to create a collection. Please note, this initial deposit is refundable. "
            multiline>
            <NeoIcon icon="circle-question" />
          </NeoTooltip>
        </div>
        <div>{{ existentialDeposit }} {{ nft.chainSymbol }}</div>
      </div>
      <div
        v-if="nft.hasRoyalty"
        class="is-flex mb-2 k-grey is-align-items-center is-justify-content-space-between">
        <div>
          {{ $t('mint.nft.modal.kodadotFee') }}
          <NeoTooltip
            position="top"
            multiline-width="14rem"
            label="By keeping this option active, you're contributing to initial costs borne by Kodadot for storing your JPEGs on your behalf. You may change this preference anytime in the settings. "
            multiline>
            <NeoIcon icon="circle-question" />
          </NeoTooltip>
        </div>
        <div>0.1% {{ nft.chainSymbol }}</div>
      </div>
      <div
        v-if="hasCarbonOffset"
        class="is-flex mb-2 is-align-items-center is-justify-content-space-between">
        <div class="is-flex k-green is-align-items-center">
          {{ $t('mint.nft.modal.carbonless') }}
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
        <div class="k-grey">1 USD ~ 0.1 {{ nft.chainSymbol }}</div>
      </div>
    </div>
    <div
      class="mt-4 pt-4 pb-5 border-top card-border-color is-flex is-justify-content-space-between">
      <div class="">{{ $t('mint.nft.modal.totalFee') }}:</div>
      <div class="is-flex is-align-items-end">
        <div class="k-grey is-size-7 mr-2">$0.98</div>
        <div>59 {{ nft.chainSymbol }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ExtendedInformation } from './MintConfirmModal.vue'
import { NeoIcon, NeoTooltip } from '@kodadot1/brick'
import { usePreferencesStore } from '@/stores/preferences'

const preferencesStore = usePreferencesStore()

const props = defineProps<{ nft: ExtendedInformation }>()

const rotate = ref(false)

const existentialDeposit = computed(() => props.nft.existentialDeposit)
const networkFee = computed(() => props.nft.networkFee)
const hasSupport = computed(() => preferencesStore.hasSupport)
const hasCarbonOffset = computed(() => preferencesStore.hasCarbonOffset)

const hasMultipleFees = computed(
  () =>
    [
      hasCarbonOffset.value,
      hasSupport.value,
      existentialDeposit.value,
      networkFee.value,
    ].filter((e) => !!e).length > 0
)

watch(
  hasMultipleFees,
  () => {
    rotate.value = !hasMultipleFees.value
  },
  { immediate: true }
)

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
