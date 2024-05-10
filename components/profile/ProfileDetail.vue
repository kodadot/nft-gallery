<template>
  <div>
    <ProfileCreateModal v-model="isModalActive" @success="fetchProfile" />
    <ProfileFollowModal
      :key="`${followersCount}-${followingCount}`"
      v-model="isFollowModalActive"
      :initial-tab="followModalTab"
      :followers-count="followersCount"
      :following-count="followingCount"
      @close="refresh" />
    <div
      class="bg-no-repeat bg-cover bg-center h-[360px] border-b bg-neutral-3 dark:bg-neutral-11"
      :style="{
        backgroundImage: userProfile?.banner
          ? `url(${userProfile.banner})`
          : undefined,
      }">
      <div
        class="collection-banner-content flex items-end h-full pb-7 max-sm:mx-5 mx-12 2xl:mx-auto max-w-[89rem]">
        <div
          class="!rounded-full overflow-hidden p-2.5 bg-background-color border">
          <BaseMediaItem
            v-if="userProfile?.image"
            :src="userProfile.image"
            :image-component="NuxtImg"
            :title="'User Avatar'"
            class="w-[124px] h-[124px] object-cover rounded-full" />
          <Avatar v-else :value="id" :size="124" class="mb-[-7px]" />
        </div>
      </div>
    </div>
    <div
      class="pt-6 pb-7 max-sm:mx-5 mx-12 2xl:mx-auto flex justify-between border-b border-neutral-5 dark:border-neutral-9 max-w-[89rem]">
      <div class="flex flex-col gap-6">
        <!-- Identity Link -->
        <h1 class="title is-3 mb-0" data-testid="profile-user-identity">
          <span v-if="userProfile?.name">{{ userProfile.name }}</span>
          <Identity
            v-else
            ref="identity"
            hide-identity-popover
            :address="id"
            emit
            @change="handleIdentity" />
        </h1>

        <!-- Buttons and Dropdowns -->
        <div class="flex gap-3 max-sm:flex-wrap">
          <div class="flex gap-3 flex-wrap xs:flex-nowrap">
            <NeoButton
              ref="buttonRef"
              rounded
              no-shadow
              class="min-w-28"
              data-testid="profile-button-multi-action"
              :class="buttonConfig.classes"
              :variant="buttonConfig.variant"
              :active="buttonConfig.active"
              :disabled="buttonConfig.disabled"
              @click="buttonConfig.onClick">
              <NeoIcon
                v-if="buttonConfig.icon"
                :icon="buttonConfig.icon"
                class="mr-1" />
              {{ buttonConfig.label }}
            </NeoButton>
            <!-- Wallet And Links Dropdown -->
            <NeoDropdown position="bottom-left">
              <template #trigger="{ active }">
                <NeoButton
                  variant="outlined-rounded"
                  data-testid="profile-wallet-links-button"
                  :active="active"
                  :icon-right="active ? 'chevron-up' : 'chevron-down'">
                  {{ $t('profile.walletAndLinks') }}
                </NeoButton>
              </template>
              <NeoDropdownItem
                class="hover:!bg-transparent hover:!cursor-default">
                <div class="flex flex-col gap-4 py-2.5">
                  <!-- Copy Address -->
                  <div class="flex items-center">
                    <Identity
                      hide-identity-popover
                      hide-display-name
                      :address="id"
                      show-onchain-identity
                      class="bg-neutral-3 dark:bg-neutral-9 text-base rounded-2xl text-center px-2" />
                    <NeoButton
                      v-clipboard:copy="id"
                      variant="text"
                      no-shadow
                      icon="copy"
                      data-testid="profile-wallet-links-button-copy"
                      :icon-pack="'fas'"
                      class="ml-2.5"
                      @click="toast('Copied to clipboard')" />
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
                      rel="nofollow noopener noreferrer" />
                    <span class="w-px h-1.5 bg-k-shade mx-2"></span>
                    <NeoButton
                      v-safe-href="`https://sub.id/#/${id}`"
                      no-shadow
                      variant="text"
                      class="text-xs"
                      :label="$t('profile.subId')"
                      tag="a"
                      target="_blank"
                      rel="nofollow noopener noreferrer" />
                  </div>
                  <!-- Transfer Button -->
                  <NeoButton
                    variant="outlined-rounded"
                    class="!w-full text-xs"
                    data-testid="profile-wallet-links-button-transfer"
                    :label="`${$t('transfer')} $`"
                    :tag="NuxtLink"
                    :to="`/${urlPrefix}/transfer?target=${id}`">
                  </NeoButton>
                </div>
              </NeoDropdownItem>
              <NeoDropdownItem
                v-for="(item, index) in socialDropdownItems"
                :key="index">
                <a
                  v-safe-href="item?.url"
                  target="_blank"
                  class="flex items-center w-full text-left hover:!text-text-color"
                  rel="noopener noreferrer">
                  <NeoIcon
                    v-if="typeof item?.icon === 'string'"
                    :class="'mr-2.5'"
                    :icon="item?.icon"
                    :pack="item?.iconPack" />
                  <component :is="item?.icon" v-else class="mr-2.5" />
                  <span>{{ item?.label }}</span>
                </a>
              </NeoDropdownItem>
            </NeoDropdown>
          </div>
          <!-- Share Dropdown -->
          <NeoDropdown>
            <template #trigger="{ active }">
              <NeoButton
                variant="outlined-rounded"
                icon="arrow-up-from-bracket"
                :active="active">
              </NeoButton>
            </template>

            <NeoDropdownItem
              v-clipboard:copy="shareURL"
              @click="toast(String($t('toast.urlCopy')))">
              <div class="flex text-nowrap w-max items-center">
                <NeoIcon icon="copy" pack="fas" class="mr-3" />
                {{ $t('share.copyLink') }}
              </div>
            </NeoDropdownItem>

            <NeoDropdownItem
              @click="shareOnX($i18n.t('sharing.profile'), shareURL, '')">
              <div class="flex text-nowrap w-max items-center">
                <NeoIcon icon="x-twitter" pack="fab" class="mr-3" />
                {{ $t('share.twitter') }}
              </div>
            </NeoDropdownItem>
            <NeoDropdownItem
              @click="shareOnFarcaster($i18n.t('sharing.profile'), [shareURL])">
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
          class="max-w-lg whitespace-break-spaces text-sm">
          <Markdown
            :source="userProfile.description"
            data-testid="profile-description" />
        </div>
        <!-- Followers -->
        <div>
          <span
            v-if="isOwner || !hasProfile || followersCount == 0"
            class="text-sm text-k-grey">
            {{ $t('profile.notFollowed') }}
          </span>
          <div v-else class="flex gap-4 items-center">
            <span class="text-sm text-k-grey">
              {{ $t('profile.followedBy') }}:
            </span>
            <div class="flex -space-x-3">
              <NuxtLink
                v-for="(follower, index) in followers?.followers"
                :key="index"
                :to="`/${urlPrefix}/u/${formatAddress(follower.address, chainProperties.ss58Format)}`">
                <NuxtImg
                  :src="follower.image"
                  alt="follower avatar"
                  class="w-8 h-8 rounded-full border object-cover"
                  :style="{ zIndex: 3 - index }" />
              </NuxtLink>
            </div>
            <span v-if="followersCount > 3" class="text-sm">
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
        class="pt-4 invisible md:visible w-60"
        :followers-count="followersCount"
        :following-count="followingCount"
        @click-followers="onFollowersClick"
        @click-following="onFollowingClick" />
    </div>
    <div
      class="visible md:invisible py-7 md:!py-0 md:h-0 border-b border-neutral-5 dark:border-neutral-9 max-sm:mx-5 mx-12">
      <ProfileActivity
        :profile-data="userProfile"
        class="w-full"
        :followers-count="followersCount"
        :following-count="followingCount"
        @click-followers="onFollowersClick"
        @click-following="onFollowingClick" />
    </div>
    <div class="pb-8">
      <div class="max-sm:mx-5 mx-12 2xl:mx-auto max-w-[89rem] py-7">
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
      <hr class="my-0 !bg-background-color-inverse" />
      <div class="max-sm:mx-5 mx-12 2xl:mx-auto max-w-[89rem] pb-6">
        <div
          v-if="[ProfileTab.OWNED, ProfileTab.CREATED].includes(activeTab)"
          class="flex-grow">
          <div class="flex justify-between pb-4 pt-5 content-center">
            <div class="flex">
              <FilterButton
                :label="$t('sort.listed')"
                variant="outlined-rounded"
                url-param="buy_now"
                data-testid="profile-filter-button-buynow" />
              <FilterButton
                v-if="activeTab === 'created'"
                :label="$t('activity.sold')"
                variant="outlined-rounded"
                url-param="sold"
                class="ml-4" />
              <CollectionFilter
                :id="id.toString()"
                v-model="collections"
                variant="outlined-rounded"
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
            display-name-with-sn
            :loading-other-network="loadingOtherNetwork"
            :reset-search-query-params="['sort']">
            <template
              v-if="hasAssetPrefixMap[activeTab].length && !listed && !addSold"
              #empty-result>
              <ProfileEmptyResult
                :prefix-list-with-asset="hasAssetPrefixMap[activeTab]" />
            </template>
          </ItemsGrid>
        </div>
        <CollectionGrid
          v-if="activeTab === ProfileTab.COLLECTIONS"
          :id="id"
          :loading-other-network="loadingOtherNetwork"
          class="pt-7">
          <template v-if="hasAssetPrefixMap[activeTab].length" #empty-result>
            <ProfileEmptyResult
              :prefix-list-with-asset="
                hasAssetPrefixMap[ProfileTab.COLLECTIONS]
              " />
          </template>
        </CollectionGrid>
        <Activity v-if="activeTab === ProfileTab.ACTIVITY" :id="id" />
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
import TabItem from '@/components/shared/TabItem.vue'
import Identity from '@/components/identity/IdentityIndex.vue'
import ItemsGrid from '@/components/items/ItemsGrid/ItemsGrid.vue'
import ProfileActivity from './ProfileActivitySummery.vue'
import Avatar from '@/components/shared/Avatar.vue'
import FilterButton from './FilterButton.vue'
import ChainDropdown from '@/components/common/ChainDropdown.vue'
import OrderByDropdown from './OrderByDropdown.vue'
import CollectionGrid from '@/components/collection/CollectionGrid.vue'
import Activity from './activityTab/Activity.vue'
import { resolveComponent } from 'vue'
import { useListingCartStore } from '@/stores/listingCart'
import resolveQueryPath from '@/utils/queryPathResolver'
import { chainsWithMintInteraction } from '@/composables/collectionActivity/helpers'
import { Interaction } from '@kodadot1/minimark/v1'
import CollectionFilter from './CollectionFilter.vue'
import GridLayoutControls from '@/components/shared/GridLayoutControls.vue'
import { CHAINS, type Prefix } from '@kodadot1/static'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import {
  fetchFollowersOf,
  fetchFollowing,
  follow,
  isFollowing,
  unfollow,
} from '@/services/profile'
import { removeHttpFromUrl } from '@/utils/url'
import { ButtonConfig, ProfileTab } from './types'

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

