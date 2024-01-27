<template>
  <div class="h-full relative">
    <div
      v-if="solid"
      class="relative w-full h-full rounded-[1.25rem] bg-k-grey-light" />

    <NeoSkeleton
      v-else
      id="skeleton-backdrop"
      class="z-[2]"
      rounded
      border-radius="20px"
      no-margin
      full-size
      variant="k-grey-light" />

    <div
      class="flex justify-center w-full absolute -translate-x-2/4 -translate-y-2/4 z-[3] left-2/4 top-2/4">
      <slot>
        <NeoIcon
          icon="spinner-third"
          class="spinner text-k-grey mr-6"
          size="large"
          spin />

        <div :class="{ 'w-52': fixedWidth }">
          <p class="capitalize font-bold text-base">
            {{ title || $t('general.doingSomeMagic') }}
          </p>
          <p class="capitalize text-base text-k-grey">
            {{ subtitle || $t('general.pleaseWait') }}
            <span v-if="showDots" class="dots" />
          </p>
        </div>
      </slot>
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
import { NeoIcon, NeoSkeleton } from '@kodadot1/brick'

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    withDots?: boolean
    solid?: boolean
  }>(),
  {
    withDots: false,
    solid: false,
  },
)

const showDots = computed(() => props.withDots || !props.subtitle)
const fixedWidth = computed(() => {
  const title = props.title || ''
  const subtitle = props.subtitle || ''
  return subtitle.length > title.length && showDots.value
})
</script>
