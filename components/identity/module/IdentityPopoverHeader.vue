<template>
  <div class="popover-header pb-2">
    <h6 class="popover-user-heading">{{ $t('user') }}</h6>
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <nuxt-link
          class="text-base break-word mr-2 text-k-blue hover:text-k-blue-hover"
          :to="`/${urlPrefix}/u/${address}`">
          <span data-testid="identity-display">
            {{ identity?.display || shortenedAddress }}</span
          >
        </nuxt-link>
        <NeoIcon
          v-clipboard:copy="address"
          icon="copy"
          class="text-k-blue hover:text-k-blue-hover cursor-pointer"
          data-testid="identity-clipboard"
          @click="toast('Copied to clipboard')" />
      </div>
      <a
        v-if="identity?.twitter"
        v-safe-href="`https://twitter.com/${identity?.twitter}`"
        target="_blank"
        rel="nofollow noopener noreferrer"
        data-testid="identity-twitter">
        <NeoIcon
          pack="fab"
          icon="x-twitter"
          class="text-k-blue hover:text-k-blue-hover" />
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'

const address = inject('address')
const shortenedAddress = inject('shortenedAddress')

const identity = inject<{ [x: string]: string }>('identity')
const { urlPrefix } = usePrefix()
const { toast } = useToast()
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.popover-image {
  min-width: 60px;
}

.break-word {
  overflow-wrap: break-word;
}

.popover-header {
  @apply border-b border-k-grey;

  .popover-user-heading {
    font-size: 12px;

    @include ktheme() {
      color: theme('k-grey');
    }
  }
}
</style>
