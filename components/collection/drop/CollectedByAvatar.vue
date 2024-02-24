<template>
  <IdentityModuleIdentityPopover class="h-[38px]">
    <template #content>
      <Avatar :size="38" :value="address" />
    </template>
  </IdentityModuleIdentityPopover>
</template>

<script lang="ts" setup>
const props = defineProps<{
  address: string
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
