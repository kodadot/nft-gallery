<template>
  <IdentityModuleIdentityPopover
    :class="{ 'h-[28px]': size === 'small', 'h-[38px]': size === 'medium' }"
    :show-popover="props.size !== 'small'">
    <template #content>
      <Avatar :size="size === 'small' ? 26 : 38" :value="address" />
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

const { shortenedAddress } = useIdentity({
  address: computed(() => props.address),
})

provide('address', props.address)
provide(
  'shortenedAddress',
  computed(() => shortenedAddress.value),
)
</script>
