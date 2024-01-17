<template>
  <div class="border border-border-color">
    <NeoSkeleton no-margin :rounded="false" height="272" />
    <div class="py-4 px-5 flex items-center justify-between">
      <div class="w-52">
        <NeoSkeleton class="w-full" :count="2" :rounded="false" height="12" />
      </div>

      <div class="flex w-[9rem] md:w-[20%]">
        <NeoSkeleton
          :count="2"
          :rounded="false"
          height="12"
          class="flex items-end column" />
        <NeoSkeleton
          :count="2"
          :rounded="false"
          height="12"
          class="flex items-end column" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoSkeleton } from '@kodadot1/brick'
</script>