const tabs = [
  ProfileTab.OWNED,
  ProfileTab.CREATED,
  ProfileTab.COLLECTIONS,
  ProfileTab.ACTIVITY,
]

const route = useRoute()
const { $i18n } = useNuxtApp()
const { toast } = useToast()
const { replaceUrl } = useReplaceUrl()
const { accountId } = useAuth()
const { urlPrefix, client } = usePrefix()
const { shareOnX, shareOnFarcaster } = useSocialShare()
const { isRemark } = useIsChain(urlPrefix)
const listingCartStore = useListingCartStore()
const { chainProperties } = useChain()

const { hasProfile, userProfile, fetchProfile } = useProfile()

provide('userProfile', { hasProfile, userProfile })

const { data: isFollowingThisAccount, refresh: refreshFollowingStatus } =
  useAsyncData(`${accountId.value}/isFollowing/${route.params?.id}`, () =>
    isFollowing(accountId.value, route.params?.id as string),
  )

const { data: followers, refresh: refreshFollowers } = await useAsyncData(
  'followers',
  () => fetchFollowersOf(route.params.id as string, 3),
)

const { data: following, refresh: refreshFollowing } = await useAsyncData(
  'following',
  () => fetchFollowing(route.params.id as string, 1),
)

const refresh = () => {
  refreshFollowers()
  refreshFollowing()
  refreshFollowingStatus()
}
const followersCount = computed(() => followers.value?.totalCount ?? 0)
const followingCount = computed(() => following.value?.totalCount ?? 0)

