<template>
  <div>
    <ProfileFollowModal
      :key="`${followersCount}-${followingCount}`"
      v-model="isFollowModalActive"
      :initial-tab="followModalTab"
      :followers-count="followersCount"
      :following-count="followingCount"
      @close="refresh"
    />

    <ProfileBannerSkeleton v-if="isFetchingProfile" />

    <div
      v-else
      class="bg-no-repeat bg-cover bg-center md:h-[360px] h-40 border-b bg-neutral-3 dark:bg-neutral-11"
      :style="{
        backgroundImage:
          userProfile?.banner
            ? `url(${getHigherResolutionCloudflareImage(userProfile.banner)})`
            : undefined,
      }"
    >
      <div
        class="collection-banner-content flex md:items-end items-center h-full md:pb-10 max-sm:mx-5 mx-12 2xl:mx-auto max-w-[89rem]"
      >
        <div class="!rounded-full overflow-hidden p-2.5 bg-background-color border aspect-square">
          <BaseMediaItem
            v-if="userProfile?.image"
            :src="userProfile.image"
            :image-component="NuxtImg"
            :title="'User Avatar'"
            class="md:w-[124px] md:h-[124px] h-[78px] w-[78px] object-cover rounded-full"
            inner-class="object-cover"
          />
          <div
            v-else
            class="mb-[-7px]"
          >
            <Avatar
              :value="id"
              :size="78"
              class="md:hidden"
            />
            <Avatar
              :value="id"
              :size="124"
              class="max-md:hidden"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="pt-6 pb-7 max-sm:mx-5 mx-12 2xl:mx-auto flex justify-between max-w-[89rem]"
    >
      <ProfileSkeleton v-if="isFetchingProfile" />

      <div
        v-else
        class="flex flex-col gap-6"
      >
        <!-- Identity Link -->
        <h1
          class="font-bold text-2xl md:text-[31px] mb-0"
          data-testid="profile-user-identity"
        >
          <span v-if="userProfile?.name">{{ userProfile.name }}</span>
          <Identity
            v-else
            ref="identity"
            hide-identity-popover
            :address="id"
            emit
            @change="handleIdentity"
          />
        </h1>

        <!-- Buttons and Dropdowns -->
        <div class="flex gap-3 flex-wrap">
          <ProfileButtonConfig
            v-if="isOwner"
            :button="buttonConfig"
            test-id="profile-button-multi-action"
          />
          <ProfileFollowButton
            v-else
            ref="followButton"
            :target="id"
            @follow:success="handleFollowRefresh"
            @follow:fail="openProfileCreateModal"
            @unfollow:success="handleFollowRefresh"
          />

          <!-- Wallet And Links Dropdown -->
          <NeoDropdown position="bottom-auto">
            <template #trigger="{ active }">
              <NeoButton
                variant="outlined-rounded"
                data-testid="profile-wallet-links-button"
                :active="active"
                :icon-right="active ? 'chevron-up' : 'chevron-down'"
              >
                {{ $t('profile.walletAndLinks') }}
              </NeoButton>
            </template>
            <NeoDropdownItem class="hover:!bg-transparent hover:!cursor-default">
              <div class="flex flex-col gap-4 py-2.5">
                <!-- Copy Address -->
                <div class="flex items-center">
                  <Identity
                    hide-identity-popover
                    hide-display-name
                    :address="id"
                    show-onchain-identity
                    class="bg-neutral-3 dark:bg-neutral-9 text-base rounded-2xl text-center px-2"
                  />
                  <NeoButton
                    v-clipboard:copy="id"
                    variant="text"
                    no-shadow
                    icon="copy"
                    data-testid="profile-wallet-links-button-copy"
                    :icon-pack="'fas'"
                    class="ml-2.5"
                    @click="toast($t('general.copyAddressToClipboard'))"
                  />
                </div>
                <!-- View on Subscan and SubID -->
                <div class="flex items-center">
                  <NeoButton
                    v-safe-href="`https://subscan.io/account/${id}`"
                    no-shadow
                    variant="text"
                    class="text-xs"
                    :label="$t('profile.subscan')"
                    tag="a"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  />
                  <span class="w-px h-1.5 bg-k-shade mx-2" />
                  <NeoButton
                    v-safe-href="`https://sub.id/#/${id}`"
                    no-shadow
                    variant="text"
                    class="text-xs"
                    :label="$t('profile.subId')"
                    tag="a"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  />
                </div>
                <!-- Transfer Button -->
                <NeoButton
                  variant="outlined-rounded"
                  class="!w-full text-xs"
                  data-testid="profile-wallet-links-button-transfer"
                  :label="`${$t('transfer')} $`"
                  :tag="NuxtLink"
                  :to="`/${urlPrefix}/transfer?target=${id}`"
                />
              </div>
            </NeoDropdownItem>
            <NeoDropdownItem
              v-for="(item, index) in socialDropdownItems"
              :key="index"
            >
              <a
                v-safe-href="item?.url"
                target="_blank"
                class="flex items-center w-full text-left hover:!text-text-color"
                rel="noopener noreferrer"
              >
                <NeoIcon
                  v-if="typeof item?.icon === 'string'"
                  :class="'mr-2.5'"
                  :icon="item?.icon"
                  :pack="item?.iconPack"
                />
                <component
                  :is="item?.icon"
                  v-else
                  class="mr-2.5"
                />
                <span>{{ item?.label }}</span>
              </a>
            </NeoDropdownItem>
          </NeoDropdown>

          <!-- Share Dropdown -->
          <NeoDropdown>
            <template #trigger="{ active }">
              <NeoButton
                variant="outlined-rounded"
                icon="arrow-up-from-bracket"
                :active="active"
              />
            </template>

            <NeoDropdownItem
              v-clipboard:copy="shareURL"
              @click="toast(String($t('toast.urlCopy')))"
            >
              <div class="flex text-nowrap w-max items-center">
                <NeoIcon
                  icon="copy"
                  pack="fas"
                  class="mr-3"
                />
                {{ $t('share.copyLink') }}
              </div>
            </NeoDropdownItem>

            <NeoDropdownItem @click="shareOnX($i18n.t('sharing.profile'), shareURL, '')">
              <div class="flex text-nowrap w-max items-center">
                <NeoIcon
                  icon="x-twitter"
                  pack="fab"
                  class="mr-3"
                />
                {{ $t('share.twitter') }}
              </div>
            </NeoDropdownItem>
            <NeoDropdownItem @click="shareOnFarcaster($i18n.t('sharing.profile'), [shareURL])">
              <div class="flex text-nowrap w-max items-center">
                <FarcasterIcon class="mr-3" />
                {{ $t('share.farcaster') }}
              </div>
            </NeoDropdownItem>
          </NeoDropdown>
        </div>
        <!-- Profile Description -->
        <div
          v-if="userProfile?.description"
          class="max-w-lg whitespace-break-spaces text-sm"
        >
          <Markdown
            :source="userProfile.description"
            data-testid="profile-description"
          />
        </div>
        <!-- Followers -->
        <div v-if="!isOwner">
          <span
            v-if="!hasProfile || followersCount == 0"
            class="text-sm text-k-grey"
          >
            {{ $t('profile.notFollowed') }}
          </span>
          <div
            v-else
            class="flex gap-4 items-center followed-by"
          >
            <span class="text-sm text-k-grey">
              {{ $t('profile.followedBy') }}:
            </span>
            <NeoButton
              variant="text"
              no-shadow
              @click="onFollowersClick"
            >
              <div class="flex -space-x-3">
                <div
                  v-for="(follower, index) in followers?.followers"
                  :key="index"
                  class="flex"
                  :style="{ zIndex: 3 - index }"
                >
                  <ProfileAvatar
                    class="border"
                    :profile-image="follower.image"
                    :address="follower.address"
                    :size="30"
                  />
                </div>
              </div>
            </NeoButton>

            <span
              v-if="followersCount > 3"
              class="text-sm"
            >
              +
              {{ followersCount - (followers?.followers?.length ?? 0) }}
              More
            </span>
          </div>
        </div>
      </div>
      <!-- Mobile Profile Activity -->
      <ProfileActivity
        :profile-data="userProfile"
        class="pt-4 max-md:hidden w-60"
        :followers-count="followersCount"
        :following-count="followingCount"
        @click-followers="onFollowersClick"
        @click-following="onFollowingClick"
      />
    </div>

    <ProfileCuratedDrops :id="$route.params.id" />

    <div
      class="visible md:invisible py-7 md:!py-0 md:h-0 border-b border-neutral-5 dark:border-neutral-9 max-sm:mx-5 mx-12"
    >
      <ProfileActivity
        :profile-data="userProfile"
        class="w-full"
        :followers-count="followersCount"
        :following-count="followingCount"
        @click-followers="onFollowersClick"
        @click-following="onFollowingClick"
      />
    </div>

    <div class="pb-8">
      <div class="max-sm:mx-5 mx-12 2xl:mx-auto max-w-[89rem] py-7">
        <div class="flex is-hidden-touch is-hidden-desktop-only">
          <TabItem
            v-for="tab in tabs"
            :key="tab"
            class="capitalize"
            :data-testid="`profile-${tab}-tab`"
            :active="activeTab === tab"
            :count="counts[tab]"
            :show-active-check="tabsWithActiveCheck.includes(tab)"
            :text="tab"
            @click="() => switchToTab(tab)"
          />
          <ChainDropdown class="ml-6" />
          <OrderByDropdown
            v-if="activeTab !== ProfileTab.ACTIVITY"
            class="ml-6"
          />
        </div>
        <div class="flex flex-col gap-4 is-hidden-widescreen mobile">
          <div class="flex flex-wrap">
            <TabItem
              v-for="tab in tabs"
              :key="tab"
              :active="activeTab === tab"
              :text="tab"
              :count="counts[tab]"
              :show-active-check="tabsWithActiveCheck.includes(tab)"
              class="capitalize !w-[50%]"
              @click="() => switchToTab(tab)"
            />
          </div>
          <div class="flex flex-wrap gap-4">
            <ChainDropdown />
            <OrderByDropdown v-if="activeTab !== ProfileTab.ACTIVITY" />
          </div>
        </div>
      </div>
      <hr class="my-0 !bg-background-color-inverse">
      <div class="max-sm:mx-5 mx-12 2xl:mx-auto max-w-[89rem] pb-6">
        <div
          v-if="[ProfileTab.OWNED, ProfileTab.CREATED].includes(activeTab)"
          class="flex-grow"
        >
          <div class="flex justify-between pb-4 pt-5 content-center">
            <div class="flex">
              <FilterButton
                :label="$t('sort.listed')"
                variant="outlined-rounded"
                url-param="buy_now"
                data-testid="profile-filter-button-buynow"
              />
              <FilterButton
                v-if="activeTab === 'created'"
                :label="$t('activity.sold')"
                variant="outlined-rounded"
                url-param="sold"
                class="ml-4"
              />
              <CollectionFilter
                :id="id.toString()"
                v-model="collections"
                variant="outlined-rounded"
                :search="itemsGridSearch"
                :tab-key="tabKey"
                class="ml-4"
              />
            </div>
            <div class="is-hidden-mobile">
              <GridLayoutControls
                class="is-hidden-mobile"
                :section="gridSection"
              />
            </div>
          </div>
          <hr class="my-0">
          <ItemsGrid
            :search="itemsGridSearch"
            :grid-section="gridSection"
            :loading-other-network="loadingOtherNetwork"
            :reset-search-query-params="['sort']"
          >
            <template
              v-if="hasAssetPrefixMap[activeTab]?.length && !listed && !addSold"
              #empty-result
            >
              <ProfileEmptyResult :prefix-list-with-asset="hasAssetPrefixMap[activeTab]" />
            </template>
          </ItemsGrid>
        </div>
        <CollectionGrid
          v-if="activeTab === ProfileTab.COLLECTIONS"
          :id="id"
          :loading-other-network="loadingOtherNetwork"
          class="pt-7"
        >
          <template
            v-if="hasAssetPrefixMap[activeTab]?.length"
            #empty-result
          >
            <ProfileEmptyResult
              :prefix-list-with-asset="hasAssetPrefixMap[ProfileTab.COLLECTIONS]
              "
            />
          </template>
        </CollectionGrid>
        <Activity
          v-if="activeTab === ProfileTab.ACTIVITY"
          :id="id"
        />
        <ProfileActivityTabOffers
          v-if="activeTab === ProfileTab.OFFERS"
          :id="id"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  NeoButton,
  NeoDropdown,
  NeoDropdownItem,
  NeoIcon,
} from '@kodadot1/brick'
import { resolveComponent } from 'vue'
import { Interaction } from '@kodadot1/minimark/v1'
import type { ChainVM, Prefix } from '@kodadot1/static'
import { CHAINS } from '@kodadot1/static'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import ProfileActivity from './ProfileActivitySummery.vue'
import FilterButton from './FilterButton.vue'
import OrderByDropdown from './OrderByDropdown.vue'
import Activity from './activityTab/Activity.vue'
import CollectionFilter from './CollectionFilter.vue'
import type { ButtonConfig } from './types'
import { ProfileTab } from './types'
import TabItem from '@/components/shared/TabItem.vue'
import Identity from '@/components/identity/IdentityIndex.vue'
import ItemsGrid from '@/components/items/ItemsGrid/ItemsGrid.vue'
import Avatar from '@/components/shared/Avatar.vue'
import ChainDropdown from '@/components/common/ChainDropdown.vue'
import CollectionGrid from '@/components/collection/CollectionGrid.vue'
import { useListingCartStore } from '@/stores/listingCart'
import { chainsWithMintInteraction } from '@/composables/collectionActivity/helpers'
import GridLayoutControls from '@/components/shared/GridLayoutControls.vue'
import { fetchFollowersOf, fetchFollowing } from '@/services/profile'
import { removeHttpFromUrl } from '@/utils/url'
import profileTabsCount from '@/queries/subsquid/general/profileTabsCount.query'
import { openProfileCreateModal } from '@/components/profile/create/openProfileModal'
import { getHigherResolutionCloudflareImage } from '@/utils/ipfs'
import { offerVisible } from '@/utils/config/permission.config'

