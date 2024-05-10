<template>
  <div class="flex items-center justify-between">
    <NuxtLink class="flex" :to="`/${urlPrefix}/u/${user.address}`">
      <NuxtImg
        :src="user.image"
        placholder
        alt="follower avatar"
        class="w-12 h-12 rounded-full border object-cover mr-4" />
      <div class="flex flex-col gap-[6px]">
        <span
          class="text-k-black font-bold truncate max-w-[10rem] max-sm:max-w-[8rem]"
          >{{ user.name }}</span
        >
        <p class="text-sm">
          {{ followersCount }}
          <span class="text-k-grey">{{
            followersCount == 1 ? 'Follower' : 'Followers'
          }}</span>
        </p>
      </div>
    </NuxtLink>
    <NeoButton
      ref="buttonRef"
      rounded
      no-shadow
      class="!min-w-28"
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
  </div>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import {
  Follower,
  fetchFollowersOf,
  follow,
  isFollowing,
  toSubstrateAddress,
  unfollow,
} from '@/services/profile'
import { ButtonConfig } from '@/components/profile/types'

const { accountId } = useAuth()
const { $i18n } = useNuxtApp()

const props = defineProps<{
  user: Follower
}>()

const buttonRef = ref(null)

const isHovered = useElementHover(buttonRef)
const showFollowing = ref(false)

const { urlPrefix } = usePrefix()
const { data: followersCount, refresh: refreshCount } = useAsyncData(
  `followerCountOf/${props.user.address}`,
  () => fetchFollowersOf(props.user.address, 0).then((res) => res.totalCount),
)

const { data: isFollowed, refresh: refreshFollowStatus } = useAsyncData(
  `${accountId.value}/isFollowing/${props.user.address}`,
  () => isFollowing(accountId.value, props.user.address),
)

const refresh = () => {
  refreshCount()
  refreshFollowStatus()
}

const followConfig: ButtonConfig = {
  label: $i18n.t('profile.follow'),
  icon: 'plus',
  onClick: async () => {
    await follow({
      initiatorAddress: accountId.value,
      targetAddress: props.user.address,
    })
    showFollowing.value = true
    refresh()
  },
  disabled: props.user.address === toSubstrateAddress(accountId.value),
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
      targetAddress: props.user.address,
    }).then(refresh)
  },
  classes: 'hover:!border-k-red',
}

const buttonConfig = computed((): ButtonConfig => {
  if (showFollowing.value || (!isHovered.value && isFollowed.value)) {
    return { ...followingConfig, active: isHovered.value }
  }
  return isFollowed.value ? unfollowConfig : followConfig
})

watch(isHovered, (newHover, oldHover) => {
  const curserExited = newHover === false && oldHover === true
  if (curserExited) {
    showFollowing.value = false
  }
})
</script>
