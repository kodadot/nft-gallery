<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <GalleryItemPriceSection ref="root" title="Highest Offer" :price="price">
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
            no-shadow
            @click.native="toggleActive" />
        </template>
        <template #action>
          <NeoTooltip
            v-if="active"
            :active="insufficientBalance"
            :label="$t('tooltip.notEnoughBalance')">
            <NeoButton
              v-if="active && !confirm"
              :disabled="disabledConfirmBtn"
              label="Confirm 1/2"
              size="large"
              fixed-width
              variant="k-blue"
              no-shadow
              @click.native="confirm1" />
          </NeoTooltip>
          <NeoButton
            v-if="confirm"
            label="Confirm 2/2"
            size="large"
            fixed-width
            variant="k-blue"
            no-shadow
            @click.native="confirm2" />
        </template>

        <template #content>
          <div
            v-if="!confirm"
            class="offer is-flex is-justify-content-space-between is-align-items-center">
            <input
              v-model="offerPrice"
              class="input-price is-flex is-align-items-center"
              type="number"
              placeholder="Type Your Offer"
              min="0" />
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
import { dangerMessage } from '@/utils/notification'
import { ShoppingActions } from '@/utils/shoppingActions'
import { simpleDivision } from '@/utils/balance'
import GalleryItemPriceSection from '../GalleryItemActionSection.vue'
import GalleryItemActionSlides from '../GalleryItemActionSlides.vue'
import WalletModal from '@/components/common/WalletModal.vue'
import Vue from 'vue'

const Loader = defineAsyncComponent(
  () => import('@/components/shared/Loader.vue')
)

const props = defineProps<{
  nftId: string
  collectionId: string
  currentOwner: string
  account: string
}>()

const { apiInstance } = useApi()
const { urlPrefix, tokenId } = usePrefix()
const { $store, $route, $i18n, $buefy } = useNuxtApp()
const { transaction, status, isLoading } = useTransaction()
const { accountId } = useAuth()
const { decimals } = useChain()
const root = ref<Vue<Record<string, string>>>()
const connected = computed(() => Boolean(accountId.value))

const balance = computed<string>(() => {
  if (urlPrefix.value == 'rmrk') {
    return $store.getters.getAuthBalance
  }
  return $store.getters.getTokenBalanceOf(tokenId.value)
})
const { data } = useGraphql({
  queryName: 'offerHighest',
  queryPrefix: 'chain-bsx',
  variables: {
    id: props.nftId,
    account: props.account,
  },
})

const price = ref('')
const offerPrice = ref<number>()
const active = ref(false)
const confirm = ref(false)
const days = [7, 14, 30]
const selectedDay = ref(14)

const insufficientBalance = computed(
  () => Number(offerPrice.value) > simpleDivision(balance.value, decimals.value)
)

const offerPriceInvalid = computed(() => {
  if (offerPrice.value) {
    return Math.sign(offerPrice.value) !== 1
  }
  return true
})

const disabledConfirmBtn = computed(
  () => !(!offerPriceInvalid.value && !insufficientBalance.value)
)

function toggleActive() {
  if (!connected.value) {
    $buefy.modal.open({
      parent: root?.value,
      component: WalletModal,
      hasModalCard: true,
      trapFocus: true,
      canCancel: true,
    })
    return
  }
  active.value = !active.value
}

function confirm1() {
  confirm.value = true
}

async function confirm2() {
  try {
    transaction({
      interaction: ShoppingActions.MAKE_OFFER,
      currentOwner: props.currentOwner,
      day: selectedDay.value,
      price: offerPrice.value || 0,
      tokenId: $route.params.id,
      urlPrefix: urlPrefix.value,
      successMessage: $i18n.t('transaction.offer.success') as string,
      errorMessage: $i18n.t('transaction.item.error') as string,
    })
  } catch (error) {
    dangerMessage(error)
  } finally {
    active.value = false
    confirm.value = false
  }
}

watchEffect(async () => {
  price.value =
    currentBlock < data.value?.offers[0]?.expiration
      ? data.value?.offers[0]?.price
      : ''
})

const currentBlock = computed(async () => {
  const api = await apiInstance.value
  const block = await api.rpc.chain.getHeader()
  return block.number.toNumber()
})

const actionRef = ref(null)
onClickOutside(actionRef, () => {
  active.value = false
  confirm.value = false
})
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

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
      border-left: 1px solid $k-grey;
      text-align: center;
      margin-left: 0.5rem;
      padding-left: 0.5rem;
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
