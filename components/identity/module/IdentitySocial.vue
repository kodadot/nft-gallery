<template>
  <div>
    <a
      v-if="showTwitter && twitter"
      v-safe-href="`https://twitter.com/${twitter}`"
      target="_blank"
      rel="nofollow noopener noreferrer">
      <NeoIcon pack="fab" icon="x-twitter" />
      <span class="aligned">
        {{ twitter }}
      </span>
    </a>

    <div v-if="showDiscord && discord" class="is-flex is-align-items-center">
      <NeoIcon pack="fab" icon="discord" />
      <span class="aligned ml-2">
        {{ discord }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NeoIcon } from '@kodadot1/brick'

defineProps<{
  twitter: string
  showTwitter: boolean
  discord: string
  showDiscord: boolean
}>()
</script>