const editProfileConfig: ButtonConfig = {
  label: $i18n.t('profile.editProfile'),
  icon: 'pen',
  onClick: () => (isModalActive.value = true),
  classes: 'hover:!bg-transparent',
}

const createProfileConfig: ButtonConfig = {
  label: $i18n.t('profile.createProfile'),
  icon: 'sparkles',
  onClick: () => (isModalActive.value = true),
  variant: 'k-accent',
}

const followConfig: ButtonConfig = {
  label: $i18n.t('profile.follow'),
  icon: 'plus',
  disabled: !hasProfile.value,
  onClick: async () => {
    await follow({
      initiatorAddress: accountId.value,
      targetAddress: id.value as string,
    })
    refresh()
    showFollowing.value = isFollowingThisAccount.value || false
  },
  classes: 'hover:!bg-transparent',
}

const followingConfig: ButtonConfig = {
  label: $i18n.t('profile.following'),
}

const unfollowConfig: ButtonConfig = {
  label: $i18n.t('profile.unfollow'),
  onClick: () => {
    unfollow({
      initiatorAddress: accountId.value,
      targetAddress: id.value as string,
    }).then(refresh)
  },
  classes: 'hover:!border-k-red',
}

const buttonRef = ref(null)
const showFollowing = ref(false)
const counts = ref({})
const hasAssetPrefixMap = ref<Partial<Record<ProfileTab, Prefix[]>>>({})
const loadingOtherNetwork = ref(false)
const id = computed(() => route.params.id || '')
const email = ref('')
const twitter = ref('')
const displayName = ref('')
const web = ref('')
const legal = ref('')
const riot = ref('')
const isModalActive = ref(false)
const isFollowModalActive = ref(false)
const followModalTab = ref<'followers' | 'following'>('followers')
const collections = ref(
  route.query.collections?.toString().split(',').filter(Boolean) || [],
)

