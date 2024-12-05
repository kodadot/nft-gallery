<template>
  <UserCartModal
    ref="userCartModal"
    mode="burn"
    :title="$t('transaction.burnNft', items.length)"
    :signing-title="$t('mint.nft.burning', items.length)"
    :get-action="getAction"
    :label="label"
    :disabled="!acknowledged"
    @reset="acknowledged = false"
  >
    <template #body>
      <hr class="!mt-4 !mb-5">
    </template>

    <template #action-button-top>
      <div class="mb-4 flex items-center">
        <NeoCheckbox
          v-model="acknowledged"
          class="!m-0"
        />
        <p class="text-sm capitalize">
          {{ $t('burning.agree') }}
        </p>
      </div>
    </template>
  </UserCartModal>
</template>

<script setup lang="ts">
import { Interaction } from '@kodadot1/minimark/v1'
import { NeoCheckbox } from '@kodadot1/brick'
import { type ActionConsume } from '@/composables/transaction/types'
import { type UserCartModalExpose } from '@/components/common/userCart/UserCartModal.vue'

const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()

const acknowledged = ref(false)
const userCartModal = ref<UserCartModalExpose>()

const items = computed(() => userCartModal.value?.items || [])
const abi = computed(() => userCartModal.value?.abi)

const label = computed(() => {
  if (!acknowledged.value) {
    return $i18n.t('helper.acknowledgeToContinue')
  }
  return $i18n.t('transaction.burnNft', items.value.length)
})

const getAction = (): ActionConsume => ({
  interaction: Interaction.CONSUME,
  nftIds: items.value.map(item => item.id),
  urlPrefix: urlPrefix.value,
  abi: abi.value,
  successMessage: $i18n.t('transaction.item.success') as string,
  errorMessage: $i18n.t('transaction.item.error') as string,
})
</script>
