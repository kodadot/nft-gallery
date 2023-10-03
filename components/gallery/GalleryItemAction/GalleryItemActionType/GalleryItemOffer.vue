<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <GalleryItemPriceSection title="Highest Offer" :price="price">
      <GalleryItemActionSlides
        ref="actionRef"
        :active="active"
        :class="{ 'gallery-item-slides-entry': !active }">
        <template #entry>
          <NeoButton
            v-if="!active"
            label="Make Offer"
            size="large"
            variant="k-blue"
            class="full-width-action-button"
            data-testid="make-offer"
            no-shadow
            @click="toggleActive" />
        </template>
        <template #action>
          <NeoTooltip
            v-if="!confirm"
            :active="insufficientBalance || offerPriceInvalid"
            :label="
              insufficientBalance
                ? $t('tooltip.notEnoughBalance')
                : $t('tooltip.invalidAmount')
            "
            append-to-body
            multiline>
            <NeoButton
              :disabled="disabledConfirmBtn"
              label="Confirm 1/2"
              size="large"
              fixed-width
              variant="k-blue"
              no-shadow
              @click="confirm = true" />
          </NeoTooltip>
          <NeoButton
            v-if="confirm"
            label="Confirm 2/2"
            size="large"
            fixed-width
            variant="k-blue"
            no-shadow
            @click="confirm2" />
        </template>

        <template #content>
          <div
            v-if="!confirm"
            class="offer is-flex is-justify-content-space-between is-align-items-center">
            <input
              v-model="offerPrice"
              class="input-price is-flex is-align-items-center px-4"
              type="number"
              placeholder="Your Offer"
              :min="MIN_OFFER_PRICE" />
            <div class="px-4">KSM</div>
          </div>
          <div
            v-else
            class="offer is-flex is-justify-content-space-evenly is-align-items-center">
            <img src="/timer.svg" />
            <div class="is-flex offer-days">
              <div v-for="day in days" :key="day">
                <input
                  :id="`${day}`"
                  v-model="selectedDay"
                  type="radio"
                  name="days"
                  :value="day" />
                <label :for="`${day}`">{{ day }}</label>
              </div>
            </div>
            <div>Days</div>
          </div>
        </template>
      </GalleryItemActionSlides>
    </GalleryItemPriceSection>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoTooltip } from '@kodadot1/brick'
import { onClickOutside } from '@vueuse/core'
import { warningMessage } from '@/utils/notification'
import { ShoppingActions } from '@/utils/shoppingActions'
import { simpleDivision } from '@/utils/balance'
import GalleryItemPriceSection from '../GalleryItemActionSection.vue'
import GalleryItemActionSlides from '../GalleryItemActionSlides.vue'
import { ConnectWalletModalConfig } from '@/components/common/ConnectWallet/useConnectWallet'
import { MIN_OFFER_PRICE } from '@/utils/constants'
import { getAsssetBalance } from '@/utils/api/bsx/query'
import Loader from '@/components/shared/Loader.vue'

const props = defineProps<{
  nftId: string
  collectionId: string
  currentOwner: string
  account: string
}>()

const { apiInstance } = useApi()
const route = useRoute()
const { urlPrefix, tokenId } = usePrefix()
const { neoModal } = useProgrammatic()
const { $i18n } = useNuxtApp()
const { transaction, status, isLoading } = useTransaction()
const { accountId } = useAuth()
const { decimals } = useChain()
const connected = computed(() => Boolean(accountId.value))

const balance = ref<string>('0')
onMounted(() => {
  fetchBalance()
})

const fetchBalance = async () => {
  const { apiInstance } = useApi()
  const api = await apiInstance.value
  getAsssetBalance(api, accountId.value, tokenId.value).then((data) => {
    balance.value = data
  })
}

const price = ref('')
const offerPrice = ref<number>()
const active = ref(false)
const confirm = ref(false)
const days = [7, 14, 30]
const selectedDay = ref(14)

const insufficientBalance = computed(
  () =>
    Number(offerPrice.value) > simpleDivision(balance.value, decimals.value),
)

const offerPriceInvalid = computed(() => {
  if (offerPrice.value) {
    return offerPrice.value < MIN_OFFER_PRICE
  }
  return true
})

const disabledConfirmBtn = computed(
  () => offerPriceInvalid.value || insufficientBalance.value,
)

const { data: highestOffer } = useGraphql({
  queryName: 'offerHighest',
  queryPrefix: 'chain-bsx',
  variables: {
    id: props.nftId,
  },
})

function toggleActive() {
  if (!connected.value) {
    neoModal.open({
      ...ConnectWalletModalConfig,
    })
    return
  }
  active.value = !active.value
}

async function confirm2() {
  try {
    transaction({
      interaction: ShoppingActions.MAKE_OFFER,
      currentOwner: props.currentOwner,
      day: selectedDay.value,
      price: offerPrice.value || 0,
      tokenId: route.params.id,
      urlPrefix: urlPrefix.value,
      successMessage: $i18n.t('transaction.offer.success') as string,
      errorMessage: $i18n.t('transaction.item.error') as string,
    })
  } catch (error) {
    warningMessage(error)
  } finally {
    active.value = false
    confirm.value = false
  }
}

async function currentBlock() {
  const api = await apiInstance.value
  const block = await api.rpc.chain.getHeader()
  return block.number.toNumber()
}

watch(highestOffer, async () => {
  const blockNumber = await currentBlock()
  if (highestOffer.value) {
    price.value =
      blockNumber < Number(highestOffer.value.value.offers[0]?.expiration)
        ? highestOffer.value.value.offers[0]?.price
        : ''
  }
})

const actionRef = ref(null)
onClickOutside(actionRef, () => {
  active.value = false
  confirm.value = false
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.offer {
  width: 12rem;

  &-price {
    border: 1px solid black;
    border-left: 0;
    padding: 0 0.5rem;
    height: 54px;
    outline: none;
    width: 100%;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
    }
  }

  &-days {
    justify-content: center;
    width: 45%;

    input[type='radio'] {
      display: none;

      &:checked + label {
        font-weight: bold;
      }
    }

    label {
      cursor: pointer;
      display: block;
      line-height: 1;
      text-align: center;
      margin-left: 0.5rem;
      padding-left: 0.5rem;

      @include ktheme() {
        border-left: 1px solid theme('k-grey');
      }
    }

    & > *:first-child label {
      border-left: 0;
      margin-left: 0;
      padding-left: 0;
    }
  }

  @include until-widescreen {
    width: 100%;
  }
}
</style>
