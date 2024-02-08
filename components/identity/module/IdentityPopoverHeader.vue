<template>
  <div class="pb-2 border-b border-k-grey">
    <h6 class="text-xs text-k-grey">{{ $t('user') }}</h6>
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <nuxt-link
          class="text-base break-words mr-2 text-k-blue hover:text-k-blue-hover"
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
