<template>
  <ProfileButtonConfig
    ref="buttonRef"
    :loading="loading"
    :button="buttonConfig"
    test-id="profile-button-multi-action" />
</template>
<script lang="ts" setup>
import { ButtonConfig } from './types'
import { follow, isFollowing, unfollow } from '@/services/profile'

const showFollowing = ref(false)
const loading = ref(false)
const buttonRef = ref()

const { $i18n } = useNuxtApp()
const { accountId } = useAuth()

const isHovered = useElementHover(buttonRef)

const emit = defineEmits(['follow:success', 'follow:fail', 'unfollow:success'])
const props = defineProps<{
  target: string
}>()

const { data: isFollowingThisAccount, refresh: refreshFollowingStatus } =
  useAsyncData(`${accountId.value}/isFollowing/${props.target}`, () =>
    isFollowing(accountId.value, props.target),
  )

const followConfig = computed<ButtonConfig>(() => ({
  label: $i18n.t('profile.follow'),
  icon: 'plus',
  disabled: !accountId.value,
  onClick: async () => {
    loading.value = true
    await follow({
      initiatorAddress: accountId.value,
      targetAddress: props.target,
    }).catch(() => {
      emit('follow:fail')
    })
    await refreshFollowingStatus()
    loading.value = false
    showFollowing.value = isFollowingThisAccount.value || false
    emit('follow:success')
  },
  classes: 'hover:!bg-transparent',
}))

const unfollowConfig = computed<ButtonConfig>(() => ({
  label: $i18n.t('profile.unfollow'),
  onClick: async () => {
    loading.value = true
    await unfollow({
      initiatorAddress: accountId.value,
      targetAddress: props.target,
    })
    await refreshFollowingStatus()
    loading.value = false
    emit('unfollow:success')
  },
  classes: 'hover:!border-k-red',
}))

const followingConfig: ButtonConfig = {
  label: $i18n.t('profile.following'),
}

const buttonConfig = computed<ButtonConfig>(() => {
  if (
    showFollowing.value ||
    (!isHovered.value && isFollowingThisAccount.value)
  ) {
    return { ...followingConfig, active: isHovered.value }
  }
  return isFollowingThisAccount.value
    ? unfollowConfig.value
    : followConfig.value
})

watch(isHovered, (newHover, oldHover) => {
  const curserExited = newHover === false && oldHover === true
  if (curserExited) {
    showFollowing.value = false
  }
})

defineExpose({ refresh: refreshFollowingStatus })
</script>