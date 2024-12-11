<template>
  <ProfileButtonConfig
    v-if="buttonConfig"
    :loading="loading"
    :button="buttonConfig"
  />
</template>

<script setup lang="ts">
import type { ButtonConfig } from '../profile/types'

const emit = defineEmits(['click'])
const props = defineProps<{ trade: TradeNftItem, loading?: boolean }>()

const { accountId } = useAuth()
const { $i18n } = useNuxtApp()

const { isOwnerOfNft, isCreatorOfTrade } = useIsTrade(computed(() => props.trade), accountId)

const onClick = () => emit('click', props.trade)

const details = {
  [TradeType.SWAP]: {
    cancel: 'transaction.withdrawSwap',
    accept: 'transaction.acceptSwap',
  },
  [TradeType.OFFER]: {
    cancel: 'transaction.withdrawOffer',
    accept: 'transaction.acceptOffer',
  },
}

const buttonConfig = computed<ButtonConfig | null>(() => {
  if (props.trade.status === 'EXPIRED') {
    return isCreatorOfTrade.value
      ? {
          label: $i18n.t('offer.withdrawAmount'),
          onClick,
        }
      : null
  }

  if (isCreatorOfTrade.value) {
    return {
      label: $i18n.t(details[props.trade.type].cancel),
      classes: '!border-k-red !bg-k-red-accent-2',
      onClick,
    }
  }

  if (isOwnerOfNft.value) {
    return {
      label: $i18n.t(details[props.trade.type].accept),
      onClick,
    }
  }

  return null
})
</script>
