<template>
  <div>
    <a
      v-if="showTwitter && twitter"
      v-safe-href="`https://twitter.com/${twitter}`"
      target="_blank"
      rel="nofollow noopener noreferrer"
    >
      <KIcon
        name="i-ri:twitter-x-fill"
      />
      <span class="aligned">
        {{ twitter }}
      </span>
    </a>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  twitter: string
  showTwitter: boolean
}>()
</script>
