<template>
  <div>
    <i18n path="tooltip.deposit" tag="p">
      <template #amount>
        <strong>{{ requiredAmount }}</strong>
      </template>
      <template #token>
        <strong>{{ token }}</strong>
      </template>
    </i18n>
    <a v-safe-href="learnMoreLink" class="learn-more">{{
      $t('helper.learnMore')
    }}</a>
  </div>
</template>

<script setup lang="ts">
import {
  COLLECTION_DEPOSIT_BSX,
  COLLECTION_DEPOSIT_KSM,
} from '~~/utils/constants'

const { urlPrefix } = usePrefix()

const token = urlPrefix.value.toUpperCase()
const requiredAmount =
  token === 'KSM' ? COLLECTION_DEPOSIT_KSM : COLLECTION_DEPOSIT_BSX
const learnMoreLink =
  token === 'KSM'
    ? 'https://hello.kodadot.xyz/multi-chain/fees/assethub-fees#polkadot-asset-hub-fees-prev.-statemint'
    : 'https://hello.kodadot.xyz/multi-chain/fees/assethub-fees#polkadot-asset-hub-fees-prev.-statemint?'
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.learn-more {
  @include ktheme() {
    color: theme('k-blue') !important;
  }

  text-decoration: underline;
  white-space: nowrap;
}
</style>
