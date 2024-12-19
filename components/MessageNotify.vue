<template>
  <NeoMessage
    class="message-box"
    :class="{
      'message-box--toast': !noToast,
    }"
    :duration="realDuration"
    :auto-close="autoClose"
    @close="$emit('close')"
  >
    <img
      src="~/assets/svg/congrats-message-header.svg"
      class="congrats-message"
    >
    <div class="flex flex-col">
      <div class="title is-3 mb-4">
        {{ title }}
      </div>
      <hr class="my-2">
      <div class="flex items-center justify-between">
        <span class="subtitle is-6 mb-0">
          {{ subtitle }}
        </span>

        <ShareDropdown
          no-shadow
          mobile-modal
          :link="shareLink"
        />
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
