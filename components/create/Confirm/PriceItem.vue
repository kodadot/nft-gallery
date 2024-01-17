<template>
  <div>
    <div class="border-t pt-4 border-border-color text-xs">
      <template v-if="hasMultipleFees">
        <div
          class="text-k-grey mb-4 flex items-center is-cursor-pointer"
          @click="toggle">
          <div class="mr-1">Fee Breakdown</div>
          <NeoIcon
            class="transition"
            :class="[rotate && 'overturn']"
            icon="chevron-down" />
        </div>
      </template>
    </div>
    <div v-if="rotate" class="text-xs">
      <div v-if="networkFee" class="flex mb-2 items-center justify-between">
        <div>{{ $t('mint.nft.modal.networkFee') }}</div>
        <Money :value="networkFee" :unit-symbol="chainSymbol" inline />
      </div>
      <div
        v-if="existentialDeposit"
        class="text-k-grey flex mb-2 items-center justify-between">
        <div>
          {{ depositText }}
          <NeoTooltip
            position="top"
            class="is-cursor-pointer"
            multiline-width="14rem"
            multiline
            :label="depositTooltip">
            <NeoIcon icon="circle-question" />
          </NeoTooltip>
        </div>
        <Money :value="existentialDeposit" :unit-symbol="chainSymbol" inline />
      </div>
      <div
        v-if="kodadotFee"
        class="flex mb-2 text-k-grey items-center justify-between">
        <div>
          {{ $t('mint.nft.modal.kodadotFee') }}
          <NeoTooltip
            class="is-cursor-pointer"
            position="top"
            multiline-width="14rem"
            :label="$t('mint.nft.modal.kodadotTooltip')"
            multiline>
            <NeoIcon icon="circle-question" />
          </NeoTooltip>
        </div>
        <div class="flex items-center">
          {{ nft.kodadotUSDFee }} USD ~
          <Money :value="kodadotFee" :unit-symbol="chainSymbol" inline />
        </div>
      </div>
      <div v-if="carbonlessFee" class="flex mb-2 items-center justify-between">
        <div class="flex text-k-green items-center">
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
        <div class="text-k-grey">
          {{ nft.carbonlessUSDFee }} USD ~
          <Money :value="carbonlessFee" :unit-symbol="chainSymbol" inline />
        </div>
      </div>
    </div>
    <div
      class="mt-4 pt-4 pb-5 border-t border-border-color flex justify-between">
      <div class="">{{ $t('mint.nft.modal.totalFee') }}:</div>
      <div class="flex items-end">
        <div class="text-k-grey text-xs mr-2">$ {{ nft.totalUSDFee }}</div>
        <Money :value="nft.totalFee" :unit-symbol="chainSymbol" inline />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ExtendedInformation } from './MintConfirmModal.vue'
import { NeoIcon, NeoTooltip } from '@kodadot1/brick'
import Money from '@/components/shared/format/Money.vue'
import formatBalance, {
  checkInvalidBalanceFilter,
  roundTo,
} from '@/utils/format/balance'

const { $i18n } = useNuxtApp()

const props = defineProps<{ nft: ExtendedInformation }>()

const rotate = ref(false)
const isNFT = computed(() => props.nft.mintType === CreateComponent.NFT)
const existentialDeposit = computed(() => props.nft.existentialDeposit)
const depositText = computed(() =>
  isNFT.value
    ? $i18n.t('mint.nft.modal.existentialDeposit')
    : $i18n.t('mint.collection.modal.existentialDeposit'),
)
const depositTooltip = computed(() =>
  isNFT.value
    ? $i18n.t('mint.nft.modal.depositTooltip', [
        format(existentialDeposit.value),
        chainSymbol.value,
      ])
    : $i18n.t('mint.collection.modal.depositTooltip', [
        format(existentialDeposit.value),
        chainSymbol.value,
      ]),
)
const networkFee = computed(() => props.nft.networkFee)
const kodadotFee = computed(() => props.nft.kodadotFee)
const carbonlessFee = computed(() => props.nft.carbonlessFee)
const chainSymbol = computed(() => props.nft.paidToken.tokenSymbol)
const tokenDecimals = computed(() => props.nft.paidToken.tokenDecimals)

const hasMultipleFees = computed(
  () =>
    [
      networkFee.value,
      existentialDeposit.value,
      kodadotFee.value,
      carbonlessFee.value,
    ].filter((e) => !!e).length > 0,
)

const format = (value: number) => {
  return roundTo(
    formatBalance(checkInvalidBalanceFilter(value), tokenDecimals.value, ''),
    4,
  )
}

watch(
  hasMultipleFees,
  () => {
    rotate.value = !hasMultipleFees.value
  },
  { immediate: true },
)

const toggle = () => {
  rotate.value = !rotate.value
}
</script>
<style lang="scss" scoped>
.transition {
  transition: transform 0.3s;
}
.overturn {
  transform: rotate(-180deg);
}
</style>
