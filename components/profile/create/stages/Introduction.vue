<template>
  <img :src="art" alt="Create Profile" class="h-56 object-cover w-full" />
  <div class="px-6 pb-5 pt-7">
    <div class="mb-7">
      <div class="flex items-center justify-center">
        <div
          class="px-4 py-2 rounded-full bg-k-accent-light-2 text-k-accent dark:text-k-accent-light text-xl font-bold">
          New
        </div>
        <span class="ml-4 font-bold text-xl text-center">
          Profile Customization
        </span>
      </div>
      <p class="mt-4 text-sm text-center">
        Make Your Profile Truly Yours In
        <span class="font-bold">Just 1 Minute</span>. Add Your Banner And
        Profile Image To Stand Out.
      </p>
    </div>
    <div class="flex justify-between">
      <NeoButton
        label="Skip For Now"
        no-shadow
        variant="text"
        class="w-48 !h-12"
        @click="emit('close')" />
      <NeoButton
        label="Create Profile"
        no-shadow
        variant="k-accent"
        class="w-48 !h-12"
        @click="emit('next')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
const { isDarkMode } = useTheme()
const art = computed(() =>
  isDarkMode.value
    ? '/profile/create-profile-dark.png'
    : '/profile/create-profile.png',
)

const emit = defineEmits(['next', 'close'])
</script>
