<template>
  <div>
    <SigningModal
      :title="$t('transaction.offerWithdraw')"
      :is-loading="isLoading"
      :status="status"
      @try-again="cancelOffer"
    />

    <NeoModal
      :value="modelValue"
      append-to-body
      @close="onClose"
    >
      <ModalBody
        :title="$t('offer.yourOffer')"
        :loading="loading"
        @close="onClose"
      >
        <div>
          <ModalIdentityItem />

          <div
            v-if="offer"
            class="py-5"
          >
            <CartItemDetails
              v-if="nft"
              :nft="nftToOfferItem(nft)"
            >
              <template #right>
                <div class="flex items-end flex-shrink-0">
                  {{ nftFormatted }}
                </div>
              </template>
            </CartItemDetails>

            <hr class="my-5">

            <div class="flex flex-col gap-2">
              <div class="flex justify-between items-center">
                <p class="text-k-grey text-xs">
                  {{ $t('amount') }}
                </p>

                <p class="flex gap-2 items-center">
                  <span>{{ formmatedOffer }}</span>
                  <span class="text-k-grey text-xs">({{ offerUsd }})</span>
                </p>
              </div>

              <div class="flex justify-between items-center">
                <p class="text-k-grey text-xs">
                  {{ $t('expiration') }}
                </p>

                <p>
                  {{ offer.time }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between !pt-5">
          <NeoButton
            class="!w-full !border-k-red !bg-k-red-accent-2"
            variant="outlined-rounded"
            :label="$t('transaction.offerWithdraw')"
            @click="cancelOffer"
          />
        </div>
      </ModalBody>
    </NeoModal>
  </div>
</template>

<script setup lang="ts">
import { NeoModal, NeoButton } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import nftById from '@/queries/subsquid/general/nftById.graphql'
import type { NFT } from '@/components/rmrk/service/scheme'
import { nftToOfferItem } from '@/components/common/shoppingCart/utils'

const emit = defineEmits(['close'])
const props = defineProps<{
  modelValue: boolean
  offer?: NFTOfferItem
}>()

const vModel = useVModel(props, 'modelValue')

const { urlPrefix, client } = usePrefix()
const { decimals, chainSymbol } = useChain()
const { transaction, isLoading, status } = useTransaction()

const offeredId = ref<number>()
const subscription = ref(() => {})

const nftId = computed(() => props.offer?.desired.id)

const { data: nft, pending: nftLoading } = await useAsyncData(`offer-nft-id-${nftId.value}`, async () => {
  if (!nftId.value) {
    return null
  }

  const { data } = await useAsyncQuery<{ nftEntity: NFT }>({
    query: nftById,
    variables: {
      id: nftId.value,
    },
    clientId: client.value,
  })
  return data.value.nftEntity
}, { watch: [nftId] })

const { formatted: nftFormatted } = useAmount(
  computed(() => nft.value?.price),
  decimals,
  chainSymbol,
)

const { formatted: formmatedOffer, usd: offerUsd } = useAmount(
  computed(() => props.offer?.price),
  decimals,
  chainSymbol,
)

const loading = computed(() => nftLoading.value || !offeredId.value)

const cancelOffer = () => {
  if (!offeredId.value) {
    return
  }
  vModel.value = false
  transaction({
    interaction: ShoppingActions.WITHDRAW_OFFER,
    urlPrefix: urlPrefix.value,
    offeredId: offeredId.value,
  })
}

watch(() => props.offer, () => {
  if (props.offer?.blockNumber) {
    subscription.value?.()
    subscription.value = useSubscriptionGraphql({
      query: `nftEntities(where: {
            blockNumber_eq: ${props.offer.blockNumber}
            issuer_eq: "${props.offer.caller}"
        }) {
          sn
        }`,
      onChange: ({ data: { nftEntities } }) => {
        offeredId.value = nftEntities[0].sn
      },
    })
  }
})

const onClose = () => {
  vModel.value = false
  onModalAnimation(() => emit('close'))
}
</script>

<style lang="scss" scoped>
// make prop
:deep(.identity-name-font-weight-regular) {
  .identity-name {
    font-weight: unset !important;
  }
}
</style>
