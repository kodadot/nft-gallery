<template>
  <div class="max-md:gap-6 grid grid-cols-1 md:grid-cols-3">
    <NeoButton
      variant="outlined-rounded"
      icon-left="arrow-left"
      @click="$router.back()">
      {{ $t('goBack') }}
    </NeoButton>

    <div>
      <h1 class="text-3xl font-bold">{{ title }}</h1>

      <hr class="!my-8" />

      <slot />
    </div>
    <div />
  </div>
</template>
<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'

defineProps<{ title: string }>()
</script>
