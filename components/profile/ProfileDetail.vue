<template>
  <div>
    <NeoModal :value="isModalActive" @close="isModalActive = false">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">{{ $t('sharing.profile') }}</p>
        </header>
        <div class="card-content has-text-centered">
          <QRCode :text="realworldFullPath" />
        </div>
      </div>
    </NeoModal>
    <div class="container is-fluid py-7 border-bottom">
      <div class="columns is-centered">
        <div class="column is-half has-text-centered">
          <div class="container image is-64x64 mb-2">
            <Avatar :value="id" />
          </div>
          <h1 class="title is-2" data-testid="profile-user-identity">
            <a
              v-if="hasBlockExplorer"
              v-safe-href="explorer"
              target="_blank"
              rel="nofollow noopener noreferrer">
              <Identity
                ref="identity"
                hide-identity-popover
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

          <NeoButton
            v-if="isAllowSetIdentity"
            to="/identity"
            no-shadow
            class="mb-4"
            rounded
            :tag="NuxtLink"
            size="small">
            + {{ $t('identity.set') }}
          </NeoButton>

          <div
            class="flex items-center justify-center flex-wrap"
            data-testid="profile-identity-buttons">
            <NeoButton
              v-safe-href="`https://subscan.io/account/${id}`"
              no-shadow
              variant="text"
              label="Subscan"
              tag="a"
              target="_blank"
              rel="nofollow noopener noreferrer" />

            <div class="divider" />
            <NeoButton
              v-safe-href="`https://sub.id/#/${id}`"
              no-shadow
              variant="text"
              label="SubID"
              tag="a"
              target="_blank"
              rel="nofollow noopener noreferrer" />

            <div class="divider" />
            <NeoButton
              v-clipboard:copy="id"
              variant="text"
              :label="$t('share.copyAddress')"
              no-shadow
              @click="toast($t('general.copyToClipboard'))" />
            <div class="divider" />
            <NeoButton
              variant="text"
              no-shadow
              :label="$t('share.qrCode')"
              @click="isModalActive = true" />
            <div class="divider" />
            <NeoButton
              no-shadow
              :label="$t('transfer')"
              variant="text"
              :tag="NuxtLink"
              :to="`/${urlPrefix}/transfer?target=${id}&usdamount=10&donation=true`">
            </NeoButton>
          </div>
        </div>
      </div>
      <div class="columns is-centered items-center">
        <div
          class="column is-12-mobile is-6-tablet is-7-desktop is-8-widescreen">
          <ProfileActivity :id="id" />
        </div>
      </div>
      <div class="flex is-hidden-touch is-hidden-desktop-only">
        <TabItem
          v-for="tab in tabs"
          :key="tab"
          class="capitalize"
          data-testid="profile-tabs"
          :active="activeTab === tab"
          :count="counts[tab]"
          :show-active-check="false"
          :text="tab"
          @click="() => switchToTab(tab)" />
        <ChainDropdown class="ml-6" />
        <OrderByDropdown
          v-if="activeTab !== ProfileTab.ACTIVITY"
          class="ml-6" />
      </div>
      <div class="flex flex-row is-hidden-widescreen mobile">
        <TabItem
          v-for="tab in tabs"
          :key="tab"
          :active="activeTab === tab"
          :text="tab"
          :count="counts[tab]"
          :show-active-check="false"
          class="capitalize"
          @click="() => switchToTab(tab)" />
        <div class="flex mt-4 flex-wrap">
          <ChainDropdown class="mr-4" />
          <OrderByDropdown v-if="activeTab !== ProfileTab.ACTIVITY" />
        </div>
      </div>
    </div>

    <div class="container is-fluid pb-6">
      <div
        v-if="[ProfileTab.OWNED, ProfileTab.CREATED].includes(activeTab)"
        class="flex-grow">
        <div class="flex justify-between pb-4 pt-5 content-center">
          <div class="flex">
            <FilterButton
              :label="$t('sort.listed')"
              url-param="buy_now"
              data-testid="profile-filter-button-buynow" />
            <FilterButton
              v-if="activeTab === 'created'"
              :label="$t('activity.sold')"
              url-param="sold"
              class="ml-4" />

            <CollectionFilter
              :id="id.toString()"
              v-model="collections"
              :search="itemsGridSearch"
              :tab-key="tabKey"
              class="ml-4" />
          </div>
          <div class="is-hidden-mobile">
            <GridLayoutControls
              class="is-hidden-mobile"
              :section="gridSection" />
          </div>
        </div>
        <hr class="my-0" />
        <ItemsGrid
          :search="itemsGridSearch"
          :grid-section="gridSection"
          :reset-search-query-params="['sort']">
          <template v-if="hasAssetPrefixMap[activeTab].length" #empty-result>
            <ProfileEmptyResult
              :has-asset-prefix-list="hasAssetPrefixMap[activeTab]" />
          </template>
        </ItemsGrid>
      </div>

      <CollectionGrid
        v-if="activeTab === ProfileTab.COLLECTIONS"
        :id="id"
        class="pt-7">
        <template v-if="hasAssetPrefixMap[activeTab].length" #empty-result>
          <ProfileEmptyResult
            :has-asset-prefix-list="
              hasAssetPrefixMap[ProfileTab.COLLECTIONS]
            " />
        </template>
      </CollectionGrid>

      <Activity v-if="activeTab === ProfileTab.ACTIVITY" :id="id" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getExplorer, hasExplorer } from '@kodadot1/static'
