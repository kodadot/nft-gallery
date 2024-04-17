<template>
  <NeoButton label="Create Profile" variant="primary" @click="emit('click')" />
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

const emit = defineEmits(['click'])
</script>
