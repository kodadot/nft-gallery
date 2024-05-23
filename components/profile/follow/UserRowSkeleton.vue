<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12">
        <NeoSkeleton
          no-margin
          circle
          rounded
          width="100%"
          height="100%"
          class="w-12 h-12" />
      </div>

      <div class="flex flex-col gap-[6px]">
        <NeoSkeleton height="22" width="60" rounded no-margin />

        <div class="flex items-center">
          <NeoSkeleton height="16" width="10" rounded no-margin />
          <NeoSkeleton height="16" width="40" rounded no-margin />
        </div>
      </div>
    </div>

    <NeoSkeleton height="40" width="100" rounded no-margin position="right" />
  </div>
</template>

<script setup lang="ts">
import { NeoSkeleton } from '@kodadot1/brick'
</script>
