<template>
  <div class="flex flex-col justify-center items-center">
    <h2 class="font-bold text-xl mb-4 text-center">
      Choose how you'd like to <br />set up your profile
    </h2>
    <span class="text-sm text-k-grey mb-5"
      >Quick import from Farcaster, or start fresh</span
    >
    <NeoButton label="Farcaster" />
    <span class="my-4">- Or -</span>
    <NeoButton label="Start Fresh" @click="emit('click')" />
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
const emit = defineEmits(['click'])
</script>
