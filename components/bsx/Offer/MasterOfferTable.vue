<template>
  <div>
    <div class="flex items-center justify-center mb-5">
      <AddressInput
        v-model="destinationAddress"
        :empty-on-error="false"
        class="address-input mr-3"
        icon="close-circle"
        :strict="false"
        @input="handleAddressUpdate($event.target.value)" />
      <NeoButton
        v-if="isLogIn"
        icon-left="paper-plane"
        class="fill-button mt-6"
        @click="fillUpAddress">
        Fill My Address
      </NeoButton>
    </div>
    <section>
      <NeoSelect
        v-model="selectedOfferType"
        class="mb-2"
        :disabled="isOfferDropdownDisabled">
        <option
          v-for="option in offerTypeOptions"
          :key="option.type"
          :value="option.type">
          {{ option.label }}
        </option>
      </NeoSelect>
      <template v-if="currentOfferType === SelectedOfferType.CREATED">
        <OffersUserTable :offers="createdOffers" :owner-id="''" hide-toggle />
      </template>
      <div v-show="currentOfferType === SelectedOfferType.INCOMING">
        <MyOffer
          :address="accountIdChanged"
          hide-heading
          @offers-incoming="offersIncomingUpdate" />
      </div>
      <template v-if="currentOfferType === SelectedOfferType.ALL">
        <OfferTable
          :offers="
            skipUserOffer
              ? createdOffers
              : [...createdOffers, ...incomingOffers]
          "
          :account-id="accountId"
          is-bsx-stats
          display-collection />
      </template>
    </section>
  </div>
</template>

<script lang="ts" setup>
import offerListUser from '@/queries/subsquid/bsx/offerListUser.graphql'
import { notificationTypes, showNotification } from '~/utils/notification'
import { isAddress } from '@polkadot/util-crypto'
import { SelectedOfferType } from '~/utils/offerStatus'

import OfferTable from '@/components/bsx/Offer/OfferTable.vue'
import OffersUserTable from '@/components/bsx/Offer/OffersUserTable.vue'
import MyOffer from '@/components/bsx/Offer/MyOffer.vue'

import { NeoButton, NeoSelect } from '@kodadot1/brick'

const createdOffers = ref([])
const destinationAddress = ref('')
const accountIdChanged = ref('')
const incomingOffers = ref([])
const skipUserOffer = ref(false) // skip fetching with id when this variable is true

const { $i18n } = useNuxtApp()
const { accountId, isLogIn } = useAuth()
const { client } = usePrefix()
const route = useRoute()
const router = useRouter()

const currentOfferType = ref(SelectedOfferType.ALL)

const selectedOfferType = computed({
  get: () => route.query.tab || currentOfferType.value,
  set: (value) => {
    const { target } = route.query
    router.push({
      query: { target, tab: value },
    })
    currentOfferType.value = value as SelectedOfferType
  },
})

const isOfferDropdownDisabled = computed(() => skipUserOffer.value)

const offerTypeOptions = ref([
  {
    type: SelectedOfferType.ALL,
    label: $i18n.t('offer.allOffers'),
  },
  {
    type: SelectedOfferType.CREATED,
    label: $i18n.t('offer.offersCreated'),
  },
  {
    type: SelectedOfferType.INCOMING,
    label: $i18n.t('offer.incomingOffers'),
  },
])

const handleAddressUpdate = (target: string) => {
  const { tab } = route.query
  if (target) {
    checkOfferForAddress()
    router.replace({ query: { target, tab } }).catch(() => null) // null to further not throw navigation errors
  } else {
    currentOfferType.value = SelectedOfferType.ALL
    checkOfferForAddress(true)
    router.replace({ query: { tab } }).catch(() => null) // null to further not throw navigation errors
  }
}

const fillUpAddress = () => {
  destinationAddress.value = accountId.value
  handleAddressUpdate(accountId.value)
}

const offersIncomingUpdate = (data) => {
  incomingOffers.value = data.offers
}

const checkQueryParams = () => {
  const { query } = route
  if (query.target) {
    const hasAddress = isAddress(query.target as string)
    if (hasAddress) {
      destinationAddress.value = query.target as string
      accountIdChanged.value = query.target as string
    } else {
      showNotification('Unable to use target address', notificationTypes.warn)
    }
  } else {
    skipUserOffer.value = true
  }
}

const checkOfferForAddress = (skipAddress = false) => {
  skipUserOffer.value = skipAddress
  fetchCreatedOffers()
  accountIdChanged.value = destinationAddress.value
}

const fetchCreatedOffers = async () => {
  try {
    let variables: any = {
      burned: false,
    }

    if (!skipUserOffer.value) {
      variables.id = destinationAddress.value || accountId.value
    }
    const { data } = await useAsyncQuery({
      query: offerListUser,
      variables,
      clientId: client.value,
    })
    if (data.value?.offers?.length) {
      createdOffers.value = data.value.offers
      if (!skipUserOffer.value) {
        incomingOffers.value = []
      }
    } else {
      createdOffers.value = []
    }
  } catch (e) {
    showNotification(`${e}`, notificationTypes.warn)
  }
}

onMounted(() => {
  checkQueryParams()
  fetchCreatedOffers()
})
</script>

<style scoped>
.address-input {
  width: 500px;
}

.fill-button {
  height: 3.25em;
}
</style>
