<template>
  <a
    v-safe-href="'https://warpcast.com/~/channel/koda'"
    target="_blank"
    class="hover:text-text-color flex p-2 bg-background-color border border-text-color rounded-[1.5rem] items-center"
  >
    <div class="bg-purple-light-color flex gap-3 px-3 py-2 rounded-[1rem]">
      <img :src="farcasterIcon">
      <div class="text-purple-dark-color">
        {{ $t('landing.connectFarcaster') }}
      </div>
    </div>
    <KIcon
      name="i-mdi:arrow-right"
      class="ml-2"
    />
  </a>
</template>

<script setup lang="ts">
const { isDarkMode } = useTheme()

const farcasterIcon = computed(() =>
  isDarkMode.value ? '/farcaster-dark.svg' : '/farcaster-light.svg',
)
</script>
