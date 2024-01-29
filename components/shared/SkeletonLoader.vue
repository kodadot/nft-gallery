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

        <div :style="{ width: textContainerWidth }">
          <p ref="titleRef" class="capitalize font-bold text-base">
            {{ title || $t('general.doingSomeMagic') }}
          </p>
          <p class="capitalize text-base text-k-grey">
            <span ref="subtitleRef" class="inline-block">{{
              subtitle || $t('general.pleaseWait')
            }}</span>
            <span v-if="showDots" class="dots ml-1" />
          </p>
        </div>
      </slot>
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
import { NeoIcon, NeoSkeleton } from '@kodadot1/brick'

const DOTS_PLUS_MARGIN_WIDTH = 20 //px

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

const titleRef = ref<HTMLElement>()
const subtitleRef = ref<HTMLElement>()
const textContainerWidth = ref()

const showDots = computed(() => props.withDots || !props.subtitle)

const calculateTextContainerWidth = () => {
  if (!showDots.value) {
    return
  }

  nextTick(() => {
    const title = titleRef.value?.clientWidth || 0
    const subtitle =
      (subtitleRef.value?.clientWidth || 0) + DOTS_PLUS_MARGIN_WIDTH
    textContainerWidth.value = subtitle > title ? `${subtitle}px` : undefined
  })
}

watch([() => props.title, () => props.subtitle], calculateTextContainerWidth, {
  immediate: true,
})
</script>
