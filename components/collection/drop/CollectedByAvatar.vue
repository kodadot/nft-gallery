<template>
  <IdentityModuleIdentityPopover
    class="h-[38px]"
    :class="{ 'h-[28px]': isDropsPage }">
    <template #content>
      <Avatar :size="isDropsPage ? 26 : 38" :value="address" />
    </template>
  </IdentityModuleIdentityPopover>
</template>

<script lang="ts" setup>
const props = defineProps<{
  address: string
  isDropsPage: boolean
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