const NuxtImg = resolveComponent('NuxtImg')
const NuxtLink = resolveComponent('NuxtLink')
const FarcasterIcon = defineAsyncComponent(
  () => import('@/assets/icons/farcaster-icon.svg?component'),
)

const gridSection = GridSection.PROFILE_GALLERY

const socials = {
  [Socials.Farcaster]: {
    icon: FarcasterIcon,
    order: 1,
  },
  [Socials.Twitter]: {
    icon: 'x-twitter',
    iconPack: 'fab',
    order: 2,
  },
  [Socials.Website]: {
    icon: 'globe',
    order: 3,
  },
}

const tabs = computed(() => {
  const tabs = [
    ProfileTab.OWNED,
    ProfileTab.CREATED,
    ProfileTab.COLLECTIONS,
    ProfileTab.ACTIVITY,
  ]

  if (offerVisible(urlPrefix.value)) {
    tabs.push(ProfileTab.OFFERS)
  }

  return tabs
})

const tabsWithActiveCheck = [ProfileTab.OFFERS]

const route = useRoute()
const { $i18n } = useNuxtApp()
const { toast } = useToast()
const { replaceUrl } = useReplaceUrl()
const { accountId, isCurrentOwner } = useAuth()
const { urlPrefix, client, setUrlPrefix } = usePrefix()
const { shareOnX, shareOnFarcaster } = useSocialShare()
const { redirectAfterChainChange } = useChainRedirect()
const profileOnboardingStore = useProfileOnboardingStore()
const { getIsOnboardingShown } = storeToRefs(profileOnboardingStore)

