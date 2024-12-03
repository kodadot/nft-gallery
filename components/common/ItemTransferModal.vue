<template>
  <UserCartModal
    ref="userCartModal"
    mode="transfer"
    :title="$t('transaction.transferNft', items.length)"
    :signing-title="$t('transaction.transferingNft', items.length)"
    :get-action="getAction"
    :label="label"
    :disabled
    :loading
    @reset="reset"
  >
    <template #body>
      <hr class="my-4">

      <h2 class="mb-2 font-bold text-text-color capitalize">
        {{ $t('transaction.transferTo') }}
      </h2>

      <AddressInput
        v-model="address"
        :is-invalid="isYourAddress"
        label=""
        class="flex-1"
        placeholder="Enter wallet address"
        with-address-check
        @check="isValid => isAddressValid = isValid"
      />
    </template>

    <template #footer>
      <div class="mt-3 flex justify-between text-k-grey">
        <NeoIcon
          icon="circle-info"
          size="small"
          class="mr-4"
        />

        <p class="text-xs">
          {{ $t('transaction.wrongAddressCannotRecoveredWarning') }}
        </p>
      </div>
    </template>
  </UserCartModal>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import { Interaction } from '@kodadot1/minimark/v1'
import { toSubstrateAddress } from '@/services/profile'
import AddressInput from '@/components/shared/AddressInput.vue'
import type { ActionSend } from '@/composables/transaction/types'

const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()

const userCartModal = ref()
const address = ref('')
const isAddressValid = ref(false)

const items = computed(() => userCartModal.value?.items || [] as ListCartItem[])
const nft = computed(() => items.value[0])
const abi = useCollectionAbi(computed(() => nft.value?.collection.id))

const label = computed(() => {
  if (!address.value) {
    return $i18n.t('transaction.inputAddressFirst')
  }
  if (!isAddressValid.value) {
    return $i18n.t('transaction.addressIncorrect')
  }
  if (isYourAddress.value) {
    return $i18n.t('transaction.selfTransfer')
  }
  return $i18n.t('transaction.transferNft')
})

const isYourAddress = computed(() => getChainAddress(accountId.value) === getChainAddress(address.value))
const loading = computed(() => (isEvm(urlPrefix.value) ? !abi.value : false))

const disabled = computed(
  () =>
    !address.value
    || !isAddressValid.value
    || isYourAddress.value,
)

const getAction = (): ActionSend => ({
  interaction: Interaction.SEND,
  urlPrefix: urlPrefix.value,
  address: address.value,
  abi: abi.value,
  nfts: items.value.map(item => ({
    id: item.id,
    sn: item.sn,
    collectionId: item.collection.id,
  })),
  successMessage: $i18n.t('transaction.item.success') as string,
  errorMessage: $i18n.t('transaction.item.error') as string,
})

const reset = () => {
  address.value = ''
  isAddressValid.value = false
}

const getChainAddress = (value: string) => {
  try {
    return toSubstrateAddress(value)
  }
  catch (error) {
    return null
  }
}
</script>
