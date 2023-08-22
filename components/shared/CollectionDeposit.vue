<template>
  <div class="message-container is-flex is-justify-content-space-evenly">
    <NeoIcon icon="info-circle" size="medium" />
    <span>
      <i18n path="tooltip.deposit" tag="span">
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
    </span>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'

import {
  COLLECTION_DEPOSIT_BSX,
  COLLECTION_DEPOSIT_KSM,
} from '@/utils/constants'

const { urlPrefix } = usePrefix()

let token = 'BSX'
let requiredAmount = COLLECTION_DEPOSIT_BSX
let learnMoreLink =
  'https://hello.kodadot.xyz/multi-chain/fees/assethub-fees#polkadot-asset-hub-fees-prev.-statemint'

switch (urlPrefix.value) {
  case 'rmrk':
  case 'ksm':
    learnMoreLink =
      'https://hello.kodadot.xyz/multi-chain/fees/kusama-fees-rmrk-rmrk2'
    requiredAmount = COLLECTION_DEPOSIT_KSM
    token = 'KSM'
    break
  case 'bsx':
    learnMoreLink =
      'https://hello.kodadot.xyz/multi-chain/fees/assethub-fees#polkadot-asset-hub-fees-prev.-statemint'
    requiredAmount = COLLECTION_DEPOSIT_BSX
    token = 'BSX'
    break

  default:
    break
}
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.message-container {
  gap: 1rem;
  margin: 0 1rem;
}

.learn-more {
  @include ktheme() {
    color: theme('k-blue') !important;
  }

  white-space: nowrap;
}
</style>
