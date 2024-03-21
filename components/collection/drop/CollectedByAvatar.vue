<template>
  <IdentityModuleIdentityPopover
    class="h-[38px]"
    :class="{ 'h-[28px]': size === 'small' }">
    <template #content>
      <Avatar :size="size === 'small' ? 26 : 38" :value="address" />
    </template>
  </IdentityModuleIdentityPopover>
</template>

<script lang="ts" setup>
const props = defineProps<{
  address: string
  size?: 'small' | 'medium' | 'large'
}>()

const { shortenedAddress } = useIdentity({
  address: computed(() => props.address),
})

provide('address', props.address)
provide(
  'shortenedAddress',
  computed(() => shortenedAddress.value),
)
</script>