const { isSub } = useIsChain(urlPrefix)
const listingCartStore = useListingCartStore()
const { vm } = useChain()
const { getPrefixByAddress } = useAddress()
const { params } = useRoute()

const { hasProfile, userProfile, isFetchingProfile } = useProfile(computed(() => params?.id as string))

const { data: followers, refresh: refreshFollowers } = useAsyncData(
  `followersof${route.params.id}`,
  () =>
    fetchFollowersOf(route.params.id as string, {
      limit: 3,
    }),
)

const { data: following, refresh: refreshFollowing } = useAsyncData(
  `following${route.params.id}`,
  () => fetchFollowing(route.params.id as string, { limit: 1 }),
)

const refresh = ({ fetchFollowing = true } = {}) => {
  refreshFollowers()
  refreshFollowing()
  fetchFollowing && followButton.value?.refresh()
}
const followersCount = computed(() => followers.value?.totalCount ?? 0)
const followingCount = computed(() => following.value?.totalCount ?? 0)

const editProfileConfig: ButtonConfig = {
  label: $i18n.t('profile.editProfile'),
  icon: 'pen',
  onClick: () => openProfileCreateModal(true),
  classes: 'hover:!bg-transparent',
}

const createProfileConfig: ButtonConfig = {
  label: $i18n.t('profile.createProfile'),
  icon: 'sparkles',
  onClick: () => openProfileCreateModal(true),
  variant: 'primary',
}

