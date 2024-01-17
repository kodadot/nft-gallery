<template>
  <div class="h-full relative">
    <NeoSkeleton
      class="z-[2]"
      rounded
      border-radius="20px"
      no-margin
      full-size
      variant="k-grey-light" />

    <div
      class="flex justify-center w-full absolute -translate-x-2/4 -translate-y-2/4 z-[3] left-2/4 top-2/4">
      <NeoIcon
        icon="spinner-third"
        class="spinner text-k-grey mr-6"
        size="large"
        spin />

      <div>
        <p class="capitalize has-text-weight-bold is-size-6">
          {{ title || $t('general.doingSomeMagic') }}
        </p>
        <p class="capitalize is-size-6 text-k-grey">
          {{ subtitle || $t('general.pleaseWait') }}
          <span v-if="!subtitle" class="dots" />
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon, NeoSkeleton } from '@kodadot1/brick'

withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
  }>(),
  {},
)
</script>
