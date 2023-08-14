<template>
  <div>
    <NeoModal v-model="isModalActive" @close="isModalActive = false">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">{{ $t('sharing.profile') }}</p>
        </header>
        <div class="card-content has-text-centered">
          <QRCode :text="realworldFullPath" color="#db2980" bg-color="#000" />
        </div>
      </div>
    </NeoModal>
    <div class="container is-fluid pb-8 border-bottom">
      <div class="columns is-centered">
        <div class="column is-half has-text-centered">
          <div class="container image is-64x64 mb-2">
            <Avatar :value="id" />
          </div>
          <h1 class="title is-2" data-cy="user-identity">
            <a
              v-if="hasBlockExplorer"
              :href="explorer"
              target="_blank"
              rel="nofollow noopener noreferrer">
              <Identity
                ref="identity"
                :address="id"
                emit
                @change="handleIdentity" />
            </a>
            <Identity
              v-else
              ref="identity"
              :address="id"
              emit
              @change="handleIdentity" />
          </h1>
          <nuxt-link v-if="isAllowSetIdentity" to="/identity">
            + {{ $t('identity.set') }}
          </nuxt-link>
          <div class="is-flex is-align-items-center is-justify-content-center">
            <NeoButton
              no-shadow
              variant="text"
              label="Subscan"
              tag="a"
              :href="`https://subscan.io/account/${id}`"
              target="_blank"
              rel="nofollow noopener noreferrer" />

            <div class="divider" />
            <NeoButton
              no-shadow
              variant="text"
              label="SubID"
              tag="a"
              :href="`https://sub.id/#/${id}`"
              target="_blank"
              rel="nofollow noopener noreferrer" />

            <div class="divider" />
            <NeoButton
              v-clipboard:copy="id"
              variant="text"
              no-shadow
              label="Copy Address" />
            <div class="divider" />
            <NeoButton
              variant="text"
              no-shadow
              label="QR Code"
              @click.native="isModalActive = true" />
            <div class="divider" />
            <NeoButton
              no-shadow
              label="Transfer"
              variant="text"
              tag="nuxt-link"
              :to="`/${urlPrefix}/transfer?target=${id}&usdamount=10&donation=true`">
            </NeoButton>
          </div>
        </div>
      </div>
      <div class="columns is-centered is-align-items-center">
        <div
          class="column is-12-mobile is-6-tablet is-7-desktop is-8-widescreen">
          <ProfileActivity :id="id" />
        </div>
      </div>
      <div class="is-flex">
        <TabItem
          v-for="tab in tabs"
          :key="tab"
          :active="activeTab === tab"
          :text="tab"
          @click.native="() => switchToTab(tab)" />
      </div>
    </div>

    <div class="container is-fluid">
      <div
        v-if="activeTab === 'owned' || activeTab === 'created'"
        class="is-flex-grow-1">
        <div
          class="is-flex is-justify-content-space-between pb-4 pt-5 is-align-content-center">
          <div class="is-flex">
            <NeoButton
              :active="listed"
              no-shadow
              rounded
              label="Buy Now"
              @click.native="toggleListed" />
            <NeoButton
              v-if="activeTab === 'created'"
              :active="sold"
              no-shadow
              rounded
              label="Sold"
              class="ml-4"
              @click.native="toggleSold" />
          </div>
          <div class="is-hidden-mobile">
            <ProfileGrid />
          </div>
        </div>
        <hr class="my-0" />
        <ItemsGrid :search="itemsGridSearch" />
      </div>
      <CollectionList
        v-if="activeTab === 'collections'"
        :search="[
          {
            issuer_eq: id,
          },
        ]" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getExplorer, hasExplorer } from '@kodadot1/static'

// import {
//   CollectionWithMeta,
//   Interaction,
//   Pack,
// } from '@/components/rmrk/service/scheme'
// import { Offer } from '@/components/bsx/Offer/types'

// import { CollectionChartData as ChartData } from '@/utils/chart'

import { NeoButton, NeoModal } from '@kodadot1/brick'
import TabItem from '../shared/TabItem.vue'
import Identity from '../identity/IdentityIndex.vue'
import CollectionList from '../collection/CollectionList.vue'
import ItemsGrid from '../items/ItemsGrid/ItemsGrid.vue'
import ProfileGrid from './ProfileGrid.vue'

const route = useRoute()
// const router = useRouter()
const { replaceUrl } = useReplaceUrl()
const { accountId } = useAuth()
const { urlPrefix } = usePrefix()
const tabs = ['owned', 'created', 'collections', 'activity']

const switchToTab = (tab: string) => {
  activeTab.value = tab
}

