<template>
  <ProfileButtonConfig
    v-if="buttonConfig"
    :loading="false"
    :button="buttonConfig"
  />
</template>

<script setup lang="ts">
import type { ButtonConfig } from '../profile/types'

const emit = defineEmits(['withdraw', 'accept'])
const props = defineProps<{ offer: NFTOfferItem }>()

const { accountId } = useAuth()
const { $i18n } = useNuxtApp()

const isOwnerOfOffer = computed(() => props.offer.caller === accountId.value)
const isOwenrOfNft = computed(() => props.offer.desired.currentOwner === accountId.value)

const buttonConfig = computed<ButtonConfig | null>(() => {
  if (isOwnerOfOffer.value) {
    return {
      label: $i18n.t('transaction.offerWithdraw'),
      classes: 'hover:!border-k-red hover:!bg-k-red-accent-2',
      onClick: () => emit('withdraw', props.offer),
    }
  }

  if (isOwenrOfNft.value) {
    return {
      label: $i18n.t('transaction.offerAccept'),
      onClick: () => emit('accept', props.offer),
    }
  }

  return null
})
</script>
