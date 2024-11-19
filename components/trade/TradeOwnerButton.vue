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
const props = defineProps<{ offer: TradeNftItem, loading?: boolean }>()

const { accountId } = useAuth()
const { $i18n } = useNuxtApp()

const { isOwnerOfNft, isCreatorOfTrade } = useIsTrade(computed(() => props.offer), accountId)

const onClick = () => emit('click', props.offer)

const details = {
  [TradeType.SWAP]: {
    cancel: 'swap.cancelSwap',
    accept: 'swap.acceptSwap',
  },
  [TradeType.OFFER]: {
    cancel: 'transaction.offerWithdraw',
    accept: 'transaction.offerAccept',
  },
}

const buttonConfig = computed<ButtonConfig | null>(() => {
  if (props.offer.status === 'EXPIRED') {
    return isCreatorOfTrade.value
      ? {
          label: $i18n.t('offer.withdrawAmount'),
          onClick,
        }
      : null
  }

  if (isCreatorOfTrade.value) {
    return {
      label: $i18n.t(details[props.offer.type].cancel),
      classes: '!border-k-red !bg-k-red-accent-2',
      onClick,
    }
  }

  if (isOwnerOfNft.value) {
    return {
      label: $i18n.t(details[props.offer.type].accept),
      onClick,
    }
  }

  return null
})
</script>