import { NeoButton, NeoModal } from '@kodadot1/brick'
import TabItem from '@/components/shared/TabItem.vue'
import Identity from '@/components/identity/IdentityIndex.vue'
import ItemsGrid from '@/components/items/ItemsGrid/ItemsGrid.vue'
import ProfileActivity from './ProfileActivitySummery.vue'
import FilterButton from './FilterButton.vue'
import ChainDropdown from '@/components/common/ChainDropdown.vue'
import OrderByDropdown from './OrderByDropdown.vue'
import CollectionGrid from '@/components/collection/CollectionGrid.vue'
import Activity from './activityTab/Activity.vue'
import Avatar from '@/components/shared/Avatar.vue'
import { resolveComponent } from 'vue'
import { useListingCartStore } from '@/stores/listingCart'
import resolveQueryPath from '@/utils/queryPathResolver'
import { chainsWithMintInteraction } from '@/composables/collectionActivity/helpers'
import { Interaction } from '@kodadot1/minimark/v1'
import CollectionFilter from './CollectionFilter.vue'
import GridLayoutControls from '@/components/shared/GridLayoutControls.vue'
import ProfileEmptyResult from '@/components/profile/ProfileEmptyResult.vue'
import { CHAINS, type Prefix } from '@kodadot1/static'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'

enum ProfileTab {
  OWNED = 'owned',
  CREATED = 'created',
  COLLECTIONS = 'collections',
  ACTIVITY = 'activity',
}

const gridSection = GridSection.PROFILE_GALLERY
const NuxtLink = resolveComponent('NuxtLink')

const route = useRoute()
const { toast } = useToast()
const { replaceUrl } = useReplaceUrl()
const { accountId } = useAuth()
const { urlPrefix, client } = usePrefix()
const { isRemark } = useIsChain(urlPrefix)
const listingCartStore = useListingCartStore()

const tabs = [
  ProfileTab.OWNED,
  ProfileTab.CREATED,
  ProfileTab.COLLECTIONS,
  ProfileTab.ACTIVITY,
]

const switchToTab = (tab: ProfileTab) => {
  activeTab.value = tab
}

const counts = ref({})

const hasAssetPrefixMap = ref<Partial<Record<ProfileTab, Prefix[]>>>({})

const id = computed(() => route.params.id || '')
const email = ref('')
const twitter = ref('')
const displayName = ref('')
const web = ref('')
const legal = ref('')
const riot = ref('')
const isModalActive = ref(false)

const tabKey = computed(() =>
  activeTab.value === ProfileTab.OWNED ? 'currentOwner_eq' : 'issuer_eq',
)

const collections = ref(
  route.query.collections?.toString().split(',').filter(Boolean) || [],
)

const itemsGridSearch = computed(() => {
  const query: Record<string, unknown> = {
    [tabKey.value]: id.value,
    burned_eq: false,
  }

  if (listed.value) {
    query['price_gt'] = 0
  }

  if (addSold.value) {
    query['events_some'] = {
      interaction_eq: 'BUY',
      AND: { caller_not_eq: id.value },
    }
  }

  if (collections.value?.length) {
    query['collection'] = {
      id_in: collections.value,
    }
  }

  return query
})

const realworldFullPath = computed(() => window.location.href)

const activeTab = computed({
  get: () => (route.query.tab as ProfileTab) || ProfileTab.OWNED,
  set: (val) => {
    replaceUrl({ tab: val })
  },
})

const listed = computed(() => route.query.buy_now === 'true')

const sold = computed(() => route.query.sold === 'true')
const addSold = computed(
  () => activeTab.value === ProfileTab.CREATED && sold.value,
)

const isMyProfile = computed(() => id.value === accountId.value)
const hasBlockExplorer = computed(() => hasExplorer(urlPrefix.value))
const explorer = computed(() => getExplorer(urlPrefix.value, id.value))