const handleFollowRefresh = () => {
  refresh({ fetchFollowing: false })
}

const followButton = ref()
const counts = ref({})
const hasAssetPrefixMap = ref<Partial<Record<ProfileTab, Prefix[]>>>({})
const loadingOtherNetwork = ref(false)
const id = computed(() => route.params.id.toString() || '')
const email = ref('')
const twitter = ref('')
const displayName = ref('')
const web = ref('')
const legal = ref('')
const riot = ref('')
const isFollowModalActive = ref(false)
const followModalTab = ref<'followers' | 'following'>('followers')
const collections = ref(
  route.query.collections?.toString().split(',').filter(Boolean) || [],
)

const shareURL = computed(() => `${window.location.origin}${route.path}`)

const socialDropdownItems = computed(() => {
  return userProfile.value?.socials
    .map(({ handle, platform, link }) => {
      const socialConfig = socials[platform]
      if (socialConfig) {
        const { icon, iconPack, order } = socialConfig
        return {
          label: removeHttpFromUrl(handle || link),
          icon,
          iconPack,
          url: link,
          order,
        }
      }
    })
    .sort((a, b) => a?.order - b?.order)
})

const isOwner = computed(() => isCurrentOwner(id.value))

const buttonConfig = computed<ButtonConfig>(() =>
  hasProfile.value ? editProfileConfig : createProfileConfig,
)

