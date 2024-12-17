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
    cancel: 'transaction.cancelSwap',
    accept: 'transaction.acceptSwap',
    withdraw: 'swap.withdrawSwap',
  },
  [TradeType.OFFER]: {
    cancel: 'transaction.cancelOffer',
    accept: 'transaction.acceptOffer',
    withdraw: 'offer.withdrawOffer',
  },
}

const buttonConfig = computed<ButtonConfig | null>(() => {
  if (props.trade.status === TradeStatus.EXPIRED) {
    return isCreatorOfTrade.value
      ? {
          label: $i18n.t(details[props.trade.type].withdraw),
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