const isAllowSetIdentity = computed(() => {
  return !displayName.value && isMyProfile.value && hasBlockExplorer.value
})

const handleIdentity = (identityFields: Record<string, string>) => {
  displayName.value = identityFields?.display
  email.value = identityFields?.email
  twitter.value = identityFields?.twitter
  riot.value = identityFields?.riot
  web.value = identityFields?.web
  legal.value = identityFields?.legal
}

const interactionIn = computed(() => {
  const interactions = [Interaction.LIST, Interaction.SEND, Interaction.BUY]

  if (!chainsWithMintInteraction.includes(urlPrefix.value)) {
    interactions.push(Interaction.MINTNFT)
  }

  return interactions
})

useAsyncData('tabs-count', async () => {
  const searchParams = {
    currentOwner_eq: id.value.toString(),
  }

  if (!isRemark.value) {
    searchParams['burned_eq'] = false
  }

  const query = await resolveQueryPath(client.value, 'profileTabsCount')
  const { data } = await useAsyncQuery({
    query: query.default,
    clientId: client.value,
    variables: {
      id: id.value,
      interactionIn: interactionIn.value,
      denyList: getDenyList(urlPrefix.value),
      search: [searchParams],
    },
  })

  if (!data.value) {
    return
  }

  counts.value = {
    [ProfileTab.OWNED]: data.value?.owned.totalCount,
    [ProfileTab.CREATED]: data.value?.created.totalCount,
    [ProfileTab.ACTIVITY]: data.value?.events.totalCount,
    [ProfileTab.COLLECTIONS]: data.value?.collections.totalCount,
  }
})

const fetchTabsCount = async (chain: Prefix) => {
  const account = id.value.toString()

  const chainData = CHAINS[chain]

  const publicKey = decodeAddress(account)
  const prefixAddress = encodeAddress(publicKey, chainData.ss58Format)
  const searchParams = {
    currentOwner_eq: prefixAddress,
  }
  const { isRemark } = useIsChain(computed(() => chain))

  if (!isRemark.value) {
    searchParams['burned_eq'] = false
  }

  const query = await resolveQueryPath(chain, 'profileTabsCount')
  const { data } = await useAsyncQuery({
    query: query.default,
    clientId: chain,
    variables: {
      id: prefixAddress,
      interactionIn: [],
      denyList: getDenyList(urlPrefix.value),
      search: [searchParams],
    },
  })
  if (!data.value) {
    return
  }

  updateEmptyResultTab(ProfileTab.OWNED, data.value?.owned?.totalCount, chain)
  updateEmptyResultTab(
    ProfileTab.CREATED,
    data.value?.created?.totalCount,
    chain,
  )
  updateEmptyResultTab(
    ProfileTab.COLLECTIONS,
    data.value?.collections?.totalCount,
    chain,
  )
}

useAsyncData('tabs-empty-result', async () => {
  hasAssetPrefixMap.value = {
    [ProfileTab.OWNED]: [],
    [ProfileTab.CREATED]: [],
    [ProfileTab.COLLECTIONS]: [],
  }

  for (const chain of ['ahp', 'ahk', 'ksm', 'rmrk']) {
    await fetchTabsCount(chain as Prefix)
  }
})

const updateEmptyResultTab = (
  tab: ProfileTab,
  count: number,
  prefix: Prefix,
) => {
  if (count && hasAssetPrefixMap.value[tab]) {
    hasAssetPrefixMap.value[tab]!.push(prefix)
  }
}

watch(itemsGridSearch, (searchTerm, prevSearchTerm) => {
  if (JSON.stringify(searchTerm) !== JSON.stringify(prevSearchTerm)) {
    listingCartStore.clear()
  }
})

watch(collections, (value) => {
  replaceUrl({
    collections: value.length ? value.toString() : undefined,
  })
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.invisible-tab > nav.tabs {
  display: none;
}

:deep(.control) {
  width: 12rem;
}
:deep(.explore-tabs-button) {
  width: 12rem;
}

@include until-widescreen {
  .mobile {
    flex-wrap: wrap;
    > * {
      flex: 1 0 50%;
      &:nth-child(2) {
        :deep(.explore-tabs-button) {
          border-right: solid;
        }
      }
      &:nth-child(1),
      &:nth-child(2) {
        :deep(.explore-tabs-button) {
          border-bottom: none;
        }
      }
      &:nth-child(2n + 1) {
        :deep(.explore-tabs-button) {
          border-right: none;
        }
      }
    }
    :deep(.explore-tabs-button) {
      width: 100% !important;
    }
  }
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
