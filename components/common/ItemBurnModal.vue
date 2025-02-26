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
      <div class="mb-4">
        <NeoCheckbox
          v-model="acknowledged"
          class="!flex items-center"
          label-class="!pl-3 text-sm capitalize"
          :label="$t('burning.agree')"
        />
      </div>
    </template>
  </UserCartModal>
</template>

<script setup lang="ts">
import { NeoCheckbox } from '@kodadot1/brick'
import { Interaction } from '@/utils/shoppingActions'
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
})
</script>
