<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <NeoModal :value="isModalActive" scroll="clip" @close="onClose">
      <div class="modal-width">
        <header
          class="border-b border-grey flex items-center justify-between px-6">
          <p class="py-5 is-size-6 has-text-weight-bold">
            {{ $t('transaction.transferNft') }}
          </p>

          <NeoButton
            variant="text"
            no-shadow
            icon="xmark"
            size="medium"
            class="cross"
            @click="onClose" />
        </header>

        <div class="px-6 pt-4 pb-5">
          <ModalIdentityItem />

          <div class="mt-4 flex">
            <div>
              <BasicImage
                :src="avatar"
                :alt="nft?.name"
                class="border image is-48x48" />
            </div>

            <div
              class="flex flex-col justify-between ml-4 limit-width w-full is-clipped">
              <div
                class="has-text-weight-bold has-text-color line-height-1 no-wrap is-ellipsis">
                {{ nft.name }}
              </div>
              <div class="line-height-1 no-wrap is-ellipsis">
                {{ nft.collection?.name || nft.collection.id }}
              </div>
            </div>

            <div class="ml-4 flex items-end no-wrap">
              {{ nftPrice }}
            </div>
          </div>

          <hr class="my-4" />

          <h2 class="mb-2 has-text-weight-bold has-text-color capitalize">
            {{ $t('transaction.transferTo') }}
          </h2>

          <AddressInput
            v-model="address"
            :is-invalid="isYourAddress"
            label=""
            class="flex-1"
            placeholder="Enter wallet address"
            with-address-check
            @check="handleAddressCheck" />
        </div>

        <div class="px-6 pb-4 flex flex-col">
          <NeoButton
            :disabled="isDisabled"
            :label="transferItemLabel"
            variant="k-accent"
            no-shadow
            class="flex flex-grow py-5 capitalize btn-height"
            @click="transfer" />

          <div class="mt-3 flex justify-between has-text-grey">
            <NeoIcon icon="circle-info" size="small" class="mr-4" />

            <p class="text-xs">
              {{ $t('transaction.wrongAddressCannotRecoveredWarning') }}
            </p>
          </div>
        </div>
      </div>
    </NeoModal>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoIcon, NeoModal } from '@kodadot1/brick'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import { NFT } from '@/components/rmrk/service/scheme'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import { parseNftAvatar } from '@/utils/nft'
import AddressInput from '@/components/shared/AddressInput.vue'
import { Interaction } from '@kodadot1/minimark/v1'
import formatBalance from '@/utils/format/balance'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'

const emit = defineEmits(['close'])
const props = defineProps<{
  nft: NFT
  value: boolean
}>()

const { $i18n } = useNuxtApp()
const route = useRoute()
const { transaction, status, isLoading } = useTransaction()
const { urlPrefix } = usePrefix()
const { decimals, chainSymbol, chainProperties } = useChain()
const ss58Format = computed(() => chainProperties.value?.ss58Format)
const { accountId } = useAuth()

const isModalActive = useVModel(props, 'value')
const avatar = ref<string>()
const address = ref('')
const isAddressValid = ref(false)

const transferItemLabel = computed(() => {
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

const isYourAddress = computed(
  () => accountId.value === getChainAddress(address.value),
)

const isDisabled = computed(
  () => !address.value || !isAddressValid.value || isYourAddress.value,
)

const nftPrice = computed(() =>
  Number(props.nft.price)
    ? formatBalance(Number(props.nft.price), decimals.value, chainSymbol.value)
    : '--',
)

const getAvatar = async () => {
  if (props.nft) {
    avatar.value = await parseNftAvatar(props.nft)
  }
}

const onClose = () => {
  emit('close')
}

const handleAddressCheck = (isValid) => {
  isAddressValid.value = isValid
}

const getChainAddress = (value: string) => {
  try {
    const publicKey = decodeAddress(value)
    return encodeAddress(publicKey, ss58Format.value)
  } catch (error) {
    return null
  }
}

const transfer = () => {
  transaction({
    interaction: Interaction.SEND,
    urlPrefix: urlPrefix.value,
    address: address.value,
    tokenId: route.params.id.toString(),
    nftId: props.nft.id,
    successMessage: $i18n.t('transaction.item.success') as string,
    errorMessage: $i18n.t('transaction.item.error') as string,
  })
  emit('close')
}

onMounted(() => {
  getAvatar()
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.modal-width {
  width: 25rem;
}

@include touch() {
  .modal-width {
    width: unset;
  }
}
.btn-height {
  height: 3.5rem;
}

.limit-width {
  max-width: 100%;
}
</style>
