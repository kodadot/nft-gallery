<template>
  <IdentityModuleIdentityPopover
    :class="{ 'h-[28px]': size === 'small', 'h-[38px]': size === 'medium' }"
    :show-popover="props.size !== 'small'">
    <template #content>
      <ProfileAvatar :size="size === 'small' ? 26 : 38" :address="address" />
    </template>
  </IdentityModuleIdentityPopover>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    address: string
    size?: 'small' | 'medium'
  }>(),
  {
    size: 'medium',
  },
)

const { shortenedAddress, identity } = useIdentity({
  address: computed(() => props.address),
})

provide(
  'address',
  computed(() => props.address),
)
provide('shortenedAddress', shortenedAddress)
provide('identity', identity)
</script>
