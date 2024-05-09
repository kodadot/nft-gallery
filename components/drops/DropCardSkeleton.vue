<template>
  <div class="border border-card-border-color bg-background-color h-min">
    <div class="aspect-video">
      <NeoSkeleton no-margin :rounded="false" height="100%" class="h-full" />
    </div>

    <div
      class="min-h-[115px] py-5 px-2 sm:!px-5 flex flex-col justify-between gap-4">
      <div class="w-52">
        <NeoSkeleton no-margin class="w-full" :rounded="false" height="28" />
      </div>

      <div
        class="flex justify-between items-center flex-wrap gap-y-4 gap-x-2 w-full">
        <div class="w-16 flex gap-2">
          <NeoSkeleton height="28" width="100%" :rounded="false" no-margin />
          <NeoSkeleton height="28" width="100%" :rounded="false" no-margin />
        </div>

        <div class="flex flex-row gap-4 w-28">
          <NeoSkeleton height="28" width="100%" :rounded="false" no-margin />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoSkeleton } from '@kodadot1/brick'
</script>
