<template>
  <IdentityModuleIdentityPopover>
    <template #content>
      <div
        class="rounded-full min-w-[236px] h-[62px] md:w-auto border border-k-shade inline-flex justify-start px-2.5"
        data-testid="drop-created-by-container"
      >
        <div class="flex items-center">
          <ProfileAvatar
            :size="48"
            :address="address"
          />
          <div class="ml-3.5">
            <NuxtLink :to="`/${urlPrefix}/u/${address}`">
              {{ identity?.display || shortenedAddress }}
            </NuxtLink>
            <div class="text-k-grey is-size-6">
              {{ shortenedAddress }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </IdentityModuleIdentityPopover>
</template>

<script lang="ts" setup>
const { urlPrefix } = usePrefix()

const props = defineProps<{
  address: string
}>()

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
