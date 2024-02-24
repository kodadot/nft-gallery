<template>
  <div
    class="rounded-full min-w-[236px] h-[62px] md:w-auto border border-k-shade inline-flex justify-start px-2.5">
    <div class="flex items-center">
      <Avatar :size="48" :value="address" />
      <div class="ml-3.5">
        <NuxtLink :to="`/${urlPrefix}/u/${address}`">
          <IdentityIndex :address="address" />
        </NuxtLink>
        <div class="text-k-grey is-size-6">
          {{ shortenedAddress }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { urlPrefix } = usePrefix()

const props = defineProps<{
  address: string
}>()

const { shortenedAddress } = useIdentity({
  address: computed(() => props.address),
})
</script>
