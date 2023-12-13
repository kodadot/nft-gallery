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
        <ShowQRModal
          class="share-option"
          :address="realworldFullPath"
          :title="$t('sharing.nft')"
          type="is-primary" />
      </div>
    </div>
  </NeoMessage>
</template>

<script lang="ts" setup>
import { NeoMessage } from '@kodadot1/brick'

const route = useRoute()
const props = defineProps<{
  title?: string
  subtitle?: string
  duration?: number
  noToast?: boolean
}>()

const realDuration = computed(() => {
  return props.duration || 10000
})

const autoClose = computed(() => !props.noToast)

const realworldFullPath = computed(() => {
  return `${window.location.origin}${route.fullPath}`
})
</script>

<style lang="scss">
@import '@/assets/styles/abstracts/variables';

.message-box {
  max-width: 500px;

  &--toast {
    z-index: 100;
    position: fixed;
    border-radius: 0;
    top: 100px;
    right: 0;
    margin-left: auto;
    margin-right: auto;
  }

  @include ktheme() {
    box-shadow: theme('primary-shadow');
    background-color: theme('background-color');
    border: 1px solid theme('border-color');
  }

  .message-body {
    border: none;
  }

  .congrats-message {
    filter: drop-shadow(4px 4px 0px rgb(0 0 0 / 1));
  }
}
</style>