const isHovered = useElementHover(buttonRef)
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

const isOwner = computed(() => route.params.id === accountId.value)

const buttonConfig = computed((): ButtonConfig => {
  if (isOwner.value) {
    return hasProfile.value ? editProfileConfig : createProfileConfig
  }
  if (
    showFollowing.value ||
    (!isHovered.value && isFollowingThisAccount.value)
  ) {
    return { ...followingConfig, active: isHovered.value }
  }
  return isFollowingThisAccount.value ? unfollowConfig : followConfig
})

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
  const address = id.value.toString()
  const searchParams = {
    currentOwner_eq: address,
  }

  if (accountId.value !== address) {
    Object.assign(searchParams, { nftCount_not_eq: 0 })
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

const fetchTabsCountByNetwork = async (chain: Prefix) => {
  const account = id.value.toString()
  const publicKey = decodeAddress(account)
  const prefixAddress = encodeAddress(publicKey, CHAINS[chain].ss58Format)
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
  loadingOtherNetwork.value = true
  for (const chain of ['ahp', 'ahk', 'ksm', 'rmrk']) {
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

watch(isHovered, (newHover, oldHover) => {
  const curserExited = newHover === false && oldHover === true
  if (curserExited) {
    showFollowing.value = false
  }
})

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

:deep(.rounded-full) {
  img {
    border-radius: 9999px !important;
  }
}

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
</style>