const switchToTab = (tab: ProfileTab) => {
  activeTab.value = tab
}

const onFollowersClick = () => {
  followModalTab.value = 'followers'
  isFollowModalActive.value = true
}

const onFollowingClick = () => {
  followModalTab.value = 'following'
  isFollowModalActive.value = true
}

const tabKey = computed(() =>
  activeTab.value === ProfileTab.OWNED ? 'currentOwner_eq' : 'issuer_eq',
)

const itemsGridSearch = computed(() => {
  const query: Record<string, unknown> = {
    [tabKey.value]: toChainAddres(id.value, urlPrefix.value),
    burned_eq: false,
  }

  if (listed.value) {
    query['price_gt'] = 0
  }

  if (addSold.value) {
    query['events_some'] = {
      interaction_eq: 'BUY',
      AND: { caller_not_eq: toChainAddres(id.value, urlPrefix.value) },
    }
  }

  if (collections.value?.length) {
    query['collection'] = {
      id_in: collections.value,
    }
  }

  return query
})

const activeTab = computed({
  get: () => {
    const tab = route.query.tab as ProfileTab

    if (!tab || !tabs.value.includes(tab)) {
      return ProfileTab.OWNED
    }

    return tab
  },
  set: (val) => {
    replaceUrl({ tab: val })
  },
})

const listed = computed(() => route.query.buy_now === 'true')

const sold = computed(() => route.query.sold === 'true')
const addSold = computed(
  () => activeTab.value === ProfileTab.CREATED && sold.value,
)

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
  const address = toChainAddres(id.value, urlPrefix.value)
  const searchParams = {
    currentOwner_eq: address,
  }

  if (accountId.value !== address) {
    Object.assign(searchParams, { nftCount_not_eq: 0 })
  }

  searchParams['burned_eq'] = false

  const { data } = await useAsyncQuery({
    query: profileTabsCount,
    clientId: client.value,
    variables: {
      id: address,
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

const fetchTabsCountByNetwork = async (chain: Prefix) => {
  const account = toChainAddres(id.value, urlPrefix.value)
  let address = account

  if (isSub.value) {
    const publicKey = decodeAddress(account)
    address = encodeAddress(publicKey, CHAINS[chain].ss58Format)
  }

  const searchParams = {
    currentOwner_eq: address,
  }

  searchParams['burned_eq'] = false

  const { data } = await useAsyncQuery({
    query: profileTabsCount,
    clientId: chain,
    variables: {
      id: address,
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
  const chains = (
    {
      SUB: ['ahp', 'ahk'],
      EVM: ['base', 'imx'],
    } as Record<ChainVM, Prefix[]>
  )[vm.value]

  hasAssetPrefixMap.value = {
    [ProfileTab.OWNED]: [],
    [ProfileTab.CREATED]: [],
    [ProfileTab.COLLECTIONS]: [],
  }

  loadingOtherNetwork.value = true
  for (const chain of chains) {
    await fetchTabsCountByNetwork(chain as Prefix)
  }
  loadingOtherNetwork.value = false
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

watch(() => getPrefixByAddress(route.params.id.toString()), (prefix) => {
  if (prefix !== urlPrefix.value) {
    setUrlPrefix(prefix)
    redirectAfterChainChange(prefix)
  }
}, {
  immediate: true,
})

watchEffect(() => {
  if (!hasProfile.value && !isFetchingProfile.value && isOwner.value && !getIsOnboardingShown.value) {
    profileOnboardingStore.setOnboardingShown()
    openProfileCreateModal()
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

:deep(.rounded-full) {
  img {
    border-radius: 9999px !important;
  }
}

.invisible-tab>nav.tabs {
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

    >* {
      flex: 1 0 50%;

      &:nth-child(2) {
        :deep(.explore-tabs-button) {
          border-right: solid;
        }
      }

      &:nth-child(1),
      &:nth-child(2) {
        :deep(.explore-tabs-button) {
          @apply border-b-0;
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

.followed-by {
  :deep(.o-btn.is-neo:hover) {
    @apply text-text-color;
  }
}
</style>
