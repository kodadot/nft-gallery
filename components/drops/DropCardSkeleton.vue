<template>
  <div class="border border-border-color">
    <NeoSkeleton no-margin :rounded="false" height="174" />

    <div class="py-5 px-5 flex flex-col items-start gap-4">
      <div class="w-52">
        <NeoSkeleton no-margin class="w-full" rounded height="24" />
      </div>

      <div class="flex items-center justify-between w-full">
        <div>
          <NeoSkeleton rounded no-margin height="34" class="!w-32" />
        </div>

        <div class="flex flex-row gap-4 w-24">
          <NeoSkeleton :rounded="false" height="12" no-margin width="100%" />
          <NeoSkeleton :rounded="false" no-margin height="12" width="100%" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoSkeleton } from '@kodadot1/brick'
</script>