const id = computed(() => route.params.id || '')
// const shortendId = ref('')
// const eventsOfNftCollection = ref<Interaction[]>([])
// const userOfferList = ref<Offer[]>([])
// const eventsOfSales = ref<Interaction[]>([])
// const priceChartData = ref<[Date, number][][]>([])
// const priceData = ref<[ChartData[], ChartData[]] | []>([])
// const packs = ref<Pack[]>([])
// const name = ref('')
const email = ref('')
const twitter = ref('')
const displayName = ref('')
const web = ref('')
const legal = ref('')
const riot = ref('')
const isModalActive = ref(false)

const itemsGridSearch = computed(() => {
  const tabKey = activeTab.value === 'owned' ? 'currentOwner_eq' : 'issuer_eq'
  const query: Record<string, string | number> = {
    [tabKey]: id.value,
  }

  if (listed.value) {
    query['price_gt'] = 0
  }
  if (sold.value) {
    query['currentOwner_not_eq'] = id.value
  }

  return query
})

const realworldFullPath = computed(() => window.location.href)

const activeTab = computed({
  get() {
    return (route.query.tab as string) || 'owned'
  },
  set(val) {
    replaceUrl({ tab: val })
  },
})

const listed = computed({
  get() {
    return route.query.buy_now === 'true'
  },
  set(val) {
    replaceUrl({ buy_now: val })
  },
})

const sold = computed({
  get() {
    return route.query.sold === 'true'
  },
  set(val) {
    replaceUrl({ sold: val })
  },
})
const toggleListed = () => {
  listed.value = !listed.value
}
const toggleSold = () => {
  sold.value = !sold.value
}

const isMyProfile = computed(() => id.value === accountId.value)
const hasBlockExplorer = computed(() => hasExplorer(urlPrefix.value))
const explorer = computed(() => getExplorer(urlPrefix.value, id.value))

const isAllowSetIdentity = computed(() => {
  return !displayName.value && isMyProfile.value && hasBlockExplorer.value
})

const handleIdentity = (identityFields: Record<string, string>) => {
  displayName.value = identityFields?.display as string
  email.value = identityFields?.email as string
  twitter.value = identityFields?.twitter as string
  riot.value = identityFields?.riot as string
  web.value = identityFields?.web as string
  legal.value = identityFields?.legal as string
}

// export default class ProfileDetail extends mixins(
//   PrefixMixin,
//   InfiniteScrollMixin,
//   ChainMixin,
//   AuthMixin
// ) {

//   // Get collection query with NFT Events on it
//   protected async fetchCollectionEvents() {
//     try {
//       const { data } = await this.$apollo.query<{ events: Interaction[] }>({
//         query: allEventsByProfile,
//         client: this.client,
//         variables: {
//           id: this.id,
//           search: {
//             caller_eq: this.id,
//           },
//         },
//       })
//       if (data && data.events && data.events.length) {
//         let events: Interaction[] = data.events
//         this.eventsOfNftCollection = [...sortedEventByDate(events, 'DESC')]
//         this.checkTabLocate()
//       }
//     } catch (e) {
//       showNotification(`${e}`, notificationTypes.warn)
//     }
//   }

//   // Get Sales event of an creator
//   protected async fetchSalesEventByCreator() {
//     try {
//       this.isFetchingData = true
//       const { data } = await this.$apollo.query<{ events: Interaction[] }>({
//         query: recentSalesForCreator,
//         client: this.client,
//         variables: {
//           id: this.id,
//           limit: this.first,
//           offset: (this.currentPage - 1) * this.first,
//         },
//       })
//       if (data && data.events && data.events.length) {
//         let events: Interaction[] = data.events
//         this.eventsOfSales = [...sortedEventByDate(events, 'DESC')]
//         this.checkTabLocate()
//       }
//     } catch (e) {
//       showNotification(`${e}`, notificationTypes.warn)
//     }
//   }

//   // Get offers for user
//   protected async fetchOfferEvents(isBurned = false) {
//     try {
//       const { data } = await this.$apollo.query<OfferResponse>({
//         query: offerListUser,
//         client: this.client,
//         variables: {
//           id: this.id,
//           burned: isBurned,
//         },
//       })
//       if (data?.offers?.length) {
//         this.userOfferList = data.offers
//       } else {
//         this.userOfferList = []
//       }
//     } catch (e) {
//       showNotification(`${e}`, notificationTypes.warn)
//     }
//   }

//   public offersListUpdate(bool) {
//     this.fetchOfferEvents(bool)
//   }
// }
</script>

<style lang="scss" scoped>
.invisible-tab > nav.tabs {
  display: none;
}

.tab-counter::before {
  content: ' - ';
  white-space: pre;
}

.title {
  flex-grow: 0;
  flex-basis: auto;
}

.divider {
  width: 1px;
  height: 5px;
  background-color: grey;
  margin: 0 10px;
}
</style>
