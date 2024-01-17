<template>
  <NeoMessage
    class="message-box"
    :class="{
      'message-box--toast': !noToast,
    }"
    :duration="realDuration"
    :auto-close="autoClose"
    @close="$emit('close')">
    <img src="/congrats-message-header.svg" class="congrats-message" />
    <div class="flex flex-col">
      <div class="title is-3 mb-4">
        {{ title }}
      </div>
      <hr class="my-2" />
      <div class="flex items-center justify-between">
        <span class="subtitle is-6 mb-0">
          {{ subtitle }}
        </span>

        <ShareDropdown no-shadow mobile-modal :link="shareLink" />
      </div>
    </div>
  </NeoMessage>
</template>

<script lang="ts" setup>
import { NeoMessage } from '@kodadot1/brick'

const props = defineProps<{
  title?: string
  subtitle?: string
  duration?: number
  noToast?: boolean
  shareLink?: string
}>()

const realDuration = computed(() => {
  return props.duration || 10000
})

const autoClose = computed(() => !props.noToast)
</script>

<style lang="scss">
@import '@/assets/styles/abstracts/variables';

.message-box {
  max-width: 500px;

  &--toast {
    @apply z-[100] fixed mx-auto rounded-none right-0 top-[100px] #{!important};
  }

  @include ktheme() {
    box-shadow: theme('primary-shadow');
    background-color: theme('background-color');
    border: 1px solid theme('border-color');
  }

  .message-body {
    @apply rounded-none border-l-0;
  }

  .congrats-message {
    filter: drop-shadow(4px 4px 0px rgb(0 0 0 / 1));
  }
}
</style>
