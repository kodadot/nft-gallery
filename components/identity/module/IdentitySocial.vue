<template>
  <div>
    <a
      v-if="showTwitter && twitter"
      :href="`https://twitter.com/${twitter}`"
      target="_blank"
      rel="noopener noreferrer">
      <b-icon pack="fab" icon="twitter" />
      <span class="aligned">
        {{ twitter }}
      </span>
    </a>

    <div v-if="showDiscord && discord" class="is-flex is-align-items-center">
      <b-icon pack="fab" icon="discord" />
      <span class="aligned ml-2">
        {{ discord }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  twitter: string
  showTwitter: boolean
  discord: string
  showDiscord: boolean
}>()
</script>
