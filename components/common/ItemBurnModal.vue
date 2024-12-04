<template>
  <UserCartModal
    ref="userCartModal"
    mode="burn"
    :title="$t('transaction.burnNft', items.length)"
    :signing-title="$t('mint.nft.burning', items.length)"
    :get-action="getAction"
    :label="$t('transaction.burnNft', items.length)"
  />
</template>

<script setup lang="ts">
import { Interaction } from '@kodadot1/minimark/v1'
import { type ActionConsume } from '@/composables/transaction/types'

const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()

const userCartModal = ref<{ items: ListCartItem[] }>()

const items = computed(() => userCartModal.value?.items || [])

const getAction = (): ActionConsume => ({
  interaction: Interaction.CONSUME,
  nftIds: items.value.map(item => item.id),
  urlPrefix: urlPrefix.value,
  successMessage: $i18n.t('transaction.item.success') as string,
  errorMessage: $i18n.t('transaction.item.error') as string,
})
</script>
