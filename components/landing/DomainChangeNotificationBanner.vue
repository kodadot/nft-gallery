<template>
  <a
    v-safe-href="`https://koda.art`"
    target="_self"
    class="hover:text-text-color flex items-center p-2 gap-[10px] bg-background-color border border-text-color rounded-[1.5rem]"
  >
    <NeoIcon
      icon="circle-info"
      size="large"
    />

    <div
      class="bg-k-accent-light-2 flex flex-wrap gap-2 px-3 py-2 rounded-[14px]"
    >
      <div class="font-bold">KodaDot.xyz</div>
      <div>{{ $t('landing.becoming') }}</div>
      <div class="font-bold">Koda.art</div>
    </div>
    <NeoIcon icon="arrow-right" />
  </a>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
</script>
