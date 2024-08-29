<template>
  <div>
    <SigningModal
      :title="$t('transaction.offerWithdraw')"
      :is-loading="isLoading"
      :status="status"
      @try-again="execOffer"
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
                <span class="text-k-grey text-xs">
                  {{ $t('amount') }}
                </span>

                <p class="flex gap-2 items-center">
                  <span>{{ formmatedOffer }}</span>
                  <span class="text-k-grey text-xs">({{ offerUsd }})</span>
                </p>
              </div>

              <div
                v-if="isWithdrawMode"
                class="flex justify-between items-center"
              >
                <span class="text-k-grey text-xs">
                  {{ $t('expiration') }}
                </span>

                <span>
                  {{ offer.expirationDate ? formatToNow(offer.expirationDate, false) : '' }}
                </span>
              </div>

              <div
                v-if="isAcceptMode"
                class="flex justify-between items-center"
              >
                <span class="text-k-grey text-xs">
                  {{ $t('offer.floorDifference') }}
                </span>

                <span>
                  {{ diff }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="offer"
          class="flex justify-between !pt-5"
        >
          <OfferOwnerButton
            class="!w-full"
            :offer="offer"
            @click="execOffer"
          />
        </div>
      </ModalBody>
    </NeoModal>
  </div>
</template>

<script setup lang="ts">
import { NeoModal } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import nftById from '@/queries/subsquid/general/nftById.graphql'
import type { NFT } from '@/components/rmrk/service/scheme'
import { nftToOfferItem } from '@/components/common/shoppingCart/utils'
import { formatToNow } from '@/utils/format/time'

type OverviewMode = 'withdraw' | 'accept' | 'view'

const emit = defineEmits(['close'])
const props = defineProps<{
  modelValue: boolean
  offer?: NFTOfferItem
}>()

const vModel = useVModel(props, 'modelValue')

const { accountId } = useAuth()
const { urlPrefix, client } = usePrefix()
const { decimals, chainSymbol } = useChain()
const { transaction, isLoading, status } = useTransaction()
const { isOwnerOfNft } = useIsOffer(computed(() => props.offer), accountId)

const offeredItem = ref<number>()
const subscription = ref(() => {})

const nftId = computed(() => props.offer?.desired.id)
const mode = computed<OverviewMode>(() => isOwnerOfNft.value ? 'accept' : 'withdraw')

const isWithdrawMode = computed(() => mode.value === 'withdraw')
const isAcceptMode = computed(() => mode.value === 'accept')

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

const getFormattedDifference = (a: number, b: number) => {
  const diff = ((b - a) / b) * 100

  return diff > 0
    ? `-${diff.toFixed()}%`
    : `+${Math.abs(diff).toFixed()}%`
}

const floorPrice = computed(() => Number(nft.value?.collection.floorPrice[0].price) || 0)

const diff = computed(() => getFormattedDifference(Number(props.offer?.price || 0), floorPrice.value))

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

const loading = computed(() => nftLoading.value || !offeredItem.value)

const execOffer = () => {
  if (!offeredItem.value || !nft.value || !props.offer) {
    return
  }

  vModel.value = false

  if (isWithdrawMode.value) {
    transaction({
      interaction: ShoppingActions.WITHDRAW_OFFER,
      urlPrefix: urlPrefix.value,
      offeredId: offeredItem.value,
    })
  }

  if (isAcceptMode.value) {
    transaction({
      interaction: ShoppingActions.ACCEPT_OFFER,
      urlPrefix: urlPrefix.value,
      offeredId: offeredItem.value,
      nftId: nft.value.sn as string,
      collectionId: nft.value.collection.id as string,
      price: props.offer.price,
    })
  }
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
        offeredItem.value = nftEntities[0].sn
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
