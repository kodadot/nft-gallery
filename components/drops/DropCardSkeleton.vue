<template>
  <div class="border border-border-color bg-background-color">
    <NeoSkeleton no-margin :rounded="false" height="174" />

    <div class="py-5 px-5 flex flex-col items-start gap-4">
      <div class="w-52">
        <NeoSkeleton no-margin class="w-full" :rounded="false" height="28" />
      </div>

      <div
        class="flex items-start md:items-center flex-col md:flex-row justify-between gap-4 md:gap-0 w-full">
        <div class="w-32">
          <NeoSkeleton
            height="34"
            width="100%"
            rounded
            no-margin
            border-radius="3rem" />
        </div>

        <div class="flex flex-row gap-4 w-24">
          <NeoSkeleton height="24" width="100%" :rounded="false" no-margin />
          <NeoSkeleton height="24" width="100%" :rounded="false" no-margin />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoSkeleton } from '@kodadot1/brick'
</script>
